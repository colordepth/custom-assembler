########################################

# AUTHORS (Group 20):

# Deep Sharma 2020370
# Dhruv Malik 2020373
# Karan Singh 2020383


# Main file

########################################

import components.MEM
import components.EE
import components.RF
import components.PC

components.MEM.initialize()

components.PC.PC = 0

halted=False

while not halted:

    instruction = components.MEM.getData(components.PC.PC)

    new_PC,halted=components.EE.execute(instruction)

    components.PC.dump()
    components.RF.dump()

    components.PC.update(new_PC)

components.MEM.dump()