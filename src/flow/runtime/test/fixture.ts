import { createIds, createManyNodes } from "../lib/create-node";
import { PF } from "../types";

export const sampleFlow: () => PF = () => {
  const [a, b, c, d, e, f, g, h, i, j] = createIds(10);

  const nodes = createManyNodes({
    [a]: { name: "a", type: "start" },
    [b]: {
      name: "b",
      type: "code",
      source_code: `
for (let i = 0; i <4;i++){
  console.log("log b",
   { haloha: i }, 
  [{nama: 'rizky'}, 
  {name:'miki'}],
   [1,2,3,4])
}`,
    },
    [c]: {
      name: "c",
      type: "condition",
      conditions: [{ condition: "", name: "Branch 1" }],
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
    [d]: { name: "d", type: "code", source_code: `console.log("log d")` },
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
    [g]: { name: "g", type: "code", source_code: `console.log("log g")` },
    [h]: { name: "h", type: "code", source_code: `console.log("log h")` },
    [j]: { name: "j", type: "code", source_code: `console.log("log j")` },
  });

  return {
    name: "test",
    nodes: nodes,
    flow: {
      [a]: [a, b, c],
    },
  };
};
