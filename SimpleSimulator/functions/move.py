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
    resetFlag()

    destination = operands[0]
    immediate = operands[1]

    result = components.shared.convertToDecimal(immediate)

    register_value[destination] = result

def movr(operands):
    source = operands[1]
    destination = operands[0]

    register_value[destination] = register_value[source]

    resetFlag()

def ld(operands):
    resetFlag()

    destination = operands[0]
    memory = operands[1]

    result = load(memory)

    register_value[destination] = result

def st(operands):
    resetFlag()

    source = operands[0]
    destination = operands[1]
    
    store(destination, register_value[source])