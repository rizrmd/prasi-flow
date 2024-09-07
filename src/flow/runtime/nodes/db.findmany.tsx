import { defineNode } from "../lib/define-node";
import { PFNode } from "../types";

export const nodeDbFindMany = defineNode({
  type: "db.findmany",
  process: ({ next }) => {
    next();
  },
  fields: {
    table: {
      type: "buttons",
      optional: true,
      multiple: true,
      options: async () => {
        return [
          { value: "a", label: "a" },
          { value: "b", label: "b" },
        ];
      },
    },
    select: {
      type: "array",
      add: {},
      optional: true,
      render: ({ node }: { node: PFNode }) => {
        return <div>Hello</div>;
      },
      fields: {
        column: { type: "string" },
      },
    },
  },
  icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mouse-pointer-2"><path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"/></svg>`,
});
