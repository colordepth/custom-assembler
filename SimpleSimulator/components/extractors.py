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
	pass

def typeCExtract(instruction):
	pass

def typeDExtract(instruction):
	pass

def typeEExtract(instruction):
	pass

def typeFExtract(instruction):
	return "placeholder to maintain same syntax"