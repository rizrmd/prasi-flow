import { defineNode } from "../lib/define-node";

export const nodeCode = defineNode({
  type: "code",
  fields: {
    code: { type: "code" },
  },
  process: async () => {},
});
