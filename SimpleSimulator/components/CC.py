########################################

# AUTHORS (Group 20):

# Deep Sharma 2020370
# Dhruv Malik 2020373
# Karan Singh 2020383

# Cycle Counter

# Bonus Part

# Generates png of scatter plot with the cycle number on the 
# x-axis and the memory address on the y-axis

# INPUT: NONE
# OUTPUT: BONUS GRAPH
########################################

import matplotlib.pyplot as plt
from datetime import datetime

cyclecounter = 0
cycle_number = []
memory_tracker = []

def trackMemory(mem_address):
    cycle_number.append(cyclecounter)
    memory_tracker.append(mem_address)

def trackerGraph():

    fig = plt.figure()
    plt.scatter(cycle_number, memory_tracker)

    plt.xlabel("Cycle")
    plt.ylabel("Memory Address")
    plt.title("Memory Trace")

    png_name = datetime.now().strftime("%Y-%m-%d_%H-%M-%S.%f.png")
    fig.savefig(png_name)
