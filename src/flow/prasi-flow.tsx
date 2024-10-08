import { createId } from "@paralleldrive/cuid2";
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
  useStore,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { LayoutDashboard } from "lucide-react";
import { useEffect } from "react";
import { sampleFlow } from "./runtime/test/fixture";
import { PF, PFNodeID } from "./runtime/types";
import { findFlow, loopPFNode } from "./utils/find-node";
import { fg } from "./utils/flow-global";
import { getLayoutedElements } from "./utils/node-layout";
import { parseFlow } from "./utils/parse-flow";
import { RenderEdge } from "./utils/render-edge";
import { RenderNode } from "./utils/render-node";
import { savePF } from "./utils/save-pf";
import { EdgeType } from "./utils/parse-node";

export function PrasiFlow() {
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
    action: {
      resetSelectedElements: () => {},
      addSelectedNodes: () => {},
      addSelectedEdges: () => {},
    },
  });
  fg.main = local;

  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);

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

      savePF(local.pf);

      const ival = setInterval(() => {
        const ref = local.reactflow;
        if (ref) {
          ref.fitView();
          clearInterval(ival);
        }
      }, 10);
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

      savePF(local.pf);
    }

    const ref = local.reactflow;
    if (ref) {
      setTimeout(() => {
        ref.fitView();
      });
    }
  };

  fg.reload = (relayout?: boolean) => {
    if (fg.pf) {
      const selection = { ...fg.prop?.selection };

      const parsed = parseFlow(fg.pf);

      if (relayout) {
        relayoutNodes(parsed);
      } else {
        setNodes(parsed.nodes);
        setEdges(parsed.edges);
      }

      setTimeout(() => {
        fg.main?.action.resetSelectedElements();

        fg.main?.action.addSelectedEdges(
          selection.edges?.map((e) => e.id) || []
        );

        fg.main?.action.addSelectedNodes(
          selection.nodes?.map((e) => e.id) || []
        );

      });
    }
  };

  const connectTo = (pf: PF, from: string, to: string, flow: PFNodeID[]) => {
    const idx = flow.findIndex((id) => id === from);
    const found = idx >= 0;

    if (found) {
      const last_flow = flow.slice(idx + 1);
      flow.splice(idx + 1, flow.length - idx - 1);

      if (last_flow[0] && !pf.flow[last_flow[0]]) {
        pf.flow[last_flow[0]] = last_flow;
      }
    }
    const spare = pf.flow[to];
    if (spare) {
      delete pf.flow[to];
      for (const id of spare) {
        flow.push(id);
      }
    } else {
      flow.push(to);
    }

    const parsed = parseFlow(pf);
    setNodes(parsed.nodes);
    setEdges(parsed.edges);
    savePF(local.pf);

    if (to) {
      setTimeout(() => {
        fg.main?.action.resetSelectedElements();
        fg.main?.action.addSelectedNodes([to]);
      }, 200);
    }
  };

  fg.pf = local.pf;
  return (
    <div
      className={cx(
        "w-full h-full",
        css`
          .react-flow__attribution {
            display: none;
          }

          .react-flow__node {
            cursor: pointer;
            border: 0px !important;
            box-shadow: none !important;
            width: auto;

            &.selected > .pf-node {
              outline: 1px solid blue;
              border: 1px solid blue;
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
          .react-flow__controls-button .lucide {
            fill: transparent;
            max-width: 15px;
            max-height: 15px;
          }
        `
      )}
    >
      <ReactFlow
        maxZoom={1.1}
        onInit={(ref) => {
          local.reactflow = ref;
        }}
        fitView
        nodeTypes={local.nodeTypes}
        edgeTypes={local.edgeTypes}
        onSelectionChange={(changes) => {
          if (fg.prop) {
            fg.prop.selection = {
              ...changes,
              loading: fg.prop.selection.loading,
            };
            fg.prop.render();
          }
        }}
        onNodesChange={(changes) => {
          const pf = local.pf;
          let should_save = false;
          if (pf) {
            let select_id = "";
            for (const c of changes) {
              if (c.type === "position") {
                pf.nodes[c.id].position = c.position;
                should_save = true;
              } else if (c.type === "remove") {
                should_save = true;
                const node = pf.nodes[c.id];
                const node_branch = node?.branches
                  ? node.branches.find((e) => e.flow.length > 0)?.flow
                  : undefined;
                const target_id = edges
                  .filter((e) => e.source === c.id)
                  .map((e) => e.target)[0];

                delete pf.nodes[c.id];
                delete pf.flow[c.id];
                for (const node of Object.values(pf.nodes)) {
                  if (node.branches) {
                    for (const branch of node.branches) {
                      const idx = branch.flow.findIndex((e) => e === c.id);
                      if (idx >= 0) {
                        const spare_flow = branch.flow.splice(
                          idx,
                          branch.flow.length - idx
                        );

                        if (spare_flow.length > 1) {
                          pf.flow[spare_flow[0]] = spare_flow;
                        }
                      }
                    }
                  }
                }

                const source_ids = edges
                  .filter((e) => e.target === c.id)
                  .map((e) => e.source);

                for (const source of source_ids) {
                  if (!select_id) select_id = source;
                  const from = pf.nodes[source];
                  if (from) {
                    if (from.branches) {
                      const empty_branch = from.branches.find(
                        (e) => e.flow.length === 0
                      );
                      if (empty_branch) {
                        if (target_id) {
                          empty_branch.flow.push(target_id);
                        }
                      }
                    } else {
                      const source_flow = findFlow({ id: from.id, pf });
                      if (source_flow) {
                        if (node_branch) {
                          for (const id of node_branch) {
                            if (!source_flow.flow.includes(id))
                              source_flow.flow.push(id);
                          }
                        } else if (target_id) {
                          if (!source_flow.flow.includes(target_id))
                            source_flow.flow.push(target_id);
                        }
                        for (let i = 0; i < source_flow.flow.length; i++) {
                          const id = source_flow.flow[i];
                          if (id === c.id) {
                            source_flow.flow.splice(i, 1);
                            break;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            if (should_save) {
              savePF(pf, {
                then: () => {
                  if (select_id) {
                    fg.reload();
                    setTimeout(() => {
                      fg.main?.action.resetSelectedElements();
                      fg.main?.action.addSelectedNodes([select_id]);
                    }, 200);
                  }
                },
              });
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
            if (
              changes.length === 2 &&
              changes[0].type === "remove" &&
              changes[1].type === "remove"
            ) {
              const from = changes[0];
              const to = changes[1];

              const from_edge = edges.find((e) => from.id === e.id);
              const to_edge = edges.find((e) => to.id === e.id);

              if (from_edge && to_edge) {
                const from_node = pf.nodes[from_edge.source];
                if (from_node.branches) {
                } else {
                  setEdges([
                    ...edges,
                    {
                      id: `${from_edge.source}-${to_edge.target}`,
                      source: from_edge.source,
                      target: to_edge.target,
                      animated: true,
                    },
                  ]);
                }
              }
            } else if (changes.length === 1) {
              for (const c of changes) {
                if (c.type === "remove") {
                  const edge = edges.find((e) => e.id === c.id);
                  if (edge) {
                    for (const flow of Object.values(pf.flow)) {
                      let should_break = false;
                      loopPFNode(
                        pf.nodes,
                        flow,
                        ({ flow, idx, parent, is_invalid }) => {
                          if (is_invalid) {
                            for (const [k, v] of Object.entries(pf.flow)) {
                              if (flow === v) {
                                delete pf.flow[k];
                              }
                            }
                            should_break = true;
                            return false;
                          }

                          if (flow.includes(edge.target)) {
                            if (
                              flow[idx - 1] === edge.source ||
                              parent?.id === edge.source
                            ) {
                              const res = flow.splice(idx, flow.length - idx);
                              if (res.length > 0) {
                                pf.flow[res[0]] = res;
                              }
                              should_break = true;
                              return false;
                            }
                          }

                          return true;
                        }
                      );
                      if (should_break) {
                        savePF(local.pf);
                        setTimeout(() => {
                          fg.reload();
                        }, 100);
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
          const pf = local.pf;
          if (!pf) return;

          let from_id = "";
          let to_id = "";
          const from = state.fromNode;
          if (from) from_id = from.id;

          if (state.isValid) {
            const to = state.toNode;
            if (to) to_id = to.id;
          } else {
            if (fg.pointer_up_id) {
              to_id = fg.pointer_up_id;
              fg.pointer_up_id = "";
            } else {
              const found = edges.find((e) => e.source === from_id);
              const f = findFlow({ id: from_id, pf: pf });

              if (found) {
                const new_node = {
                  type: "code",
                  id: createId(),
                  position: fg.pointer_to as any,
                };
                pf.nodes[new_node.id] = new_node;
                to_id = new_node.id;
                if (f) {
                  const new_flow = f.flow.splice(
                    f.idx + 1,
                    f.flow.length - f.idx - 1
                  );
                  if (new_flow.length > 0) {
                    pf.flow[new_flow[0]] = new_flow;
                  }
                }
              } else {
                if (f.idx >= 0 && from) {
                  const position = fg.pointer_to || {
                    x: from.position.x,
                    y: from.position.y + 100,
                  };
                  position.x -= 70;
                  fg.pointer_to = null;
                  const new_node = {
                    type: "code",
                    id: createId(),
                    position,
                  };
                  pf.nodes[new_node.id] = new_node;

                  const from_node = pf.nodes[from.id];
                  if (from_node.branches) {
                    const branch = from_node.branches[0];
                    if (branch) branch.flow.push(new_node.id);
                  } else {
                    f.flow.push(new_node.id);
                  }
                  savePF(pf);
                  fg.reload();

                  setTimeout(() => {
                    fg.main?.action.resetSelectedElements();
                    fg.main?.action.addSelectedNodes([new_node.id]);
                  });
                  return;
                }
              }
            }
          }

          if (from_id && to_id) {
            if (from_id === to_id) return;

            const found = edges.find((e) => {
              return e.source === from_id && e.target === to_id;
            });

            if (!found && pf) {
              // setEdges([
              //   ...edges,
              //   {
              //     id: `${from_id}-${to_id}`,
              //     source: from_id,
              //     target: to_id,
              //     type: EdgeType,
              //     animated: true,
              //   },
              // ]);

              const from_node = pf.nodes[from_id];

              if (from_node) {
                if (from_node.branches) {
                  let picked_branches = from_node.branches?.find(
                    (e) => e.flow.length === 0
                  );

                  if (!picked_branches) {
                    const spare = from_node?.branches?.[0]?.flow;
                    if (spare) {
                      from_node.branches[0].flow = [];
                      pf.flow[spare[0]] = spare;
                      picked_branches = from_node.branches[0];
                    }
                  }

                  if (picked_branches) {
                    connectTo(pf, from_id, to_id, picked_branches.flow);
                  }
                } else {
                  const found = findFlow({ id: from_node.id, pf });

                  if (found && found.flow[found.idx + 1] !== to_id) {
                    connectTo(pf, from_id, to_id, found.flow);
                  }
                }
                fg.reload();
              }
            }
          }
        }}
      >
        <Selection />
        <Background />
        <Controls position="top-left" showInteractive={false}>
          <ControlButton onClick={() => relayoutNodes()} title="auto layout">
            <LayoutDashboard strokeWidth={1.8} />
          </ControlButton>
        </Controls>
      </ReactFlow>
    </div>
  );
}

const Selection = () => {
  const { resetSelectedElements, addSelectedNodes, addSelectedEdges } =
    useStore((store) => ({
      resetSelectedElements: store.resetSelectedElements,
      addSelectedNodes: store.addSelectedNodes,
      addSelectedEdges: store.addSelectedEdges,
    }));

  if (fg.main)
    fg.main.action = {
      resetSelectedElements,
      addSelectedNodes,
      addSelectedEdges,
    };
  return <></>;
};
