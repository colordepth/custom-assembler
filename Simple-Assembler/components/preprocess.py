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
	true_ln=0
	for asm_string  in source_code.split('\n'):
		label=""
		if asm_string.split()[0]=="" or asm_string.split()[0]=="var":
			continue
		true_ln+=1
		if ':' not in asm_string:
			continue
		else:
			label = asm_string[:asm_string.find(':')]
			label = label.lstrip().rstrip()                  
													
		if label!="":
			labels_map[label]=convertToBin(true_ln)


def processVariables(source_code):
	# Generates variable -> memory_address mapping such that
	# variable_map["label name"] = line_number
	pass