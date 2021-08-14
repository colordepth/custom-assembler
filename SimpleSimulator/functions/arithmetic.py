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
    pass

def mul(operands):
    pass

def div(operands):
    pass
