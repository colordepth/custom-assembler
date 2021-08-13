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
from .tools import *

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
		if register == "FLAGS":
			raise CompileError("validateTypeA", f"Semantic Error: Illegal operation on FLAGS.")

	return


def validateTypeB(asm_string):
	_, *operands = asm_string.split()

	if len(operands) != 2:
		raise CompileError("validateTypeB", f"Syntax Error: Expected 2 operands, received {len(operands)}")

	register=operands[0]
	immediate=operands[1]

	if register=="FLAGS":
		raise CompileError("validateTypeB","Syntax Error: Illegal operation on Flag")
	if register not in register_map:
		if len(register)==2 and register[0] == 'R' and register[1].isdigit():
			raise CompileError("validateTypeB", f"Syntax Error: Unknown register '{register.upper()}'")
		else:
			raise CompileError("validateTypeB", f"Syntax Error: Unexpected operand '{register.upper()}' for typeB instruction")
			
	if not(immediate[1:].isnumeric()):
		raise CompileError("validateTypeB", f"Syntax Error: Invalid immediate value '{immediate}'")
	if int(immediate[1:])>2**8-1:
		raise CompileError("validateTypeB", f"Syntax Error: Immediate value greater than allowed value")
	return

def validateTypeC(asm_string):
	instruction, *operands = asm_string.split()

	if len(operands) != 2:
		raise CompileError("validateTypeC", f"Syntax Error: Expected 2 operands, received {len(operands)}")

	if "FLAGS" in asm_string:
		if instruction != "mov" or operands[0]=="FLAGS":
			raise CompileError("validateTypeC", f"Syntax Error: Illegal operation on Flags register ")

	for register in operands:
		if register not in register_map:
			if len(register)==2 and register[0] == 'R' and register[1].isdigit():
				raise CompileError("validateTypeC", f"Syntax Error: Unknown register '{register.upper()}'")
			else:
				raise CompileError("validateTypeC", f"Syntax Error: Unexpected operand '{register.upper()}' for typeC instruction")

	return

def validateTypeD(asm_string):
	if len(asm_string.split()) != 3:
		raise CompileError("validateTypeD", f"Syntax Error: Expected 2 operands, received {len(asm_string.split()) - 1}")

	_, *operands = asm_string.split()
	register = operands[0]
	memory_address = operands[1]

	if register=="FLAGS":
		raise CompileError("validateTypeD","Syntax Error: Illegal operation on Flag")
	if register not in register_map:
		if len(register)==2 and register[0] == 'R' and register[1].isdigit():
			raise CompileError("validateTypeD", f"Syntax Error: Unknown register '{register.upper()}'")
		else:
			raise CompileError("validateTypeD", f"Syntax Error: Unexpected operand '{register.upper()}' for typeD instruction")

	if memory_address not in variables_map:
		raise CompileError("validateTypeD", f"Syntax Error: Undefined variable reference '{memory_address}'")
	
	return

def validateTypeE(asm_string):
	_, *operands = asm_string.split()
	if len(operands) != 1:
		raise CompileError("validateTypeE", f"Syntax Error: Expected 1 operand, received {len(operands)}")

	memory_address = operands[0]

	if memory_address not in labels_map:
		raise CompileError("validateTypeE", f"Syntax Error: Undefined label reference '{memory_address}'")

	return

def validateTypeF(asm_string):
	if len(asm_string.split()) > 1:
				raise CompileError("validateTypeF", f"Syntax Error: Unexpected input recieved, {asm_string.split()[1:]}")

	pass

def verifySourceCode(source_code):
	# Applies following GLOBAL checks:
	#
	# * no missing HLT instruction
	# * HLT is the last instruction
	# * Variables are only defined in the beginning of file
	#

	variable_block_flag=0
	source_code=source_code.rstrip()

	for line_number,asm_string  in enumerate(source_code.split('\n')):

		if len(asm_string.split())==0:
			continue

		asm_string=removeLabel(asm_string)

		instruction,*_= asm_string.split()

		if instruction=="hlt" and line_number!=len(source_code.split('\n'))-1:
			raise CompileError("verifySourceCode","Syntax Error: Illegal use of hlt",line_number+1,asm_string)

		if instruction == 'var':
			if variable_block_flag==1:
				raise CompileError("verifySourceCode","Syntax error: Variable declared after an instruction",line_number+1,asm_string)
		else:
			variable_block_flag=1
		
	if instruction!="hlt":
		raise CompileError("verifySourceCode","Syntax error: hlt is not the last instruction",line_number+1,asm_string)
	