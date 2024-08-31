import { Edge, Node, Position } from "@xyflow/react";
import { PFNode, PFNodeID } from "../runtime/types";

export const EdgeType = "default";

export const parseNodes = (
  nodes: Record<PFNodeID, PFNode>,
  flow: PFNodeID[],
  opt?: {
    is_spare?: boolean;
    existing?: {
      rf_nodes: Node[];
      rf_edges: Edge[];
      x: number;
      y: number;
      next_flow: PFNode[];
    };
  }
) => {
  const existing = opt?.existing || undefined;
  const rf_nodes: Node[] = existing ? existing.rf_nodes : [];
  const rf_edges: Edge[] = existing ? existing.rf_edges : [];

  const flow_nodes = [
    ...flow.map((id) => nodes[id]),
    ...(existing?.next_flow || []),
  ];
  let prev = null as null | Node;
  let y = 0;

  for (const inode of flow_nodes) {
    const node = {
      id: inode.id,
      type: inode.type === "start" ? "input" : "default",
      className: inode.type,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      data: {
        type: inode.type,
        label:
          inode.type === "start" ? (
            "Start"
          ) : (
            <>
              [{inode.type}] {inode.name}
              <br />
              <small>{inode.id}</small>
            </>
          ),
      },
      position: inode.position || {
        x: (existing?.x || 0) * 200,
        y: ((existing?.y || 0) + y) * 100,
      },
    };
    y++;

    if (inode.branches) {
      let i = 0;
      let by = y;
      for (const branch of inode.branches) {
        if (branch.flow.length > 0) {
          rf_edges.push({
            id: `${node.id}-${branch.flow[0]}`,
            source: node.id,
            target: branch.flow[0],
            type: EdgeType,
            label: branch.name,
          });
          parseNodes(nodes, branch.flow, {
            existing: {
              rf_nodes,
              rf_edges,
              x: i++ - 0.5,
              y: by,
              next_flow: flow_nodes.slice(y),
            },
          });
        }
      }
    }

    if (prev) {
      rf_edges.push({
        id: `${prev.id}-${node.id}`,
        source: prev.id,
        type: EdgeType,
        target: node.id,
      });
    }

    prev = node;
    rf_nodes.push(node);

    if (inode.branches) {
      break;
    }
  }

  return { nodes: rf_nodes, edges: rf_edges };
};
