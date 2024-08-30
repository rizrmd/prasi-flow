import { createNode } from "../lib/create-node";
import { PF } from "../types";

export const sampleFlow = () => {
  const result = {
    name: "test",
    spare_nodes: [],
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
        name: "if",
        type: "condition",
        branches: [
          {
            name: "Branch A",
            code: "vars.result === 2",
            nodes: [
              createNode({
                name: "Code A",
                type: "code",
                code: `console.log('ini code A');`,
              }),
            ],
          },
          {
            name: "Branch B",
            code: "vars.result !== 2",
            nodes: [
              createNode({
                name: "Code B",
                type: "code",
                code: `console.log('ini code B');`,
              }),
            ],
          },
          // {
          //   name: "Branch C",
          //   code: "vars.result === 2",
          //   nodes: [
          //     createNode({
          //       name: "Code C",
          //       type: "code",
          //       code: `console.log('ini code C');`,
          //     }),
          //   ],
          // },
        ],
      }),
    ],
  };
  return result as PF;
};
