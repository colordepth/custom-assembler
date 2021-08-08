########################################

# AUTHORS (Group 20):

# Deep Sharma 2020370
# Dhruv Malik 2020373
# Karan Singh 2020383


# Contains small tools or helper functions

########################################

def removeLabel(asm_string):
	if ':' not in asm_string:
		return
	
	asm_string = asm_string[asm_string.find(':')+1:]
	asm_string = asm_string.lstrip()

	return asm_string

def convertToBin(immediate):
	# Returns binary representation of immediate
	# Throw error if immediate is not 8 bit
	pass