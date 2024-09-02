import { defineNode } from "../lib/define-node";
import { PFNodeType } from "@/flow/runtime/types.ts";

export const nodeStart = defineNode({
  type: PFNodeType.START,
  process: ({ next }) => {
    next();
  },
});
