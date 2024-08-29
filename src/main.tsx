import {
  Background,
  Controls,
  Edge,
  Node,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect } from "react";
import { sampleFlow } from "./flow/runtime/test/fixture";
import { PFNode } from "./flow/runtime/types";

export function Main() {
  const local = useLocal({
    source_flow: sampleFlow(),
  });

  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  useEffect(() => {
    const parsed = parseNodes(local.source_flow.nodes);
    // console.log(
    //   edges,
    //   nodes.map((e) => ({
    //     x: e.position.x,
    //     y: e.position.y,
    //     label: e.data.label,
    //   }))
    // );
    setNodes(parsed.nodes);
    setEdges(parsed.edges);
    local.render();
  }, [local.source_flow]);

  console.log();
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
      <div className="absolute top-0 left-0 p-2 bg-white">
        {JSON.stringify(
          nodes.map((e) => ({
            s: e.sourcePosition,
            t: e.targetPosition,
            x: e.position.x,
            y: e.position.y,
          }))
        )}
      </div>
      <ReactFlow
        maxZoom={1.1}
        fitView
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodes={nodes}
        edges={edges}
        onNodeClick={(_, node) => {
          node.sourcePosition =
            node.sourcePosition === Position.Right
              ? Position.Bottom
              : Position.Right;

          node.targetPosition =
            node.targetPosition === Position.Top ? Position.Left : Position.Top;

          const idx = nodes.findIndex((e) => e.id === node.id);
          nodes.splice(idx, 1, node);
          setNodes([...nodes]);
        }}
      >
        <Background />
        <Controls />
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
        type: "smoothstep",
        target: node.id,
      });
    }

    last = node;
    nodes.push(node);
  }
  return { nodes, edges };
};
