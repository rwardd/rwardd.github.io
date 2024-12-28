---
title: Ryan Ward
subtitle: Embedded Software Engineer
version: v1.0.0
email: rwardd@outlook.com.au
linkedin: "https://www.linkedin.com/in/rwardd/"
resume: https://nbviewer.org/github/rwardd/rwardd.github.io/blob/main/resume.pdf
github: https://github.com/rwardd
blog: https://ryanward.tech/blog/blog.html
---

## About Me
I am a 23 year old software/electronics/computer engineer. I have a formal education in electrical 
and computer engineering, however, most of my professional experience has consisted of writing firmware,
software and gateware for a variety of applications. I am passionate about embedded programming, electronics, and
wherever software interacts with hardware.

In addition to writing software, I have been involved with a lot of
hardware verification and testing, including bringing up new PCBs, porting firmware drivers to new platforms and architectures,
and debugging RF circuits. I have a strong understanding of embedded programming, integrated circuit operation, high-speed data protocols, radio frequency design & implementation, and
design processes for complex projects, both in the software and hardware domain.

Outside of work hours, I spend my time working on some fun [side projects](#projects), and I will try to start
writing about interesting topics in my [blog](blog/blog.html). I enjoy working on projects that improve my knowledge and skillset, 
examples include booting Linux on a softcore RISC-V processor, experimenting around with my HackRF 
PortaPack, learning Zig, writing a low-level operating system, the list goes on.

I love computers and their history - humanity's
progression from vacuum tubes to RTX 4090's will always be something that fascinates me. Discovering 
historical and influential figures in the computing world is something I enjoy, and I admire the likes of 
Ritchie, Thompson, Knuth, Lattner, Stallman, Torvalds and Hotz to name a few.

## Experience
* **Praetorian Aeronautics (2025 - current)**
    - Yet to start
<p></p>
* **Boeing Defence Australia (2023 - 2025)**
    - Implemented firmware on STM32 targets on a FreeRTOS platform
    - Wrote and integrated custom IC drivers, increasing usability for internal customers
    - Collaborated with teams of engineers across domains to deliver projects on schedule
    - Debugging firmware (GDB is awesome)
    - PCBA/CCA verification
    - Custom IP core development in VHDL
    - HDL development targeting the Zynq7000 SoC using Vivado/Vitis
    - Unit testbench development
    - Debugging RF hardware and gateware
    - C standard library testing
<p></p>
* **University of Queensland (2022 - 2023)**
    - Developed a decentralised application for event ticketing
<p></p>
* **Various Startups (2021 - 2022)**
    - Casual software development

## Skills
- Languages: C, Python, VHDL, C++, RISC-V & AArch64 ASM, Matlab, Tcl, Zig, Verilog
- Development Tools: Git, GDB, Vivado, Vitis, Yosys suite
- Platforms & Frameworks: Yocto, Buildroot, Zephyr, FreeRTOS
- Hardware: STM32 microcontrollers, Raspberry Pi Pico, ESP32, Lattice FPGAs (ECP5), Xilinx FPGAs (Zynq7000, Zynq Ultrascale), various RF integrated circuits
- Test equipment: Oscilloscopes, Vector Network Analysers, Spectrum Analysers, Frequency Counters, PassMark
- Protocols: SPI, IIC, I2S, USB (2 & 3), USB-PD, DDR

## Education
I hold a Bachelor's (Honours) and Master's degree of Electrical and Computer Engineering from the University of Queensland, Australia.

## Projects
**Zip RTOS**
: In an effort to keep up with the times, I wanted to learn the [Zig](https://ziglang.org/) programming language in a freestanding context.
What better way than to try and write a simple baremetal RTOS? The project is hosted [on GitHub](https://github.com/rwardd/zip), and still needs a lot of work.
: So far, I have written a super basic task scheduler that will round-robin schedule an arbitrary number of tasks. I have spent most of my time understanding the
RISC-V architecture and how different operating systems implement their context switching mechanisms rather than actually writing and learning Zig :D

**Pico Mesh**
: A LoRa based mesh network that allows Raspberry Pi Pico modules to communicate with one another.
Built on top of Zephyr RTOS, running on the RP2040 with a Semtech SX1276 LoRa module and a ST7789 OLED display.

## Open Source Contributions
I have contributed code to the FreeRTOS-Kernel and STM32 USB-PD Core repositories. 
I would love to fill this section out more as my skills progress.

## Shout-out
Huge thanks to [Oskar Wickström](https://x.com/owickstrom) for their [article](https://owickstrom.github.io/the-monospace-web/) and template of which this website is built from.
The source code for this website, and my blog, can be found on [my GitHub](https://github.com/rwardd/rwardd.github.io).
