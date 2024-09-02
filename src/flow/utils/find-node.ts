import { PF, PFNode, PFNodeID, PFSingleBranch } from "../runtime/types";

export const findFlow = ({
  id,
  pf,
  from,
}: {
  id: string;
  pf: PF;
  from?: string;
}) => {
  let result = {
    flow: [] as PFNodeID[],
    idx: -1,
    branch: undefined as void | PFSingleBranch,
  };
  loopPFNode(pf.nodes, pf.main_flow, ({ flow, idx, parent, branch }) => {
    if (flow[idx] === id) {
      if (from) {
        if (from === parent?.id || from === id) {
          result = { flow, idx, branch };
          return false;
        }
      } else {
        result = { flow, idx, branch };
        return false;
      }
    }

    return true;
  });

  return result;
};

export const loopPFNode = (
  nodes: Record<string, PFNode>,
  flow: PFNodeID[],
  fn: (arg: {
    flow: PFNodeID[];
    idx: number;
    parent?: PFNode;
    branch?: PFSingleBranch;
  }) => boolean,
  visited = new Set<string>(),
  arg?: { parent: PFNode; branch?: PFSingleBranch }
) => {
  let idx = 0;
  for (const id of flow) {
    if (!fn({ flow, idx, parent: arg?.parent, branch: arg?.branch })) {
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
          if (
            !loopPFNode(nodes, branch.flow, fn, visited, {
              parent: node,
              branch,
            })
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
