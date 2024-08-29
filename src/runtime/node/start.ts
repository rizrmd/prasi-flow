import { defineNode } from "../lib/define-node";

export const start = defineNode({
  type: "start",
  input: {
    mode: "record",
  },
  output: {
    mode: "record",
  },
});
