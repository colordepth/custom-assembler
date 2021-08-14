########################################

# AUTHORS (Group 20):

# Deep Sharma 2020370
# Dhruv Malik 2020373
# Karan Singh 2020383


# Move unit

# contains functions for instructions that
# carry out memory related operations

# INPUT: operands
# OUTPUT: NONE 
########################################

from components.MEM import *
from components.RF import *
from components.flagOperations import *

def movi(operands):
    destination = operands[0]
    immediate = operands[1]

    result = components.shared.convertToDecimal(immediate)

    register_value[destination] = result

def movr(operands):
    pass

def ld(operands):
    destination = operands[0]
    memory = operands[1]

    result = getData(memory)

    register_value[destination] = result

def st(operands):
    pass
