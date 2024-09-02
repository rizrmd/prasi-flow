import { codeExec } from "../lib/code-exec";
import { defineNode } from "../lib/define-node";
import { PFNodeType } from "@/flow/runtime/types.ts";

export const nodeCondition = defineNode({
  type: PFNodeType.CONDITION,
  process: async ({node, vars, nextBranch}) => {
    if (node.current.branches) {
      for (const branch of node.current.branches) {
        const result = codeExec({
          code: `return ${branch.code}`,
          node,
          vars,
        });
        if (result) {
          nextBranch(branch);
          break;
        }
      }
    }
  },
});
