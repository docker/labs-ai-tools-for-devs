- ![graph.png](../assets/graph_1729537135592_0.png)
- ```
  nix-store --query --graph ./result > graph.dot
  dot -Tpng graph.dot -o graph.png
  ```
-