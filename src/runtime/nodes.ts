import { startNode } from "./node/start";

export const allNodeDefinitions = { start: startNode };
export type PRASI_NODE_DEFS = typeof allNodeDefinitions;
