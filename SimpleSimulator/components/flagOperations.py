########################################

# AUTHORS (Group 20):

# Deep Sharma 2020370
# Dhruv Malik 2020373
# Karan Singh 2020383


# Functions for flag operations

# Sets\resets flags as required

# FLAGS:
# 12 unused bits + VLGE
# Bit no.          3210
# 
# V = Overflow
# L = Less than
# G = Greater than
# E = Equal to

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
    register_value['111']|=1<<1

def setEq():
    pass

def getLt():
    pass

def getGt():
    # OUTPUT: Returns G bit (1 or 0)

    extract_G = register_value['111'] & (1<<1)
    G_bit = extract_G >> 1

    return G_bit

def getEq():
    pass