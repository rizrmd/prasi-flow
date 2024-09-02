import { nodeCode } from "./nodes/code";
import { nodeCondition } from "./nodes/condition";
import { nodeStart } from "./nodes/start";

export const allNodeDefinitions = {
  start: nodeStart,
  code: nodeCode,
  condition: nodeCondition,
};
export type PRASI_NODE_DEFS = typeof allNodeDefinitions;
