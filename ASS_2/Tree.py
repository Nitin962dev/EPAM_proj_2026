from collections import deque

n, k = map(int, input().split())

keys = [0] + list(map(int, input().split()))

graph = [[] for _ in range(n + 1)]

for _ in range(n - 1):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)

queue = deque([1])
visited = [False] * (n + 1)

path_xor = [0] * (n + 1)

visited[1] = True
path_xor[1] = keys[1]

count = 0

while queue:
    node = queue.popleft()

    if path_xor[node] >= k - 1:
        count += 1

    for neighbour in graph[node]:

        if not visited[neighbour]:
            visited[neighbour] = True

            path_xor[neighbour] = (
                path_xor[node] ^ keys[neighbour]
            )

            queue.append(neighbour)

print(count)