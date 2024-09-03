import { Edge, getOutgoers, Node } from "@xyflow/react";

export const hasCycle = (
  nodes: Node[],
  edges: Edge[],
  visited = new Set<string>(),
  inode?: Node
) => {
  const node = inode || nodes[0];
  if (visited.has(node.id) && inode) return true;

  visited.add(node.id);

  const outgoers = getOutgoers(node, nodes, edges);

  for (const outgoer of outgoers) {
    if (hasCycle(nodes, edges, visited, outgoer)) {
      return true;
    }
  }

  return false;
};
