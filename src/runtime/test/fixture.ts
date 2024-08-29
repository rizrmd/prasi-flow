import { createNode } from "../lib/create-node";
import { PF } from "../types";

export const sampleFlow = () => {
  const start = createNode({
    type: "code",
    code: `\
() => {
  console.log('ini code');
}`,
  });
  const end = createNode({
    type: "code",
    code: `\
() => {
  console.log('ini code');
}`,
  });

  const result = {
    name: "test",
    nodes: [
      start,
      createNode({
        type: "condition",
        branch: {
          A: createNode({
            type: "code",
            code: `console.log('ini code A');`,
          }),
          B: createNode({
            type: "code",
            code: `console.log('ini code B');`,
          }),
        },
      }),
      end,
    ],
  };
  return result as PF;
};
