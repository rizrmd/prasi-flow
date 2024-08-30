import { Edge } from "@xyflow/react";

export const isMainPFNode = ({ id, edges }: { id: string; edges: Edge[] }) => {
  const visited = new Set<string>();
  let current_id = id;
  let edge_found = edges.find((e) => e.target === current_id);
  while (edge_found) {
    current_id = edge_found.source;

    if (current_id === "start") {
      return true;
      break;
    }

    if (visited.has(current_id)) {
      return false;
      // cycled node
      break;
    }
    visited.add(current_id);
    edge_found = edges.find((e) => e.target === current_id);
  }
  return false;
};
