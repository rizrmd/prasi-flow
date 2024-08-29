import { defineNode } from "../lib/define-node";

export const codeNode = defineNode({
  type: "start",
  fields: {
    code: { type: "code" },
  },
  process: async () => {},
});
