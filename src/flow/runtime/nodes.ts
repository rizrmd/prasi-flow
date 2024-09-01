import { nodeCode } from "./nodes/code";
import { nodeCondition } from "./nodes/condition";
import { nodeDummy } from "./nodes/dummy";
import { nodeStart } from "./nodes/start";

export const allNodeDefinitions = {
  start: nodeStart,
  code: nodeCode,
  condition: nodeCondition,
  dummy: nodeDummy,
};
export type PRASI_NODE_DEFS = typeof allNodeDefinitions;
