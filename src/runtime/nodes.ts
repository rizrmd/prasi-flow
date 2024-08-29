import { nodeCode } from "./node_types/code";
import { nodeCondition } from "./node_types/condition";

export const allNodeDefinitions = { code: nodeCode, condition: nodeCondition };
export type PRASI_NODE_DEFS = typeof allNodeDefinitions;
