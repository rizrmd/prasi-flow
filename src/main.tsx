import {
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect } from "react";
import { sampleFlow } from "./flow/runtime/test/fixture";
import { PFNode } from "./flow/runtime/types";

export function Main() {
  const local = useLocal({
    source_flow: sampleFlow(),
    nodes: [] as Node[],
    edges: [] as Edge[],
  });
  useEffect(() => {
    const { edges, nodes } = parseNodes(local.source_flow.nodes);
    // console.log(
    //   edges,
    //   nodes.map((e) => ({
    //     x: e.position.x,
    //     y: e.position.y,
    //     label: e.data.label,
    //   }))
    // );
    local.edges = edges;
    local.nodes = nodes;
    local.render();
  }, [local.source_flow]);

  return (
    <div
      className={cx(
        "fixed inset-0 w-screen h-screen",
        css`
          .react-flow__attribution {
            display: none;
          }
        `
      )}
    >
      <ReactFlow
        fitView
        selectionOnDrag
        nodes={local.nodes}
        edges={local.edges}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

const parseNodes = (
  input_nodes: PFNode[],
  existing?: { nodes: Node[]; edges: Edge[]; x: number; y: number }
) => {
  const nodes: Node[] = existing ? existing.nodes : [];
  const edges: Edge[] = existing ? existing.edges : [];
  let last = null as null | Node;
  let y = 0;
  for (const inode of input_nodes) {
    const node = {
      id: inode.id,
      data: { label: `[${inode.type}] ${inode.name}` },
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
        if (branch.nodes.length > 0) {
          edges.push({
            id: `${node.id}-${branch.nodes[0].id}`,
            source: node.id,
            target: branch.nodes[0].id,
            type: "smoothstep",
          });
          parseNodes(branch.nodes, {
            nodes,
            edges,
            x: i++,
            y: by,
          });
        }
      }
    }

    if (last) {
      edges.push({
        id: `${last.id}-${node.id}`,
        source: last.id,
        target: node.id,
      });
    }

    last = node;
    nodes.push(node);
  }
  return { nodes, edges };
};
