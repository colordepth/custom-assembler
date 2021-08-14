########################################

# AUTHORS (Group 20):

# Deep Sharma 2020370
# Dhruv Malik 2020373
# Karan Singh 2020383


# Functions for flag operations

# Sets\resets flags as required

# INPUT: NONE
# OUTPUT: NONE
########################################

from components.RF import *

def resetFlag():
    register_value['111']^=register_value['111']

def setOverflow():
    pass

def setLt():
    register_value['111']|=1<<2

def setGt():
    pass

def setEq():
    pass

def getLt():
    pass

def getGt():
    # OUTPUT: Returns G (Greater than) bit (1 or 0)

    extract_overflow = register_value['111'] & (1<<1)
    overflow_bit = extract_overflow >> 1

    return overflow_bit

def getEq():
    pass