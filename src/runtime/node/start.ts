import { defineNode } from "../lib/define-node";

export const startNode = defineNode({
  type: "start",
  input: {
    mode: "record",
    default: {},
  },
  output: {
    mode: "record",
    default: {},
  },
});
