########################################

# AUTHORS (Group 20):

# Deep Sharma 2020370
# Dhruv Malik 2020373
# Karan Singh 2020383


# Arithmetic unit

# contains functions for instructions that
# carry out arithmetic operations
# may set flags

# INPUT: operands
# OUTPUT: NONE 
########################################

from components.RF import *
from components.flagOperations import *

def add(operands):
    resetFlag()

    register2=register_value[operands[1]]
    register3=register_value[operands[2]]

    register1=0
    carry=0

    for shift in range(0,16):

        bit2=((1<<shift)&register2)>>shift
        bit3=((1<<shift)&register3)>>shift

        sum=bit2^bit3

        register1=register1|((sum^carry)<<shift)

        carry=(sum&carry)|(bit2&bit3)

        if shift==15 and carry:
            setOverflow()

    register_value[operands[0]]=register1

def sub(operands):
    # ============================
    # Helper functions
    # ============================

    def twosComplement(x):
        # INPUT: 16-bit number
        # OUTPUT: 16-bit number
        result = add((~x) & 65535, 1)
        return result

    def add(x,y):
        # INPUT: 16-bit number
        # OUTPUT: 16-bit number
        while y != 0:
            x,y = x^y, (x&y)<<1
        return x & 65535

    # ============================

    resetFlag()

    destination = operands[0]
    minuend = register_value[operands[1]]
    subtrahend = register_value[operands[2]]

    if (minuend < subtrahend):
        result = 0
        setOverflow()
    else:
        result = add(minuend, twosComplement(subtrahend))

    register_value[destination] = result

def mul(operands):
    # ============================
    # Helper functions
    # ============================
    def add(x,y):
        # INPUT: 16-bit number
        # OUTPUT: 16-bit number
        while y != 0:
            x,y = x^y, (x&y)<<1
        return x & 65535
    # ============================

    resetFlag()

    l, m, n = map(register_value.get, operands)
    bitshifter = 0
    result = 0

    while(bitshifter < 16):
        x = (n & (1 << bitshifter))
        if x >> bitshifter:
            result = add(result, m << bitshifter)

    #accomodate overflow during peer review

    register_value[l] = result

def div(operands):
    # ============================
    # Helper functions
    # ============================

    def twosComplement(x):
        # INPUT: 16-bit number
        # OUTPUT: 16-bit number
        result = add((~x) & 65535, 1)
        return result

    def add(x,y):
        # INPUT: 16-bit number
        # OUTPUT: 16-bit number
        while y != 0:
            x,y = x^y, (x&y)<<1
        return x & 65535

    # ============================

    resetFlag()

    dividend, divisor = map(register_value.get, operands)
    nBits = 16
    
    shifted_divisor = divisor << nBits
    quotient = 0
    remainder = dividend

    while remainder >= divisor:
        while shifted_divisor > remainder:
            shifted_divisor >>= 1
            nBits = add(nBits, twosComplement(1))
        quotient = add(quotient, 1 << nBits)
        remainder = add(remainder, twosComplement(shifted_divisor))

    register_value['000'] = quotient
    register_value['001'] = remainder