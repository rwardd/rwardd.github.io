---
title: Embedded Zig
---
# Embedded Zig
[Home](../../index.html) [Blog Index](../blog.html)

Ryan Ward, December 2024

## Purpose
The [Zig](https://ziglang.org/) language has been rising in popularity over the last few years, with
many hailing it as a "replacement for C". I am a huge C fan, and wanted to see what a replacement
would look like, especially in the context of embedded freestanding systems. I set out to create a
simple task scheduler, that I eventually want to build out to a basic real time operating system (RTOS).

This short post will outline the basics of getting a "Hello World" example up and running on a
virtual 32-bit RISC-V processor.

## Prerequisites
Install QEMU's riscv32 emulator using (for Arch Linux):
```
sudo pacman -S qemu-system-riscv
```
To install Zig, follow the [instructions provided](https://ziglang.org/learn/getting-started/).

## Some Zig code
Once we have specified a build script, let's create the entrypoint to our baremetal program. First,
create a `src` directory and in it, a `main.zig` file.
```
mkdir src && cd src && touch main.zig
```

In your favourite editor, open the `main.zig` file and populate it with the following:
```
fn print(message: []const u8) void {
    // The uart data register for the QEMU virt platform is at address 0x10000000
    const uart_register_address: usize = 0x10000000;

    // Set the uart data out to the above address
    const uart_data_out: *u8 = @ptrFromInt(uart_register_address);

    // Iterate through the given slice, and set the data out to the current character
    for (message) |character| {
        uart_data_out.* = character;
    }
}

// Export the Zig entry point so the symbol exists in assembly land
export fn start() noreturn {
    print("Hello, World!\n");
    while (true) {}
}
```

This is a very simple program that will print the message "Hello, World!" to the terminal before
infinitely looping. The message is printed using QEMU's virtual UART device. This address can be found
by dumping the `devicetree` and using the `dtc` tool to reconstruct the `devicetree`:

```bash
# Ensure `dtc` is installed
sudo pacman -S dtc
qemu-system-riscv32 -machine virt -machine dumpdtb=rv32virt.dtb
dtc -I dtb -O dts -o rv32virt.dts rv32virt.dtb
```

After opening `rv32virt.dts` in a text editor, we can search for the `serial` keyword (I have no idea
why it's labeled as `serial` in the `.dts` file and not `uart`, whereas other resources clearly show
the device labeled as `uart`):

```dts
serial@10000000 {
		interrupts = <0x0a>;
		interrupt-parent = <0x03>;
		clock-frequency = "", "8@";
		reg = <0x00 0x10000000 0x00 0x100>;
		compatible = "ns16550a";
	};
```
We can see that the compatible chip is `ns16550a`, which matches with the [online documentation](https://www.qemu.org/docs/master/system/riscv/virt.html) for QEMU.
Looking at [the documentation](http://www.elektronikjk.com/elementy_czynne/IC/NS16550A.pdf) for the UART chip, particularly the Summary of Registers on page 14, the Transmitter Holding Register is located
at address 000 (zero offset from address 0x10000000, which is why we can write the data bytes directly to the UART device address). QEMU handles the initialisation of the
serial device for us.

## The initialisation
We need to define a memory layout so that our program can be linked together and an `elf` executable
can be created. Create a file in the `src` directory called `link.ld` with the following contents:

```ld
OUTPUT_ARCH("riscv")
ENTRY(_start)

/* From the QEMU devicetree dump, we can see that the memory starts at address 0x8000000 */
BASE_ADDRESS = 0x80000000;

MEMORY
{
    /* We can really have any amount of memory we want, the maximum being 0x1000000 bytes */
    ram (rwxa): ORIGIN = BASE_ADDRESS, LENGTH = 128M
}

SECTIONS
{
    . = BASE_ADDRESS;
    .text : ALIGN(4K) {
        *(.init);
        *(.text);
    }

    .rodata : ALIGN(4K) {
        *(.rodata);
    }

    .data : ALIGN(4K) {
        *(.data);
    }

    .bss : ALIGN(4K) {
        *(.bss);
    }

    /* Export some bss and stack symbols for our startup procedure */
    PROVIDE(_bss_start = ADDR(.bss));
    PROVIDE(_bss_end = _bss_start + SIZEOF(.bss));
    PROVIDE(_stack_top = _bss_end + 0x1000);
}

```

For the (virtual) CPU to actually know what to with our program, we first have to set up a stack pointer.
In the `src` directory, create a file named `init.S`, with the following contents:
```asm
.section .init
.global _start

// Entry point
_start:
    la      sp, _stack_top
    la      a1, _bss_start
    la      a2, _bss_end

// Loop and clear the bss section
clear_bss:
    sw      zero, (a2)
    addi    a1, a1, 4
    bltu    a1, a2, clear_bss

entrypoint:
    tail  start

// Endless loop
wait_interrupt:
    wfi
    j wait_interrupt

```

This is a very simple and standard initialisation procedure. You will notice that it is loading in the
valued of `_stack_top`, `_bss_start` and `_bss_end` (all of which are memory addresses), clearing the `bss` section by
setting all bits to 0, then jumping to the previously exported `start` symbol in our `main.zig` file.

## The build script
The standard Zig build system has a central `build.zig` file that outlines the build process for the
code base. In our case, we will construct a very simple build script.
The blob below shows the build script used:

```zig
// Import the standard library and define some commonly used types
const std = @import("std");
const CrossTarget = std.zig.CrossTarget;
const Target = std.Target;
const Feature = std.Target.Cpu.Feature;

pub fn build(b: *std.Build) void {
    // Give an option to run QEMU in GDB server mode
    const debug = b.option(bool, "debug", "Run qemu in debug mode") orelse false;

    // Define a target CPU
    const target = std.Target.Query{
        // Our target is the RISC-V 32-bit architecture
        .cpu_arch = Target.Cpu.Arch.riscv32,

        // There will be no operating system running on the target, therefore it is freestanding
        .os_tag = Target.Os.Tag.freestanding,

        // There is no ABI defined on our target, as it is baremetal (no C standard libraries)
        .abi = Target.Abi.none,

        // The chosen model is just a baseline RISC-V 32 processor, however, it could be any valid
        // target model (e.g., a SiFive E20)
        .cpu_model = .{ .explicit = &std.Target.riscv.cpu.baseline_rv32 },
    };

    // Specify the entrypoint of our program
    const exe = b.addExecutable(.{
        // Fetch our target platform
        .target = b.resolveTargetQuery(target),

        // The name of our final executable
        .name = "main",

        // The entrypoint of our program
        .root_source_file = b.path("src/main.zig"),
    });

    exe.addAssemblyFile(b.path("src/init.S"));
    exe.setLinkerScriptPath(b.path("src/link.ld"));
    b.installArtifact(exe);

    // Standard QEMU arguments for a RISC-V virt machine
    const qemu_args = .{
        "qemu-system-riscv32",
        "-machine",
        "virt",
        "-bios",
        "none",
        "-kernel",
        "zig-out/bin/main",
        "-nographic",
    };

    const qemu = b.addSystemCommand(&qemu_args);

    // If the debug flag was specified above, add the debug args
    if (debug) {
        qemu.addArg("-s");
        qemu.addArg("-S");
    }

    // Ensure the QEMU step depends on the executable being built
    qemu.step.dependOn(b.default_step);

    // Allows us to execute `zig build run` to build & run the executable
    const run_step = b.step("run", "Start qemu");
    run_step.dependOn(&qemu.step);
}
```

## Run it
With everything together, we should be now able to run the following from our working directory:
```bash
zig build run
```
With the output:
```bash
Hello, World!
```
Note, to exit QEMU, press `Ctrl-A`, then `x`.

## Wrap it up
Yes, I know, this fun activity had just as much QEMU + RISC-V content as it did Zig, a lesson I quickly
learned when initially writing the code. Nonetheless, it gives a nice overview of using Zig in a freestanding/embedded context.
All the code in this post can be found on [my GitHub](https://github.com/rwardd/rwardd.github.io/tree/main/blog/0001_embedded_zig/demo).
A keen eye would've noticed that the build script also included debugging options for QEMU, however, I'll leave the debugging process
for another post. Any questions, feel free to send me an email (rwardd@outlook.com.au) or [message me on x dot com](https://x.com/crank1_).
