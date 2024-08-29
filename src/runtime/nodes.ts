import { codeNode } from "./node_types/code";
import { startNode } from "./node_types/start";

export const allNodeDefinitions = { start: startNode, code: codeNode };
export type PRASI_NODE_DEFS = typeof allNodeDefinitions;
