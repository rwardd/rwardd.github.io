/// Import the standard library and define some commonly used types
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

        // The chosen model is just a generic RISC-V 32 processor with no extensions
        .cpu_model = .{ .explicit = &std.Target.riscv.cpu.generic_rv32 },
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
