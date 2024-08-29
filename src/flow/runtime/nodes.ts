import { nodeCode } from "./nodes/code";
import { nodeCondition } from "./nodes/condition";

export const allNodeDefinitions = { code: nodeCode, condition: nodeCondition };
export type PRASI_NODE_DEFS = typeof allNodeDefinitions;
