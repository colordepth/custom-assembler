########################################

# AUTHORS (Group 20):
#
# Deep Sharma 2020370
# Dhruv Malik 2020373
# Karan Singh 2020383
#
# *
# *** Generates Variables and Labels map ***
# *
# 
# 2-pass preprocess. One for variables and one for labels
# No verification is done here. Just create mappings for labels and variables to memory address
#
# INPUT: 	STRING to valiate
# OUTPUT: 	Raise Exception if invalid

########################################

from .shared import *
from .tools import *

def preprocess(source_code):

	processLabels(source_code)
	processVariables(source_code)
	return

def processLabels(source_code):
	# Generates labels -> memory_address mapping such that
	# labels_map["label name"] = line_number
	true_ln=-1
	for line_number,asm_string  in enumerate(source_code.split('\n')):
		label=""
		if asm_string.strip()=="" or asm_string.split()[0]=="var":
			continue
		true_ln+=1
		if ':' not in asm_string:
			continue
		else:
			label = asm_string[:asm_string.find(':')]
			label = label.strip()
													
		if label=="":
			raise CompileError("processLabels","Syntax Error: Empty label name",line_number+1,asm_string)
		elif label in labels_map.keys():
			raise CompileError("processLabels","Syntax Error: Label already exists",line_number+1,asm_string)
		elif label in variables_map:
			raise CompileError("processLabels","Syntax Error: Label cannot share name with a variable.",line_number+1,asm_string)
		elif label in keywords:
			raise CompileError("processLabels",f"Syntax Error: Reserved keyword '{label}' used as label name",line_number+1,asm_string)
		elif label.isnumeric():
			raise CompileError("processLabels","Syntax Error: Label name cannot be purely numeric",line_number+1,asm_string)
		elif label[0] == '$' and label[1:].isnumeric():
			raise CompileError("processLabels","Syntax Error: Label name cannot be an immediate",line_number+1,asm_string)
		elif asm_string[asm_string.find(':')+1:].strip() == "":
			raise CompileError("processLabels","Syntax Error: Label must be followed by an instruction on the same line",line_number+1,asm_string)
		else:
			labels_map[label]=convertToBin(true_ln)


def processVariables(source_code):
	# Generates variable -> memory_address mapping such that
	# variable_map["label name"] = memory_address
	
	spaceless_source_code = []
	for asm_line in source_code.split("\n"):
		if asm_line.strip() != '' and asm_line.split()[0] != 'var':
			spaceless_source_code.append(asm_line)
	
	for line_number,asm_string  in enumerate(source_code.split('\n')):
		if removeLabel(asm_string).strip() != asm_string.strip() and removeLabel(asm_string).split()[0] == 'var':
			raise CompileError("processVariables", f"Syntax Error: Invalid use of labels during variable declaration", line_number+1, asm_string)

		if asm_string.strip() == '':
			continue

		instruction, *operands = asm_string.split()

		if instruction != "var":
			return
		
		if len(operands) == 0:
			raise CompileError("processVariables", "Syntax Error: blank name for variable", line_number+1, asm_string)

		if len(operands) > 1:
			raise CompileError("processVariables", "Syntax Error: Cannot declare multiple variables in one line", line_number+1, asm_string)
		
		if operands[0] in variables_map:
			raise CompileError("processVariables", f'Compile Error: Variable "{operands[0]}" has already been declared before.', line_number+1, asm_string)
		if operands[0] in labels_map:
			raise CompileError("processVariables",f"Syntax Error: Variable cannot share name with a Label.",line_number+1,asm_string)
		if operands[0] in keywords:
			raise CompileError("processVariables",f"Syntax Error: Reserved keyword '{operands[0]}' used as variable name",line_number+1,asm_string)
		if operands[0].isnumeric():
			raise CompileError("processVariables",f"Syntax Error: Variable name cannot be purely numeric",line_number+1,asm_string)
		if operands[0][0] == '$' and operands[0][1:].isnumeric():
			raise CompileError("processVariables",f"Syntax Error: Variable name cannot be an immediate",line_number+1,asm_string)
		
		variables_map[operands[0]] = len(spaceless_source_code) + len(variables_map)
		variables_map[operands[0]] = convertToBin(variables_map[operands[0]])