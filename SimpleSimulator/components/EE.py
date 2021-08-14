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
    opcode=opcodeExtract(instruction)
    operands=types[opcode](instruction)
    
    checkForReturn=functions[opcode](operands)

    if checkForReturn==None:
        return (components.PC.PC+1,False)
    elif checkForReturn[1]==1:
        return (components.PC.PC+1,True)
    elif checkForReturn[1]==0:
        return (checkForReturn[0],False)

