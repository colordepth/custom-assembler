########################################

# AUTHORS (Group 20):

# Deep Sharma 2020370
# Dhruv Malik 2020373
# Karan Singh 2020383


# Contains small tools or helper functions

########################################

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
	pass