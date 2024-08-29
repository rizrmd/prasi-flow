import { createNode } from "../lib/create-node";
import { PF } from "../types";

export const sampleFlow = () => {
  const result = {
    name: "test",
    nodes: [
      createNode({
        name: "start",
        type: "code",
        vars: {
          result: 2,
          message: "horeee",
        },
        code: `console.log('ini node',node.current.name );`,
      }),
      createNode({
        type: "condition",
        branches: [
          {
            name: "A",
            code: "vars.result === 2",
            node: createNode({
              type: "code",
              code: `console.log('ini code A');`,
            }),
          },
          {
            name: "B",
            code: "vars.result !== 2",
            node: createNode({
              type: "code",
              code: `console.log('ini code B');`,
            }),
          },
        ],
      }),
    ],
  };
  return result as PF;
};
