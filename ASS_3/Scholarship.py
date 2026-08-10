# Scholarship Distribution - Greedy Algorithm

# Read number of students and total budget
n, budget = map(int, input().split())

# Read scholarship requirements
scholarships = list(map(int, input().split()))

# Sort from smallest to largest
scholarships.sort()

# Number of students selected
count = 0

# Total amount spent
total = 0

# Select students with minimum scholarship requirements
for amount in scholarships:

    if total + amount <= budget:
        total += amount
        count += 1
    else:
        break

# Print maximum number of students
print(count)