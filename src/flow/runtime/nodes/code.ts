import { codeExec } from "../lib/code-exec";
import { defineNode } from "../lib/define-node";

export const nodeCode = defineNode({
  type: "code",
  fields: {
    source_code: { idx: 0, type: "code", label: "Code" },
  },
  process: ({ next, node, vars, console }) => {
    if (node.current.source_code) {
      codeExec({ code: node.current.source_code, node, vars, console });
    }
    next();
  },
});
