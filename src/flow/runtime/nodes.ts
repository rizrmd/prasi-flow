import { nodeCode } from "./nodes/code";
import { nodeSplit } from "./nodes/split";
import { nodeStart } from "./nodes/start";

export const allNodeDefinitions = {
  start: nodeStart,
  code: nodeCode,
  split: nodeSplit,
};
export type PRASI_NODE_DEFS = typeof allNodeDefinitions;
