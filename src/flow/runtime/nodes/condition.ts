import { codeExec } from "../lib/code-exec";
import { defineNode } from "../lib/define-node";

export const nodeCondition = defineNode({
  type: "condition",
  branching({ node }) {
    if (!node.branches) {
      node.branches = [];
    }
    if (node.branches) {
      let i = 0;
      for (const branch of node.branches) {
        if (typeof branch.idx === "undefined") {
          branch.idx = i;
        }
        i++;
      }
    }
  },
  fields: {
    conditions: {
      label: "Conditions",
      type: "array",
      fields: { condition: { type: "code" }, name: { type: "string" } },
    },
  },
  process: async ({ node, vars, processBranch, next }) => {
    const branches = [];
    if (node.current.branches) {
      for (const branch of node.current.branches) {
        if (branch.code) {
          const result = codeExec({
            code: `return ${branch.code}`,
            node,
            vars,
            console,
          });
          if (result) {
            branches.push(processBranch(branch));
            break;
          }
        } else {
          branches.push(processBranch(branch));
        }
      }
    }
    await Promise.all(branches);
    next();
  },
});
