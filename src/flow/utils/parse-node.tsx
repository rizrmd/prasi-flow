import { Edge, Node, Position } from "@xyflow/react";
import { PFNode, PFNodeID } from "../runtime/types";
import { allNodeDefinitions } from "../runtime/nodes";

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

  let flow_mapped: PFNode[] = [];
  for (let i = 0; i < flow.length; i++) {
    const id = flow[i];

    if (!nodes[id]) {
      flow.splice(i, flow.length - 1);
      break;
    } else {
      flow_mapped.push(nodes[id]);
    }
  }

  let flow_nodes = [...flow_mapped, ...(existing?.next_flow || [])];
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
        label: inode.type === "start" ? "Start" : inode.name,
      },
      position: inode.position || {
        x: (existing?.x || 0) * 200,
        y: ((existing?.y || 0) + y) * 100,
      },
    };
    y++;

    const branching = (allNodeDefinitions as any)[inode.type]?.branching;
    if (branching) {
      if (!inode.branches) {
        if (inode.unused_branches) {
          inode.branches = inode.unused_branches;
          delete inode.unused_branches;
          const idx = flow.findIndex((e) => e === inode.id);
          if (idx !== flow.length - 1) {
            flow.splice(idx + 1, flow.length - idx - 1);
            flow_nodes.splice(idx + 1, flow_nodes.length - idx - 1);
          }
        } else {
          inode.branches = [];
        }
      }
      branching({ node: inode, flow, nodes });
    } else {
      if (inode.branches) {
        const non_empty_flow =
          inode.branches.find((e) => e.flow.length > 0)?.flow || [];
        inode.unused_branches = inode.branches;
        delete inode.branches;
        const fidx = flow_mapped.findIndex((e) => e.id === inode.id);
        const idx = flow.findIndex((id) => id === inode.id);
        let i = 1;
        for (const id of non_empty_flow) {
          if (id !== inode.id) {
            flow.splice(idx + i, 0, id);
            flow_mapped.splice(fidx + i, 0, nodes[id]);
            i++;
          }
        }
      }
    }

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
            data: { branch },
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
