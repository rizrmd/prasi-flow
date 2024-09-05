import { PF, PFNode, PFNodeID, PFNodeBranch } from "../runtime/types";

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
    branch: undefined as void | PFNodeBranch,
  };
  for (const flow of Object.values(pf.flow)) {
    if (
      !loopPFNode(pf.nodes, flow, ({ flow, idx, parent, branch }) => {
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
      })
    ) {
      break;
    }
  }
  return result;
};

export const loopPFNode = (
  nodes: Record<string, PFNode>,
  flow: PFNodeID[],
  fn: (arg: {
    flow: PFNodeID[];
    idx: number;
    parent?: PFNode;
    branch?: PFNodeBranch;
    is_invalid: boolean;
  }) => boolean,
  visited = new Set<string>(),
  arg?: { parent: PFNode; branch?: PFNodeBranch }
) => {
  let idx = 0;
  for (const id of flow) {
    if (
      !fn({
        flow,
        idx,
        parent: arg?.parent,
        branch: arg?.branch,
        is_invalid: false,
      })
    ) {
      return false;
    }
    const node = nodes[id];
    if (!node) {
      fn({
        flow,
        idx,
        parent: arg?.parent,
        branch: arg?.branch,
        is_invalid: true,
      });
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
