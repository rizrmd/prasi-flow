import { defineNode } from "../lib/define-node";

export const nodeCondition = defineNode({
  type: "condition",
  fields: {
    code: { type: "code" },
  },
  process: async () => {},
});
