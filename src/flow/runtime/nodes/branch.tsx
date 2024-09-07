import { codeExec } from "../lib/code-exec";
import { defineNode } from "../lib/define-node";

export const nodeBranch = defineNode({
  type: "branch",
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
      className: css`
        .array-item {
          border-bottom: 4px solid #e2e8f0;
        }
      `,
      fields: {
        condition: { type: "code", idx: 1 },
        name: { idx: 0, type: "string" },
      },
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
  icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-split"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/><path d="m15 9 6-6"/></svg>`,
});
