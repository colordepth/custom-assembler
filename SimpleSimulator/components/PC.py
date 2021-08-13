from .shared import *
PC=0

def update(new_PC):
    global PC
    PC=new_PC

def dump():
    print(convertToBinary8(PC),end=" ")