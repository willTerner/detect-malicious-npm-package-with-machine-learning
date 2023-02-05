import random
import numpy as np

interval = [0.5, 2.0]
n = 5
samples_1 = [random.uniform(0.5, 2.0) for i in range(5)]



mean = 0.2
std = 0.075

# Generate 3 random values from the normal distribution
samples_2 = np.random.normal(mean, std, 3)

print(samples_2)

