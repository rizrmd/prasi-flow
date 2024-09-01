import { Edge, Node } from "@xyflow/react";
import dagre from "dagre";

const nodeWidth = 250;
const nodeHeight = 64;

export const getSize = (node: Node) => {
  if (node.data.type === "start") {
    return { w: 160, h: 20 };
  }
  return { w: nodeWidth, h: nodeHeight };
};

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: "TB" | "LR" = "TB"
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

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
