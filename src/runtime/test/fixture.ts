import { createNode } from "../lib/create-node";
import { PF } from "../types";

export const sampleFlow = () => {
  const start = createNode({ type: "start" });
  const result = {
    name: "test",
    nodes: [start],
  };
  return result as PF;
};
