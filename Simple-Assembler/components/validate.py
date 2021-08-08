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
	predicted_memory=0
	variable_block_flag=0

	for line_number,asm_string  in enumerate(source_code.split('\n')):

		if len(asm_string.split())==0:
			continue

		instruction, *operands = asm_string.split()

		if instruction=="hlt" and line_number!=len(source_code.split('\n')-1):
			raise CompileError("verifySourceCode","Syntax Error: Illegal use of hlt",line_number+1,asm_string)

		if instruction == 'var':
			if variable_block_flag==1:
				raise CompileError("verifySourceCode","Syntax error: Variable declared after an instruction",line_number+1,asm_string)
			predicted_memory+=2
		else:
			variable_block_flag=1
			predicted_memory+=2
		
	if instruction!="hlt":
		raise CompileError("verifySourceCode","Syntax error: Hlt is not the last instruction",line_number+1,asm_string)
	
	if predicted_memory>512:
		raise CompileError("verifySourceCode","Compile Error: Memory exceeded available space",line_number+1,asm_string)