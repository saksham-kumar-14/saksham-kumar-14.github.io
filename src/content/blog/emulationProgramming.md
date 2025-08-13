---
title: 'Emulation Programming'
date: 2025-08-12
description: 'About emulation programmming and emulators in general'
tags: ['intro', 'astro']
---

Yo! I have been reading about emulators for quite while now. I decided to write this blog to share some stuff I have learnt and also these will be notes for me as well. I will continue updating this as my understanding grows.

## What/ Why

- The process of recreating a target hardware on your source machine is called Emulation.
- Why do? Because it is fun and legal! While emulating we can get the instructions (which define how the machine will work) either from the official docs or by _reverse enginnering_ ourselves. Recreating stuff using reverse engineering is legal (some exceptions, like the yuzu case).

## How to emulate

- Some stuff to be taken care of while emulating:
  - The CPU architecture. Like most modern computer follow the von neumann architecture.
  - CPU is the core of emulation. The main method to know about the time in a computer is the same executed instruction time in the CPU (counting the CPU cycles).
  - Two type of CPU emulation:
    1. `Interpreted`: Only one fetch decode while loop collects data and do stuff.
    2. `Binary Translation`: Convert the binary code of the target machine to the binary code of source machine. So, that program can be run natively

## Interpreted Emulation

- A basic fetch decode loop which I talked about earlier runs.
- A basic CPU reads bytes from an address of the memory pointed by a special register (PC or Program Counter).
- Some CPU also have SP(Stack pointer) which points to a stack memory of some memory addresses like local variables, function return addresses, flags. Becuase it is a push/pop operation, we can easily keep track of existing addresses as well as remove them.
- Byte or group of bytes which define a single instruction are called opcodes

### C trick in emulators to access the same register data in multiple ways

<pre>
typedef union
{
    UINT32 w;   /* Access it as a 32-bit value (maybe for full register set) */
    UINT16 w;   /* Access it as a 16-bit value */
    struct
    {
        UINT8 l, h;  /* Low and High byte parts */
        UINT16 pad;  /* Padding for little-endian alignment */
    } b;       /* Access as two bytes */
} i8080Reg;
</pre>

- Using this registers can be accessed as:
  1. 32 - bit value
  2. 16 - bit value
  3. Two separate bytes (low and high parts).
  - Note that padding was added in the struct so that in one operation the whole 32 bit address block will be overwritten. As the size of a `union` is the size of its largest member. By default, the CPU detects `UINT16 w` so there will be no alignment issues there.

### Instructions, flag, memory and interrupts

Given is a basic instruction operation performed during emulation.

<pre>
instruction (operands){
    get_operands;
    perform_calculations;
    store_result;
    update_time;
    return to the main loop / fetch next opcode;
}
</pre>

#### Flags

- Flags are usually the harder part to emulate because they are always changing. There are usually a lot of flags defined for every operation. So, it takes a lot of computation and remember we cant emulate in parallel like it is performed in CPUs. I mean we can do it in parallel but it takes a lot of efforts in synchronization and stuff. So, we generally dont prefer that.
- Some flag examples, zero flag, carry flag, sign flag, etc.
- This wont be a problem if your host CPU (the one running the emulator) has similar flags to your guest CPU (the one you are emulating). eg 8080 and x86 have similar flags. You can use inline assembly to perform this

#### Memory

- Memory emulation slow because it is extremely common. Every instruction needs to fetch its code, and many need to read/write data.
- This may involve scanning lists, calling functions, handling bank switching, and simulating MMU behavior.

### Other Performance Concenrs

1. `Alignment Checks `- Some CPUs forbid multi-byte reads/writes to unaligned addresses (e.g., reading a 32-bit word from address 0x0001). You must check and raise that exception
2. `Endianness conversion` - If the emulated CPU uses a different byte order (big-endian vs. little-endian) than the host then every multi-byte read/write needs byte swapping

\*\* So, interpreted emulation can be quite slow, but you can make them fast by writing them in `assembly` instead ;).

- But there will still be a problem of portability. Assembly is written for a particular CPU architecture, you cant just run an assembly code in two different machines. So, there is a trade-off between portability and performance.

---

# Making NES Emulator

## CPU Core

- Registers
  - A: Accumulator (8-bit)
  - X, Y: Index Registers (8-bit)
  - P: Processor Status (NV-BDIZC flags, 8-bit)
  - SP: Stack Pointer (8-bit)
  - PC: Program Counter (16-bit)
  - No decimal mode [D Flag is ignored]

- Flags
  - C_FLAG: Carry Flag
  - Z_FLAG: Zero Flag
  - I_FLAG: Interrupt Disable
  - B_FLAG: Break
  - U_FLAG: Unused
  - V_FLAG: Overflow
  - N_FLAG: Negative

- Functions:
  1. cpu_reset - reset CPU state
  2. cpu_step - executes one CPU instruction

- The header file for the following can look something like:
<pre>
#ifndef CPU6502_H
#define CPU6502_H
#include <stdint.h>

typedef union {
    uint16_t w;
    struct {
        #if **BYTE_ORDER** == **ORDER_LITTLE_ENDIAN**
            uint8_t l;
            uint8_t h;
        #else
            uint8_t h;
            uint8_t l;
        #endif
    } b;
} reg16_t;

typedef struct {
    uint8_t A;
    uint8_t X, Y;
    uint8_t P;
    uint8_t SP;
    reg16_t PC;
    uint64_t cycles;
} CPU6502;

enum{
    C_FLAG = 1 << 0,
    Z_FLAG = 1 << 1,
    I_FLAG = 1 << 2,
    D_FLAG = 1 << 3,
    B_FLAG = 1 << 4,
    U_FLAG = 1 << 5,
    V_FLAG = 1 << 6,
    N_FLAG = 1 << 7
};

void cpu_reset(CPU6502 *cpu, uint8_t (*read)(uint16_t));
void cpu_step(CPU6502 *cpu, uint8_t (*read)(uint16_t), void(\*write)(uint16_t, uint8_t));

#endif

</pre>

---

## References

- [My Slides](https://saksham-kumar-14.github.io/emulationPPT)
- [NES Emulator](https://github.com/saksham-kumar-14/NESish)
