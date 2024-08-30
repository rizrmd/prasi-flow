import { createNode } from "../lib/create-node";
import { PF } from "../types";

export const sampleFlow: () => PF = () => {
  return {
    name: "test",
    spare_nodes: [],
    main_nodes: [
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
                name: "Code A1",
                type: "code",
                code: `console.log('ini code A');`,
              }),
              createNode({
                name: "Code A2",
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
                name: "Code B1",
                type: "code",
                code: `console.log('ini code B');`,
              }),
              createNode({
                name: "Code B2",
                type: "condition",
                branches: [
                  {
                    name: "Branch C1",
                    code: "vars.result === 2",
                    nodes: [
                      createNode({
                        name: "Code C1",
                        type: "code",
                        code: `console.log('ini code A');`,
                      }),
                      createNode({
                        name: "Code C2",
                        type: "code",
                        code: `console.log('ini code A');`,
                      }),
                    ],
                  },
                  {
                    name: "Branch C2",
                    code: "vars.result === 2",
                    nodes: [
                      createNode({
                        name: "Code C3",
                        type: "code",
                        code: `console.log('ini code A');`,
                      }),
                      createNode({
                        name: "Code C4",
                        type: "code",
                        code: `console.log('ini code A');`,
                      }),
                    ],
                  },
                ],
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
      createNode({
        name: "Code D",
        type: "condition",
        branches: [
          {
            name: "Branch C1",
            code: "vars.result === 2",
            nodes: [
              createNode({
                name: "Code C1",
                type: "code",
                code: `console.log('ini code A');`,
              }),
              createNode({
                name: "Code C2",
                type: "code",
                code: `console.log('ini code A');`,
              }),
            ],
          },
          {
            name: "Branch C2",
            code: "vars.result === 2",
            nodes: [
              createNode({
                name: "Code C3",
                type: "code",
                code: `console.log('ini code A');`,
              }),
              createNode({
                name: "Code C4",
                type: "code",
                code: `console.log('ini code A');`,
              }),
            ],
          },
        ],
      }),
    ],
  };
};
