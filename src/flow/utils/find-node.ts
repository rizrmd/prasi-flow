import { PF, PFNode, PFNodeID } from "../runtime/types";

export const findFlow = ({ id, pf }: { id: string; pf: PF }) => {
  let result = { flow: [] as PFNodeID[], idx: -1 };
  loopPFNode(pf.nodes, pf.main_flow, ({ flow, idx }) => {
    if (flow[idx] === id) {
      result = { flow, idx };
      return false;
    }

    return true;
  });

  return result;
};

export const loopPFNode = (
  nodes: Record<string, PFNode>,
  flow: PFNodeID[],
  fn: (arg: { flow: PFNodeID[]; idx: number }) => boolean,
  visited = new Set<string>()
) => {
  let idx = 0;
  for (const id of flow) {
    if (!fn({ flow, idx })) {
      return false;
    }
    const node = nodes[id];
    if (!node) {
      console.log(id, nodes);
      continue;
    }
    if (visited.has(node.id)) {
      continue;
    } else {
      visited.add(node.id);
    }

    if (node && node.branches) {
      for (const branch of node.branches) {
        if (branch.flow.length > 0) {
          if (!loopPFNode(nodes, branch.flow, fn)) {
            return false;
          }
        }
      }
    }
    idx++;
  }
  return true;
};
