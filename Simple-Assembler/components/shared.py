########################################

# AUTHORS (Group 20):
#
# Deep Sharma 2020370
# Dhruv Malik 2020373
# Karan Singh 2020383


# Immutable Variables that all modules need to reference frequently
# For example, variables_map is needed by instructions.py, validate.py and preprocess.py

########################################

# Exception classes shared across all files

from .exception import *


# Variables Generated during runtime

variables_map = {}
labels_map = {}


# Constants

intro_text = '''
\t\t ~~~~~~~~~~~~~~~~~~~~~~~
\t\t|\t\t\t|
\t\t|\t\t\t|
\t\t| ASSEMBLER CO Group 20 |
\t\t|\t\t\t|
\t\t|\t\t\t|
\t\t ~~~~~~~~~~~~~~~~~~~~~~~

'''

register_map =						\
{									\
	"R0"	:	"000",				\
	"R1"	:	"001",				\
	"R2"	:	"010",				\
	"R3"	:	"011",				\
	"R4"	:	"100",				\
	"R5"	:	"101",				\
	"R6"	:	"110",				\
 	"FLAGS"	:	"111",				\
}

types =														\
{															\
	"typeA" :	("add", "sub", "mul", "xor", "or", "and",),	\
	"typeB" :	("mov", "rs", "ls",),						\
	"typeC" :	("mov", "div", "not", "cmp",),				\
	"typeD" :	("ld", "st",),								\
	"typeE" :	("jmp", "jlt", "je", "jgt",),				\
	"typeF" :	("hlt",),									\
}

instruction_map =					\
{									\
	"add"	:	"00000",			\
	"sub"	:	"00001",			\
	"mov"	:	("00010","00011"),	\
	"ld"	:	"00100",			\
	"st"	:	"00101",			\
	"mul"	:	"00110",			\
	"div"	:	"00111",			\
	"rs"	:	"01000",			\
	"ls"	:	"01001",			\
	"xor"	:	"01010",			\
	"or"	:	"01011",			\
	"and"	:	"01100",			\
	"not"	:	"01101",			\
	"cmp"	:	"01110",			\
	"jmp"	:	"01111",			\
	"jlt"	:	"10000",			\
	"jgt"	:	"10001",			\
	"je"	:	"10010",			\
	"hlt"	:	"10011",			\
}