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
	return (instruction[7:10],instruction[10:13],instruction[13:16])

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