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
	_, *operands = asm_string.split()

	if len(operands) != 2:
		raise CompileError("validateTypeB", f"Syntax Error: Expected 2 operands, received {len(operands)}")

	register=operands[0]
	immediate=operands[1]

	if register=="FLAG":
		raise CompileError("validateTypeB","Syntax Error: Illegal operation on Flag")
	if register not in register_map:
		if len(register)==2 and register[0] == 'R' and register[1].isdigit():
			raise CompileError("validateTypeB", f"Syntax Error: Unknown register '{register.upper()}'")
		else:
			raise CompileError("validateTypeB", f"Syntax Error: Unexpected operand '{register.upper()}' for typeB instruction")
			
	if not(immediate.isnumeric()):
		raise CompileError("validateTypeB", f"Syntax Error: Illegal immediate value'{immediate}'")
	if immediate>2**8-1:
		raise CompileError("validateTypeB", f"Syntax Error: Immediate value greater than allowed value")
	return

def validateTypeC(asm_string):
	pass

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