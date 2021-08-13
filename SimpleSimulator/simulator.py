import components.MEM
import components.EE
import components.RF
import components.PC
import components.shared

components.MEM.initialize()

components.PC.PC = 0

components.shared.initialiseHalted()

while not components.shared.halted:
    instruction = components.MEM.getData(components.PC.PC)
    components.EE.execute(instruction)
    components.PC.dump()
    components.RF.dump()

components.MEM.dump()