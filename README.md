# Preview [https://pathfinding-visualizer-five.vercel.app/](https://pathfinding-visualizer-five.vercel.app/)

*How to use* :

`Click on the grid to add a wall. Click while pressing W to add a weight, S to the change start node and F to the change finish node.`

___

# Algorithms

* UnWeighted:
  * Depth-first Search (DFS): it's the worst for pathfinding and doesn't guarantee the shortest path.
  * Breath-first Search (BFS): easy to implement and guarantees the shortest path.
* Weighted:
  * Dijkstra's Algorithm: **THE GOD OF PATHFINDING**, it uses a minimum priority queue and guarantees the shortest path.
* Maze:
  * Recursive Division: It generates beautiful mazes

## All implementations are in [HERE](./src/algorithms)

___

# Tasks

* [x] Depth-first Search
* [x] Breath-first Search
* [x] Dijkstra's Algorithm
* [ ] A*
* [x] Recursive Division
