import { PF, PFNode } from "../runtime/types";

export const findPFNode = ({ id, pf }: { id: string; pf: PF }) => {
  let result = { nodes: [] as PFNode[], idx: -1, node: null as null | PFNode };
  loopPFNode(
    pf.nodes,
    pf.flow.map((id) => pf.nodes[id]),
    ({ nodes, idx, node }) => {
      if (node.id === id) {
        result = { nodes, idx, node };
        return false;
      }

      return true;
    }
  );

  return result;
};

export const loopPFNode = (
  nodes: Record<string, PFNode>,
  flow: PFNode[],
  fn: (arg: { nodes: PFNode[]; idx: number; node: PFNode }) => boolean
) => {
  let idx = 0;
  for (const node of flow) {
    if (!fn({ nodes: flow, idx, node })) {
      return false;
    }
    if (node.branches) {
      for (const branch of node.branches) {
        if (branch.flow.length > 0) {
          if (
            !loopPFNode(
              nodes,
              branch.flow.map((id) => nodes[id]),
              fn
            )
          ) {
            return false;
          }
        }
      }
    }
    idx++;
  }
  return true;
};
