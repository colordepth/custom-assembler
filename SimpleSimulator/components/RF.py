########################################

# AUTHORS (Group 20):

# Deep Sharma 2020370
# Dhruv Malik 2020373
# Karan Singh 2020383


# Register FIle

# contains registers and realted function

# INPUT: NONE
# OUTPUT: register values
########################################
 
import components.shared

register_value={         \
    "000" : 0,           \
    "001" : 0,           \
    "010" : 0,           \
    "011" : 0,           \
    "100" : 0,           \
    "101" : 0,           \
    "110" : 0,           \
    "111" : "0"*16       \
}

def dump():
    for value in sorted(register_value.keys()):
        if value!="111":
            print(components.shared.convertToBinary16(register_value[value]),end=" ")
    print(register_value[value])