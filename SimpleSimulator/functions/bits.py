########################################

# AUTHORS (Group 20):

# Deep Sharma 2020370
# Dhruv Malik 2020373
# Karan Singh 2020383


# Bitwise and logical unit

# contains functions for instructions that
# carry out bit related and logical operations
# may set flags

# INPUT: operands
# OUTPUT: NONE 
########################################

from components.RF import *
from components.flagOperations import *

def rs(operands):
    resetFlag()

    destination = operands[0]
    immediate = operands[1]

    result = register_value[destination] >> convertToDecimal(immediate)

    register_value[destination] = result

def ls(operands):
    resetFlag()

    destination = operands[0]
    immediate = operands[1]

    result = register_value[destination] << convertToDecimal(immediate)

    register_value[destination] = result

def xor(operands):
    resetFlag()

    destination = operands[0]
    source_1 = operands[1]
    source_2 = operands[2]

    result = register_value[source_1] ^ register_value[source_2]

    register_value[destination] = result

def bitwiseOr(operands):
    resetFlag()

    destination = operands[0]
    source_1 = operands[1]
    source_2 = operands[2]

    result = register_value[source_1] | register_value[source_2]

    register_value[destination] = result

def bitwiseAnd(operands):
    resetFlag()

    destination = operands[0]
    source_1 = operands[1]
    source_2 = operands[2]

    result = register_value[source_1] & register_value[source_2]

    register_value[destination] = result

def invert(operands):
    pass

def comp(operands):
    pass
