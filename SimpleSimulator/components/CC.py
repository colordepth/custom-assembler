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
import numpy as np
from datetime import datetime

memory_access_tracker = []

def trackMemory(mem_address):
    memory_access_tracker.append(mem_address)

def trackerGraph():
    x = np.array(range(len(memory_access_tracker)))
    y = np.array(memory_access_tracker)

    plt.yticks(range(len(y)))
    plt.xticks(range(len(x)))

    fig = plt.figure()
    plt.scatter(x, y)

    png_name = datetime.now().strftime("%Y-%m-%d_%H-%M-%S.%f.png")
    fig.savefig(png_name)
