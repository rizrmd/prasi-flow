import { defineNode } from "../lib/define-node";

export const nodeStart = defineNode({
  type: "start",
  process: ({ next }) => {
    next();
  },
});
