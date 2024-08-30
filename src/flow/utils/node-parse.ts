import { PFNode } from "../runtime/types";
import { Edge, Node, Position } from "@xyflow/react";

// parsing PF node punya prasi ke node punya react flow
export const parseNodes = (
  input_nodes: PFNode[],
  opt?: {
    is_spare?: boolean;
    existing?: {
      nodes: Node[];
      edges: Edge[];
      x: number;
      y: number;
      next_inodes: PFNode[];
    };
  }
) => {
  const existing = opt?.existing || undefined;
  const is_spare = !!opt?.is_spare;
  const nodes: Node[] = existing ? existing.nodes : [];
  const edges: Edge[] = existing ? existing.edges : [];
  let last = null as null | Node;
  let y = 0;

  if (nodes.length === 0 && !existing && !is_spare) {
    const node = {
      id: "start",
      type: "input",
      data: { label: "Start" },
      className: "pfn-start",
      position: { x: 0, y: -100 },
    };
    nodes.push(node);
  }

  const final_node = [...input_nodes, ...(existing?.next_inodes || [])];

  for (const inode of final_node) {
    const node = {
      id: inode.id,
      type: "default",
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      data: { label: `[${inode.type}] ${inode.name}` },
      position: inode.position || {
        x: (existing?.x || 0) * 200,
        y: ((existing?.y || 0) + y) * 100,
      },
    };
    y++;

    if (nodes.length === 1 && !existing && !is_spare) {
      edges.push({
        id: `start-${node.id}`,
        source: "start",
        target: node.id,
        type: "smoothstep",
      });
    }

    if (inode.branches) {
      let i = 0;
      let by = y;
      for (const branch of inode.branches) {
        if (branch.nodes.length > 0) {
          edges.push({
            id: `${node.id}-${branch.nodes[0].id}`,
            source: node.id,
            target: branch.nodes[0].id,
            type: "smoothstep",
            label: branch.name,
          });
          parseNodes(branch.nodes, {
            existing: {
              nodes,
              edges,
              x: i++ - 0.5,
              y: by,
              next_inodes: final_node.slice(y),
            },
          });
        }
      }
    }

    if (last) {
      edges.push({
        id: `${last.id}-${node.id}`,
        source: last.id,
        type: "smoothstep",
        target: node.id,
      });
    }

    last = node;
    nodes.push(node);

    if (inode.branches) {
      break;
    }
  }
  return { nodes, edges };
};
