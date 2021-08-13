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

	for line_number,asm_string  in enumerate(source_code.split('\n')):
		label=""
		if ':' not in asm_string:
			continue
		else:
			label = asm_string[:asm_string.find(':')]
			label = label.lstrip().rstrip()                  
													
		if label!="":
			labels_map[label]=convertToBin(line_number)


def processVariables(source_code):
	# Generates variable -> memory_address mapping such that
	# variable_map["label name"] = memory_address
	
	spaceless_source_code = []
	for asm_line in source_code.split("\n"):
		if asm_line.strip() != '' and asm_line.split()[0] != 'var':
			spaceless_source_code.append(asm_line)
	
	for line_number,asm_string  in enumerate(source_code.split('\n')):
		if asm_string == '':
			continue
		instruction, *operands = asm_string.split()
		if instruction != "var":
			return
		if len(operands) != 1:
			raise CompileError("processVariables", "Syntax Error = Too many arguements", line_number+1)
		if operands[0] in variables_map:
			raise CompileError("processVariables", f'Error = Multiple declarations of variable "{operands[0]}"', line_number+1)
		
		variables_map[operands[0]] = len(spaceless_source_code) + len(variables_map)
		variables_map[operands[0]] = convertToBin(variables_map[operands[0]])