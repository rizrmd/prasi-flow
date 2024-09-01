import { defineNode } from "../lib/define-node";

export const nodeDummy = defineNode({
  type: "dummy",
  process: ({ next }) => {
    next();
  },
});
