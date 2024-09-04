import { Edge, Node, Position } from "@xyflow/react";
import { PFNode, PFNodeID } from "../runtime/types";

export const EdgeType = "default";
export const parseNodes = (
  nodes: Record<PFNodeID, PFNode>,
  flow: PFNodeID[],
  opt?: {
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

  const flow_mapped: PFNode[] = [];
  for (let i = 0; i < flow.length; i++) {
    const id = flow[i];

    if (!nodes[id]) {
      flow.splice(i, flow.length - 1);
      break;
    } else {
      flow_mapped.push(nodes[id]);
    }
  }

  const flow_nodes = [...flow_mapped, ...(existing?.next_flow || [])];
  let prev = null as null | Node;
  let y = 0;

  for (const inode of flow_nodes) {
    const node: Node = {
      id: inode.id,
      type: "default",
      className: inode.type,
      deletable: inode.type !== "start",
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
          branch.flow = branch.flow.filter((id) => id !== inode.id);

          const edge_id = `${node.id}-${branch.flow[0]}`;
          if (rf_edges.find((e) => e.id === edge_id)) {
            break;
          }

          if (node.id === branch.flow[0]) {
            continue;
          }

          rf_edges.push({
            id: edge_id,
            source: node.id,
            target: branch.flow[0],
            type: EdgeType,
            label: branch.name,
            animated: true,
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
      const edge_id = `${prev.id}-${node.id}`;
      if (rf_edges.find((e) => e.id === edge_id)) {
      } else {
        rf_edges.push({
          id: edge_id,
          source: prev.id,
          type: EdgeType,
          target: node.id,
          animated: true,
        });
      }
    }

    prev = node;
    rf_nodes.push(node);

    if (inode.branches) {
      break;
    }
  }

  return { nodes: rf_nodes, edges: rf_edges };
};
