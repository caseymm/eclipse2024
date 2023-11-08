import numpy as np
from scipy.optimize import fsolve
import math
import json

def equation(d, overlap_percentage):
    return overlap_percentage - (2 * math.acos(d / 2) - d * math.sqrt(1 - d**2 / 4)) / math.pi

d_values = {}

for overlap_percentage in np.arange(0, 100, 0.1):
    initial_guess = 0.1  # Starting with an initial guess of 0.1
    result = fsolve(equation, initial_guess, args=(overlap_percentage / 100))
    d_values.setdefault(round(overlap_percentage, 2), result[0])

print(json.dumps(d_values))