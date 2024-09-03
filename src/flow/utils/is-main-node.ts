import { Edge } from "@xyflow/react";
import { PFNode } from "../runtime/types";

export const isMainPFNode = ({
  id,
  nodes,
  edges,
  mode = "source",
}: {
  id: string;
  nodes: Record<string, PFNode>;
  edges: Edge[];
  mode?: "source" | "target";
}) => {
  const visited = new Set<string>();
  let current_id = id;
  let edge_found = edges.find((e) => e[mode] === current_id);
  while (edge_found) {
    current_id = edge_found.source;
    if (nodes[current_id]?.type === "start") {
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
