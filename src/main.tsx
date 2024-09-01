import { MagicWandIcon } from "@radix-ui/react-icons";
import {
  Background,
  ControlButton,
  Controls,
  Edge,
  getOutgoers,
  Node,
  ReactFlow,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect } from "react";
import { sampleFlow } from "./flow/runtime/test/fixture";
import { PF, PFNodeID } from "./flow/runtime/types";
import { findPFNode, loopPFNode } from "./flow/utils/find-node";
import { isMainPFNode } from "./flow/utils/is-main-node";
import { getLayoutedElements } from "./flow/utils/node-utils";
import { parseFlow } from "./flow/utils/parse-flow";
import { RenderNode } from "./flow/render-node";
import { RenderEdge } from "./flow/render-edge";
import { fg } from "./flow/utils/flow-global";

export function Main() {
  const local = useLocal({
    pf: null as null | PF,
    reactflow: null as null | ReactFlowInstance<Node, Edge>,
    save_timeout: null as any,
    nodeTypes: {
      default: RenderNode,
    },
    edgeTypes: {
      default: RenderEdge,
    },
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
      const parsed = parseFlow(pf);

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

  const connectTo = (pf: PF, from: string, to: string, flow: PFNodeID[]) => {
    const idx = flow.findIndex((id) => id === from);
    const found = idx >= 0;

    if (found) {
      const last_flow = flow.slice(idx + 1);
      flow.splice(idx + 1, flow.length - idx - 1);

      if (last_flow[0] && !pf.spare_flow[last_flow[0]]) {
        pf.spare_flow[last_flow[0]] = last_flow;
      }
    }
    const spare = pf.spare_flow[to];
    if (spare) {
      delete pf.spare_flow[to];
      for (const id of spare) {
        flow.push(id);
      }
    } else {
      flow.push(to);
    }

    const parsed = parseFlow(pf);
    setNodes(parsed.nodes);
    setEdges(parsed.edges);
    savePF();
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

            &.selected {
              outline: 1px solid blue;
              border: 1px solid blue;
              background-color: #e8f3ff;
            }
          }
          .react-flow__node-default {
            padding: 0;
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
        connectionRadius={100}
        nodeTypes={local.nodeTypes}
        edgeTypes={local.edgeTypes}
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
        isValidConnection={(connection) => {
          const target = nodes.find((node) => node.id === connection.target);
          const hasCycle = (node: Node, visited = new Set()) => {
            if (visited.has(node.id)) return false;

            visited.add(node.id);

            for (const outgoer of getOutgoers(node, nodes, edges)) {
              if (outgoer.id === connection.source) return true;
              if (hasCycle(outgoer, visited)) return true;
            }
          };

          if (target) {
            if (target.id === connection.source) return false;
            return !hasCycle(target);
          }
          return true;
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

                      if (spare_flow.length > 1) {
                        pf.spare_flow[spare_flow[0]] = spare_flow;
                      }

                      savePF();
                    }
                  } else {
                    for (const spare of Object.values(pf.spare_flow)) {
                      let should_break = false;
                      loopPFNode(pf.nodes, spare, ({ flow, idx }) => {
                        if (flow.includes(edge.target)) {
                          should_break = true;

                          const spare_flow = flow.splice(
                            idx,
                            flow.length - idx
                          );

                          if (spare_flow.length > 1) {
                            pf.spare_flow[spare_flow[0]] = spare_flow;
                          }

                          return false;
                        }
                        return true;
                      });
                      if (should_break) {
                        break;
                      }
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
          let from_id = "";
          let to_id = "";
          const from = state.fromNode;
          if (from) from_id = from.id;

          if (state.isValid) {
            const to = state.toNode;
            if (to) to_id = to.id;
          } else if (fg.pointer_up_id) {
            to_id = fg.pointer_up_id;
            fg.pointer_up_id = "";
          }

          if (from_id && to_id) {
            if (from_id === to_id) return;

            const found = edges.find((e) => {
              return e.source === from_id && e.target === to_id;
            });

            const pf = local.pf;

            if (!found && pf) {
              const from_node = pf.nodes[from_id];
              const to_node = pf.nodes[to_id];
              const is_from_main = isMainPFNode({
                id: from_node.id,
                nodes: pf.nodes,
                edges,
              });
              const is_to_main = isMainPFNode({
                id: to_node.id,
                nodes: pf.nodes,
                edges,
              });

              // if (
              //   (is_from_main && is_to_main) ||
              //   (!is_from_main && !is_to_main) ||
              //   (is_from_main && !is_to_main)
              // ) {
              if (from_node) {
                if (from_node.branches) {
                  let picked_branches = from_node.branches?.find(
                    (e) => e.flow.length === 0
                  );

                  if (!picked_branches) {
                    const spare = from_node.branches[0].flow;
                    from_node.branches[0].flow = [];
                    pf.spare_flow[spare[0]] = spare;
                    picked_branches = from_node.branches[0];
                  }

                  if (picked_branches) {
                    connectTo(pf, from_id, to_id, picked_branches.flow);
                  }
                } else {
                  const found = findPFNode({ id: from_node.id, pf });
                  if (found) {
                    connectTo(pf, from_id, to_id, found.flow);
                  }
                }
              }
              // }
            }
          }
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
