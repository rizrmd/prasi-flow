import { createIds, createManyNodes } from "../lib/create-node";
import { PF } from "../types";

export const sampleFlow: () => PF = () => {
  const [a, b, c, d, e, f, g, h, i, j] = createIds(10);

  const nodes = createManyNodes({
    [a]: { name: "a", type: "start" },
    [b]: { name: "b", type: "code", source_code: `console.log("code b")` },
    [c]: {
      name: "c",
      type: "condition",
      branches: [
        {
          name: "Branch 1",
          flow: [d, e],
        },
        {
          name: "Branch 2",
          flow: [g, h],
        },
      ],
    },
    [d]: { name: "d", type: "code", source_code: `console.log("code d")` },
    [e]: {
      name: "e",
      type: "condition",
      branches: [
        {
          name: "Branch 3",
          flow: [j],
        },
        {
          name: "Branch 4",
          flow: [h],
        },
      ],
    },
    [g]: { name: "g", type: "code", source_code: `console.log("code g")` },
    [h]: { name: "h", type: "code", source_code: `console.log("code h")` },
    [j]: { name: "j", type: "code", source_code: `console.log("code j")` },
  });

  return {
    name: "test",
    nodes: nodes,
    flow: {
      [a]: [a, b, c],
    },
  };
};
