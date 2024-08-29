import { codeExec } from "../lib/code-exec";
import { defineNode } from "../lib/define-node";

export const nodeCondition = defineNode({
  type: "condition",
  process: async ({ node, vars, nextBranch }) => {
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
