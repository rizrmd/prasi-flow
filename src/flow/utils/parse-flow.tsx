import { PF } from "../runtime/types";
import { parseNodes } from "./parse-node";

export const parseFlow = (pf: PF) => {
  const parsed = parseNodes(pf.nodes, pf.main_flow);

  const spare_flows = Object.values(pf.spare_flow);
  if (spare_flows.length > 0) {
    for (const flow of spare_flows) {
      parseNodes(pf.nodes, flow, {
        existing: {
          rf_edges: parsed.edges,
          rf_nodes: parsed.nodes,
          x: 0,
          y: 0,
          next_flow: [],
        },
      });
    }
  }
  return parsed;
};
