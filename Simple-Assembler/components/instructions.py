########################################

# AUTHORS (Group 20):
#
# Deep Sharma 2020370
# Dhruv Malik 2020373
# Karan Singh 2020383
#
#
# All instructions in the instruction set are converted to bytecode here.
#
# INPUT: 	Tuple of arguments
# OUTPUT: 	Resulting bytecode of code of line

########################################

'''
Temporary Notes:

Take care of following errors in their respective functions

* Misuse of VARIABLES as LABELS


*** Also keep in mind MOV can be EITHER Type B OR Type C ***
Make a special check for it where apt.

'''

from .shared import *
from .validate import *


def generateCodeTypeA(asm_string):
	# INPUT: single line of Type A assembly code
	# OUTPUT: respective bytecode

	validateTypeA(asm_string)
	
	instruction, *operands = asm_string.split()
	instruction_binary = instruction_map[instruction]
	unused_bits = "00"
	register_binary = ''
	

	for register in operands:
		register_binary += register_map[register]

	bytecode = instruction_binary + unused_bits + register_binary
	return bytecode

def generateCodeTypeB(asm_string):
	pass

def generateCodeTypeC(asm_string):
	pass

def generateCodeTypeD(asm_string):
	pass

def generateCodeTypeE(asm_string):
	pass