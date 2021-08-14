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

#arithmetic helper
def checkOverflow(num):
    return  num>(2**16)-1

#main
def add(operands):
    resetFlag()

    register2=register_value[operands[1]]
    register3=register_value[operands[2]]
    register1=register2+register3
    register_value[operands[0]]=register1

    if checkOverflow(register1):
        setOverflow()

def sub():
    pass

def mul():
    pass

def div():
    pass
