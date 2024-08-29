import { codeExec } from "../lib/code-exec";
import { defineNode } from "../lib/define-node";

export const nodeCode = defineNode({
  type: "code",
  fields: {
    code: { type: "code" },
  },
  process: ({ next, node, vars }) => {
    if (node.current.code) {
      codeExec({ code: node.current.code, node, vars });
    }
    next();
  },
});
