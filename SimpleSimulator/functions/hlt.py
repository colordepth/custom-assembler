########################################

# AUTHORS (Group 20):

# Deep Sharma 2020370
# Dhruv Malik 2020373
# Karan Singh 2020383


# Halt unit

# Halts program execution

# INPUT: operands
# OUTPUT: tuple (True,1) 
########################################

from components.flagOperations import *
def hlt(garbage):
    resetFlag()
    return (True,1)   