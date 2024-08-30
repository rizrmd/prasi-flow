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
import dagre from "dagre";
import { useEffect } from "react";
import { sampleFlow } from "./flow/runtime/test/fixture";
import { PFNode } from "./flow/runtime/types";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

export function Main() {
  const local = useLocal({
    source_flow: sampleFlow(),
  });

  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
  useEffect(() => {
    const parsed = parseNodes(local.source_flow.nodes);
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      parsed.nodes,
      parsed.edges,
      "TB"
    );

    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
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

          .pfn-start {
            border: 1px solid green;
            width: 60px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 9px;
            background-color: #edffed;
          }
        `
      )}
    >
      {/* <div className="absolute top-0 left-0 p-2 bg-white">
        {JSON.stringify(
          nodes.map((e) => ({
            s: e.sourcePosition,
            t: e.targetPosition,
            x: e.position.x,
            y: e.position.y,
          }))
        )}
      </div> */}
      <ReactFlow
        maxZoom={1.1}
        fitView
        onNodesChange={(changes) => {
          for (const c of changes) {
            if (c.type === "position") {
              const node = local.source_flow.nodes.find((e) => e.id === c.id);
              if (node) {
                node.position = c.position;
              }
            }
          }
          return onNodesChange(changes);
        }}
        onEdgesChange={(changes) => {
          return onEdgesChange(changes);
        }}
        nodes={nodes}
        edges={edges}
        onConnectEnd={(_, state) => {
          if (state.isValid) {
            const from = state.fromNode;
            const to = state.toNode;
            if (from && to) {
              const found = edges.find((e) => {
                return e.source === from.id && e.target === to.id;
              });
              if (!found) {
                setEdges([
                  ...edges,
                  {
                    id: `${from.id}-${to.id}`,
                    source: from.id,
                    target: to.id,
                    type: "smoothstep",
                  },
                ]);
              }
            }
          }
        }}
        // onNodeClick={(_, node) => {
        //   node.sourcePosition =
        //     node.sourcePosition === Position.Right
        //       ? Position.Bottom
        //       : Position.Right;

        //   node.targetPosition =
        //     node.targetPosition === Position.Top ? Position.Left : Position.Top;

        //   const idx = nodes.findIndex((e) => e.id === node.id);
        //   nodes.splice(idx, 1, node);
        //   setNodes([...nodes]);
        // }}
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

  if (nodes.length === 0 && !existing) {
    const node = {
      id: "start",
      type: "input",
      data: { label: "Start" },
      className: "pfn-start",
      position: { x: 0, y: -100 },
    };
    nodes.push(node);
  }

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

    if (nodes.length === 1 && !existing) {
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
            nodes,
            edges,
            x: i++ - 0.5,
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

const nodeWidth = 172;
const nodeHeight = 36;

const getSize = (node: Node) => {
  if (node.id === "start") {
    return { w: 82, h: 20 };
  }
  return { w: nodeWidth, h: nodeHeight };
};

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "TB"
) => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: getSize(node).w,
      height: getSize(node).h,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - getSize(node).w / 2,
        y: nodeWithPosition.y - getSize(node).h / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes as Node[], edges: edges as Edge[] };
};
