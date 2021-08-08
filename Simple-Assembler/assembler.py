########################################

# AUTHORS (Group 20):

# Deep Sharma 2020370
# Dhruv Malik 2020373
# Karan Singh 2020383


# Main file

########################################

import sys

from components.instructions import *
from components.shared import *
from components.preprocess import *


def parseLine(asm_string):
	'''
	 SPECIAL NOTE:
	 if instruction == MOV
	 Use instruction_map["mov"][0] or instruction_map["mov"][1] as appropriate
	'''
	bytecode = ''
	# bytecode = generateCodeTypeA(asm_string)
	return bytecode

def parseCode(source_code):
	# Returns binary code space for input assembly code

	bytecode = ''

	for line_number,asm_string  in enumerate(source_code.split('\n')):
		if asm_string == '':
			continue
		instruction, *operands = asm_string.split()
		try:
			bytecode += parseLine(asm_string)
			bytecode += '\n'
		except CompileError as e:
			e.line_number = line_number+1
			e.code = asm_string
			raise
	
	return bytecode

def generateMemorySpace():
	# Memory is initialized to all 0s
	zero_string = '0'*16 + '\n'

	return zero_string * len(variables_map)

def main():
	source_code = sys.stdin.read()

	try:
		verifySourceCode(source_code)
		preprocess(source_code)
		bytecode = parseCode(source_code)
		memory_space = generateMemorySpace()
	except CompileError as e:
		print(intro_text)
		print(f'> Error found in input source code at line {e.line_number}\n> "{e.code}"')
		print(f'> {e.message}\n')
		print(f'Error caught in procedure "{e.origin}"\n')
	else:
		print(bytecode + memory_space)

	return

if __name__ == '__main__':
	main()