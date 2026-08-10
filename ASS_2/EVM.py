from collections import deque

n, m, d = map(int, input().split())

graph = [[] for _ in range(n + 1)]

for _ in range(m):
    u, v = map(int, input().split())

    graph[u].append(v)
    graph[v].append(u)

# Distance from city 1
distance = [-1] * (n + 1)

queue = deque()

queue.append(1)
distance[1] = 0

count = 0

while queue:
    city = queue.popleft()

    # Count city if within D roads
    if distance[city] <= d:
        count += 1

    for neighbor in graph[city]:

        if distance[neighbor] == -1:
            distance[neighbor] = distance[city] + 1
            queue.append(neighbor)

print(count)