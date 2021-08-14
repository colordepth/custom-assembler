########################################

# AUTHORS (Group 20):

# Deep Sharma 2020370
# Dhruv Malik 2020373
# Karan Singh 2020383


# Branch unit

# contains functions for instructions that
# deal with branching

# INPUT: operands
# OUTPUT: tuple (mem_addr_to_branch_to,0) 
########################################

from components.PC import *
from components.RF import *
from components.flagOperations import *

def jmp(operands):
    memory = operands[0]

    result = convertToDecimal(memory)

    return (result, 0)

def jlt(operands):
    pass

def jgt(operands):
    memory = operands[0]

    if getGt() == 1:
        result = (convertToDecimal(memory), 1)
    else:
        result = None

    return result

def jeq(operands):
    pass
