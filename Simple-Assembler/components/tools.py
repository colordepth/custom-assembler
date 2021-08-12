########################################

# AUTHORS (Group 20):

# Deep Sharma 2020370
# Dhruv Malik 2020373
# Karan Singh 2020383


# Contains small tools or helper functions

########################################
from .shared import *

def removeLabel(asm_string):
	# INPUT: 	"labelName: mov R1 R2 R3"
	# OUTPUT: 	"mov R1 R2 R3"
	if ':' not in asm_string:
		return asm_string
	
	asm_string = asm_string[asm_string.find(':')+1:]
	asm_string = asm_string.lstrip()

	return asm_string

def convertToBin(immediate):
	# Returns binary representation of immediate
	# Throw error if immediate is not 8 bit
	# INPUT: 	$5
	# OUTPUT: 	"00000101"
	pass

def validateRegisterName(register,type):
	if register not in register_map:
		if len(register)==2 and register[0] == 'R' and register[1].isdigit():
			raise CompileError("validateRegisterName", f"Syntax Error: Unknown register '{register.upper()}'")
		else:
			raise CompileError("validateRegisterName", f"Syntax Error: Unexpected operand '{register.upper()}' for type"+type+" instruction")
	if register == "FLAGS":
		raise CompileError("validateRegisterName", f"Semantic Error: Illegal operation on FLAGS.")
