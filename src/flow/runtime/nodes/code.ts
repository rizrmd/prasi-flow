import { codeExec } from "../lib/code-exec";
import { defineNode } from "../lib/define-node";
import { PFNodeType } from "@/flow/runtime/types.ts";

export const nodeCode = defineNode({
  type: PFNodeType.CODE,
  fields: {
    code: { type: PFNodeType.CODE },
  },
  process: ({ next, node, vars }) => {
    if (node.current.code) {
      codeExec({ code: node.current.code, node, vars });
    }
    next();
  },
});
