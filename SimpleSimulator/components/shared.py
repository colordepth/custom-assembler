########################################

# AUTHORS (Group 20):

# Deep Sharma 2020370
# Dhruv Malik 2020373
# Karan Singh 2020383


# Shared variables and functions

# contains global variables and functions used by other files

# INPUT: --
# OUTPUT: -- 
########################################

from .extractors import *
from functions.arithmetic import *
from functions.bits import *
from functions.branch import *
from functions.hlt import *
from functions.move import *
from components.RF import *

functions=                                          \
{                                                   \
    "00000" : add,                                  \
    "00001" : sub,                                  \
    "00110" : mul,                                  \
    "01010" : xor,                                  \
    "01011" : UOr,                                  \
    "01100" : UAnd,                                 \
    "00010" : movi,                                 \
    "01000" : rs,                                   \
    "01001" : ls,                                   \
    "00111" : div,                                  \
    "00011" : movr,                                 \
    "01101" : invert,                               \
    "01110" : comp,                                 \
    "00100" : ld,                                   \
    "00101" : st,                                   \
    "01111" : jmp,                                  \
    "10000" : jlt,                                  \
    "10001" : jgt,                                  \
    "10010" : jeq,                                  \
    "10011" : hlt                                   \
    }

types=                                                      \
{                                                           \
    "00000" : typeAExtract,                                 \
    "00001" : typeAExtract,                                 \
    "00110" : typeAExtract,                                 \
    "01010" : typeAExtract,                                 \
    "01011" : typeAExtract,                                 \
    "01100" : typeAExtract,                                 \
    "00010" : typeBExtract,                                 \
    "01000" : typeBExtract,                                 \
    "01001" : typeBExtract,                                 \
    "00111" : typeCExtract,                                 \
    "00011" : typeCExtract,                                 \
    "01101" : typeCExtract,                                 \
    "01110" : typeCExtract,                                 \
    "00100" : typeDExtract,                                 \
    "00101" : typeDExtract,                                 \
    "01111" : typeEExtract,                                 \
    "10000" : typeEExtract,                                 \
    "10001" : typeEExtract,                                 \
    "10010" : typeEExtract,                                 \
    "10011" : typeFExtract                                  \
}

def initialiseHalted():
    global halted
    halted=False

def convertToBinary8(decimal):
    return format(decimal, '08b')

def convertToBinary16(decimal):
    return format(decimal, '016b')

def convertToDecimal(binary):
    return int(binary,2)