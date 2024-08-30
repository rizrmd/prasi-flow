import { createIds, createManyNodes } from "../lib/create-node";
import { PF } from "../types";

export const sampleFlow: () => PF = () => {
  const [a, b, c, d, e, f, g, h, i, j] = createIds(10);

  const nodes = createManyNodes({
    [a]: { name: "a", type: "start" },
    [b]: { name: "b", type: "code", code: "code b" },
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
    [d]: { name: "d", type: "code", code: "code d" },
    [e]: { name: "e", type: "code", code: "code e" },
    [f]: { name: "f", type: "code", code: "code f" },
    [g]: { name: "g", type: "code", code: "code g" },
    [h]: { name: "h", type: "code", code: "code h" },
    [i]: { name: "i", type: "code", code: "code i" },
  });

  return {
    name: "test",
    nodes: nodes,
    main_flow: [a, b, c, i],
    spare_flow: {},
  };
};
