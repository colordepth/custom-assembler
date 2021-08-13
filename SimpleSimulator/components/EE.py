from .shared import *
from .PC import *
def opcodeExtract(instruction):
    return instruction[0:5]

def execute(instruction):
    opcode=opcodeExtract(instruction)
    functions[opcode](types[opcode](instruction))
    update(PC+1)
#branchstatement

