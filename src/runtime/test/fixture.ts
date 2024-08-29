import { createNode } from "../lib/create-node";
import { PF } from "../types";

export const sampleFlow = () => {
  const start = createNode({ type: "start" });
  const code = createNode({
    type: "code",
    code: `\
() => {
  console.log('ini code');
}`,
  });

  const result = {
    name: "test",
    nodes: [start, code],
  };
  return result as PF;
};
