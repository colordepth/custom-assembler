########################################

# AUTHORS (Group 20):

# Deep Sharma 2020370
# Dhruv Malik 2020373
# Karan Singh 2020383


# operand extraction unit

# extracts operands from instructions

# INPUT: instruction
# OUTPUT: tuple of operands
########################################
 
from .RF import *

def typeAExtract(instruction):
	register1=instruction[7:10]
	register2=instruction[10:13]
	register3=instruction[13:16]

	return (register1,register2,register3)

def typeBExtract(instruction):
	register=instruction[5:8]
	immediate=instruction[8:16]

	return (register,immediate)

def typeCExtract(instruction):
	register1=instruction[10:13]
	register2=instruction[13:16]

	return (register1,register2)

def typeDExtract(instruction):
	register=instruction[5:8]
	memory=instruction[8:16]

	return (register,memory)

def typeEExtract(instruction):
	pass

def typeFExtract(instruction):
	return "placeholder to maintain same syntax"