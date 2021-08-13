import components.shared

register_value={     \
    "000" : 0,       \
    "001" : 0,       \
    "010" : 0,       \
    "011" : 0,       \
    "100" : 0,       \
    "101" : 0,       \
    "110" : 0,       \
    "111" : 0        \
}

##possible issue unordered output
def dump():
    for value in sorted(register_value.keys()):
        print(components.shared.convertToBinary16(register_value[value]),end=" ")
    print("")