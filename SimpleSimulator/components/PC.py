########################################

# AUTHORS (Group 20):

# Deep Sharma 2020370
# Dhruv Malik 2020373
# Karan Singh 2020383


# Program Counter

# Progra counter and related functions

# INPUT: NONE/(New program counter)
# OUTPUT:  NONE/(value of program counter)
########################################

import components.shared

PC=0

def update(new_PC):
    global PC
    PC=new_PC

def dump():
    print(components.shared.convertToBinary8(PC),end=" ")