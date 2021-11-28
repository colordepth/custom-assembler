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
from components import tools


def parseLine(asm_string):
	# INPUT Example:	"add R1 R2 R3"
	# OUTPUT Example:	"0000000001010011"

	instruction, *operands = asm_string.split()
	bytecode = None

	if instruction == "mov":
		if '$' in asm_string:
			movImmediate = code_gen_map['typeB']
			bytecode = movImmediate(asm_string)
		else:
			movRegister = code_gen_map['typeC']
			bytecode = movRegister(asm_string)
		return bytecode

	for instruction_type in types.keys():
		if instruction in types[instruction_type]:
			codeGenerator = code_gen_map[instruction_type]
			bytecode = codeGenerator(asm_string)

	if bytecode == None:
		raise CompileError("parseLine", f'Syntax error: Invalid instruction "{instruction}"')

	return bytecode

def parseCode(source_code):
	# Returns binary code space for input assembly code

	initializeInstructionCompiler()

	bytecode = ''

	for line_number, asm_string in enumerate(source_code.split('\n')):

		clean_asm_string = tools.removeLabel(asm_string).strip()

		if clean_asm_string == '':
			continue

		instruction, *operands = clean_asm_string.split()

		if instruction == 'var':
			continue

		try:
			bytecode += parseLine(clean_asm_string)
			bytecode += '\n'
		except CompileError as e:
			e.line_number = line_number+1
			e.code = asm_string
			raise

	return bytecode

def main():
	source_code = sys.stdin.read()

	try:
		verifySourceCode(source_code)
		preprocess(source_code)
		bytecode = parseCode(source_code)
	except Exception as e:
		print("\n~~~~~~~~~~~~~~~~~~~~ ASSEMBLER REPORT ~~~~~~~~~~~~~~~~~~~~\n", file=sys.stderr)
		#print(intro_text)
		if type(e) == CompileError:
			print(f'> {e.message}', file=sys.stderr)
			print(f'> "{e.code}", Line {e.line_number}', file=sys.stderr)
		else:
			print("> Compilation Error: Please check source code.", file=sys.stderr)
		# print(f'Error caught in procedure "{e.origin}"')
		print("\n~~~~~~~~~~~~~~~~~~ END ASSEMBLER REPORT ~~~~~~~~~~~~~~~~~~\n", file=sys.stderr)
		exit(1)
	else:
		print(bytecode.strip('\n'), end='')

	return

if __name__ == '__main__':
	main()