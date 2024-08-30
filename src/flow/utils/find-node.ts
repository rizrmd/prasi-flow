import { PF, PFNode } from "../runtime/types";

export const findPFNode = ({ id, pf }: { id: string; pf: PF }) => {
  let result = { nodes: [] as PFNode[], idx: -1, node: null as null | PFNode };
  loopPFNode(pf.main_nodes, ({ nodes, idx, node }) => {
    if (node.id === id) {
      result = { nodes, idx, node };
      return false;
    }

    return true;
  });

  return result;
};

export const loopPFNode = (
  nodes: PFNode[],
  fn: (arg: { nodes: PFNode[]; idx: number; node: PFNode }) => boolean
) => {
  let idx = 0;
  for (const node of nodes) {
    if (!fn({ nodes, idx, node })) {
      return false;
    }
    if (node.branches) {
      for (const branch of node.branches) {
        if (branch.nodes.length > 0) {
          if (!loopPFNode(branch.nodes, fn)) {
            return false;
          }
        }
      }
    }
    idx++;
  }
  return true;
};
