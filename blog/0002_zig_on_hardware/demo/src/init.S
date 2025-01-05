.section .text
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
