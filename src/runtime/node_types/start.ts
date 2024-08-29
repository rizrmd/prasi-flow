import { defineNode } from "../lib/define-node";

export const startNode = defineNode({
  type: "start",
  input: {
    default: {
      mode: "record",
      default: {},
    },
  },
  output: {
    default: {
      mode: "record",
      default: {},
    },
  },
});
