import { createNode } from "../lib/create-node";
import { PF } from "../types";

export const sampleFlow = () => {
  const result = {
    name: "test",
    nodes: [
      createNode({
        type: "code",
        vars: {
          result: 2,
          message: "horeee",
        },
        code: `console.log('ini code');`,
      }),
      createNode({
        type: "condition",
        branch: {
          A: {
            code: "node.prev.vars.result === 2",
            idx: 0,
            node: createNode({
              type: "code",
              code: `console.log('ini code A');`,
            }),
          },
          B: {
            code: "node.prev.vars.result !== 2",
            idx: 1,
            node: createNode({
              type: "code",
              code: `console.log('ini code B');`,
            }),
          },
        },
      }),
    ],
  };
  return result as PF;
};
