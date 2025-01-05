fn print(message: []const u8) void {
    // The uart data register for the QEMU virt platform is at address 0x10000000
    const uart_register_address: usize = 0x10000000;
    const uart_lsr_offset: usize = 0x05;

    // Set the uart data out to the above address
    const uart_data_out: *volatile u8 = @ptrFromInt(uart_register_address);

    // Line status register
    const uart_lsr_reg: *volatile u8 = @ptrFromInt(uart_register_address + uart_lsr_offset);

    // Iterate through the given slice, and set the data out to the current character
    for (message) |character| {
        while ((uart_lsr_reg.* & 0x60) == 0) {}
        // If the the incoming character is an ASCII carriage return, convert to ASCII line feed
        uart_data_out.* = if (character == 0x0D) 0x0A else character;
    }
}

// Export the Zig entry point so the symbol exists in assembly land
export fn start() noreturn {
    print("Hello, World!\n");
    while (true) {}
}
