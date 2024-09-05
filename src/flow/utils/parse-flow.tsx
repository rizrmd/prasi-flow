import { PF } from "../runtime/types";
import { parseNodes } from "./parse-node";

export const parseFlow = (pf: PF) => {
  const parsed = { nodes: [], edges: [] };

  const existing = new Set<string>();
  if (pf.flow) {
    for (const id of Object.keys(pf.flow)) {
      existing.add(id);
    }

    for (const id of Object.keys(pf.nodes)) {
      if (!existing.has(id)) {
        pf.flow[id] = [id];
      }
    }

    const flows = Object.values(pf.flow);
    if (flows.length > 0) {
      for (const flow of flows) {
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
  }

  return parsed;
};
