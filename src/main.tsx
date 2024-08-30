import { MagicWandIcon } from "@radix-ui/react-icons";
import {
  Background,
  ControlButton,
  Controls,
  Edge,
  Node,
  ReactFlow,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect } from "react";
import { sampleFlow } from "./flow/runtime/test/fixture";
import { PF } from "./flow/runtime/types";
import { findPFNode } from "./flow/utils/find-node";
import { isMainPFNode } from "./flow/utils/is-main-node";
import { getLayoutedElements } from "./flow/utils/node-utils";
import { EdgeType, parseNodes } from "./flow/utils/parse-node";

export function Main() {
  const local = useLocal({
    pf: null as null | PF,
    reactflow: null as null | ReactFlowInstance<Node, Edge>,
    save_timeout: null as any,
  });

  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);

  // ini sementara save ke localStorage, nanti akan diganti save ke file di prasi
  const savePF = () => {
    clearTimeout(local.save_timeout);
    setTimeout(() => {
      localStorage.setItem("pf-local", JSON.stringify(local.pf));
    }, 200);
  };

  useEffect(() => {
    const temp = localStorage.getItem("pf-local");
    let pf = null as null | PF;
    let relayout = false;
    if (temp) {
      pf = JSON.parse(temp);
    } else {
      pf = sampleFlow();
      relayout = true;
    }
    if (pf) {
      local.pf = pf;
      const parsed = parseNodes(pf.nodes, pf.main_flow);

      const spare_flows = Object.values(pf.spare_flow);
      if (spare_flows.length > 0) {
        for (const flow of spare_flows) {
          const spare = parseNodes(pf.nodes, flow);
          parsed.nodes = [...parsed.nodes, ...spare.nodes];
          parsed.edges = [...parsed.edges, ...spare.edges];
        }
      }

      if (relayout) {
        relayoutNodes({ nodes: parsed.nodes, edges: parsed.edges });
      } else {
        setNodes(parsed.nodes);
        setEdges(parsed.edges);
      }

      savePF();
    }
  }, []);

  const relayoutNodes = (arg?: { nodes: Node[]; edges: Edge[] }) => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      arg?.nodes || nodes,
      arg?.edges || edges,
      "TB"
    );

    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);

    if (local.pf) {
      for (const n of layoutedNodes) {
        const node = local.pf.nodes[n.id];
        if (node) {
          node.position = n.position;
        }
      }

      savePF();
    }

    const ref = local.reactflow;
    if (ref) {
      setTimeout(() => {
        ref.fitView();
      });
    }
  };

  return (
    <div
      className={cx(
        "fixed inset-0 w-screen h-screen",
        css`
          .react-flow__attribution {
            display: none;
          }

          .react-flow__node {
            cursor: pointer;

            &.start {
              border: 1px solid green;
              width: 60px;
              height: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 9px;
              background-color: #edffed;
            }

            &:hover {
              background-color: #e8f3ff;
            }
            &.selected {
              outline: 1px solid blue;
              border: 1px solid blue;
              background-color: #e8f3ff;
            }
          }

          .react-flow__edge {
            &.selected {
              .react-flow__edge-path {
                stroke-width: 2px;
                stroke: blue;
              }
              .react-flow__edge-text {
                fill: blue;
              }
            }
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
        onInit={(ref) => {
          local.reactflow = ref;
        }}
        onNodesChange={(changes) => {
          const pf = local.pf;
          if (pf) {
            for (const c of changes) {
              if (c.type === "position") {
                pf.nodes[c.id].position = c.position;
                savePF();
              }
            }
          }
          return onNodesChange(changes);
        }}
        onEdgesChange={(changes) => {
          const pf = local.pf;
          if (pf) {
            for (const c of changes) {
              if (c.type === "remove") {
                const edge = edges.find((e) => e.id === c.id);
                if (edge) {
                  if (
                    isMainPFNode({ id: edge.target, nodes: pf.nodes, edges })
                  ) {
                    const found = findPFNode({ id: edge.target, pf });
                    if (found) {
                      const spare_flow = found.flow.splice(
                        found.idx,
                        found.flow.length - found.idx
                      );

                      if (spare_flow.length > 0) {
                        pf.spare_flow[spare_flow[0]] = spare_flow;
                      }

                      savePF();
                    }
                  }
                }
              }
            }
          }

          return onEdgesChange(changes);
        }}
        nodes={nodes}
        edges={edges}
        onConnectEnd={(_, state) => {
          console.log(state);
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
                    type: EdgeType,
                  },
                ]);
              }
            }
          }
        }}
        onNodeClick={(_) => {
          // const result = isMainNode({ id: node.id, nodes, edges });
          // node.sourcePosition =
          //   node.sourcePosition === Position.Right
          //     ? Position.Bottom
          //     : Position.Right;
          // node.targetPosition =
          //   node.targetPosition === Position.Top ? Position.Left : Position.Top;
          // const idx = nodes.findIndex((e) => e.id === node.id);
          // nodes.splice(idx, 1, node);
          // setNodes([...nodes]);
        }}
      >
        <Background />
        <Controls position="top-left">
          <ControlButton onClick={() => relayoutNodes()}>
            <MagicWandIcon />
          </ControlButton>
        </Controls>
      </ReactFlow>
    </div>
  );
}
