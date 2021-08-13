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
    register_value["111"]="0"*16

def setOverflow():
    register_value["111"]=register_value["111"][:12]+"1"+register_value["111"][13:]

def setLt():
    pass

def setGt():
    pass

def setEq():
    pass
