########################################

# AUTHORS (Group 20):

# Deep Sharma 2020370
# Dhruv Malik 2020373
# Karan Singh 2020383


# Execution unit

# calls required functions for execution

# INPUT: instruction
# OUTPUT: NONE 
########################################

from .shared import *
import components.PC
def opcodeExtract(instruction):
    return instruction[0:5]

def execute(instruction):
    update(components.PC.PC+1)

    opcode=opcodeExtract(instruction)
    operands=types[opcode](instruction)
    
    functions[opcode](operands)

