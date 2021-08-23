########################################

# AUTHORS (Group 20):

# Deep Sharma 2020370
# Dhruv Malik 2020373
# Karan Singh 2020383


# Memory Unit

# initialises memory 
# fetches instructions 
# prints memory()

# INPUT: instruction
# OUTPUT: <function dependent> 
########################################

import sys

from .shared import *

memory=[]
instruction_length=0

def initialize():
    global memory
    memory=[0]*256
    source_code = sys.stdin.read().strip()
    source_code=source_code.split("\n")
    global instruction_length
    instruction_length=len(source_code)
    for index,instruction in enumerate(source_code):
        memory[index]=instruction

def getData(PC):
    return memory[PC]

def dump():
    for element in range(0,256):
        if instruction_length-1<element:
            print(components.shared.convertToBinary16(memory[element]))
        else:
            print(memory[element])

def store(memory_address,value):
    index=components.shared.convertToDecimal(memory_address)
    memory[index]=value

def load(memory_address):
    index=components.shared.convertToDecimal(memory_address)
    return memory[index]
