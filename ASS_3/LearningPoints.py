# Maximum Learning Points
# Dynamic Programming

# Read number of topics
n = int(input())

# Read learning points
points = list(map(int, input().split()))

# Handle small cases
if n == 1:
    print(points[0])
else:
    # dp[i] = maximum points possible
    # from topics 0 to i

    dp = [0] * n

    # First topic
    dp[0] = points[0]

    # Between first and second topic,
    # choose the one with greater points
    dp[1] = max(points[0], points[1])

    # Fill DP table
    for i in range(2, n):

        # Option 1: Skip current topic
        skip = dp[i - 1]

        # Option 2: Take current topic
        take = dp[i - 2] + points[i]

        dp[i] = max(skip, take)

    # Final answer
    print(dp[n - 1])