

initialize(MEM)

PC = 0

halted = False

while not halted:
    Instruction = MEM.getData(PC)
    halted, new_PC = EE.execute(Instruction)
    RF.dump()
    PC.update(new_PC)

MEM.dump()