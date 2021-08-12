########################################

# AUTHORS (Group 20):
#
# Deep Sharma 2020370
# Dhruv Malik 2020373
# Karan Singh 2020383
#
#
# Most code to validate inputs will be here
#
# INPUT: 	STRING to valiate
# OUTPUT: 	Raise Exception if invalid

########################################

'''
Temporary Notes:

Take care of following errors in their respective functions

* SyntaxError:		Misuse of LABELS as VARIABLES
* SyntaxError:		Misuse of VARIABLES as LABELS
* ValueError:		Immediate is not an 8-bit integer.
* Access Violation:	Illegal operation on FLAGS


'''

from .shared import *


def validateTypeA(asm_string):

	_, *operands = asm_string.split()

	if len(operands) != 3:
		raise CompileError("validateTypeA", f"Syntax Error: Expected 3 operands, received {len(operands)}")

	for register in operands:
		if register not in register_map:
			if len(register)==2 and register[0] == 'R' and register[1].isdigit():
				raise CompileError("validateTypeA", f"Syntax Error: Unknown register '{register.upper()}'")
			else:
				raise CompileError("validateTypeA", f"Syntax Error: Unexpected operand '{register.upper()}' for typeA instruction")

	return


def validateTypeB(asm_string):
	pass

def validateTypeC(asm_string):
	instruction, *operands = asm_string.split()

	if len(operands) != 2:
		raise CompileError("validateTypeC", f"Syntax Error: Expected 2 operands, received {len(operands)}")

	if "FLAGS" in asm_string:
		if instruction != "mov":
			raise CompileError("validateTypeC", f"Syntax Error: Illegal operation on Flags register ")
		else:
			register=operands[0]
			if len(register)==2 and register[0] == 'R' and register[1].isdigit():
				raise CompileError("validateTypeC", f"Syntax Error: Unknown register '{register.upper()}'")
			else:
				raise CompileError("validateTypeC", f"Syntax Error: Unexpected operand '{register.upper()}' for typeC instruction")

	for register in operands:
		if register not in register_map:
			if len(register)==2 and register[0] == 'R' and register[1].isdigit():
				raise CompileError("validateTypeC", f"Syntax Error: Unknown register '{register.upper()}'")
			else:
				raise CompileError("validateTypeC", f"Syntax Error: Unexpected operand '{register.upper()}' for typeC instruction")

	return

def validateTypeD(asm_string):
	pass

def validateTypeE(asm_string):
	pass

def validateTypeF(asm_string):
	pass

def verifySourceCode(source_code):
	# Applies following GLOBAL checks:
	#
	# * no missing HLT instruction
	# * HLT is the last instruction
	# * Variables are only defined in the beginning of file
	# * Predicted Memory space (variables + compiled code) should not exceed 512 bytes
	#
	pass