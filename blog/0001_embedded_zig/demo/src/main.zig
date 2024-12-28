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
