import { nodeCode } from "./nodes/code";
import { nodeBranch } from "./nodes/branch";
import { nodeStart } from "./nodes/start";

export const allNodeDefinitions = {
  start: nodeStart,
  code: nodeCode,
  branch: nodeBranch,
};
export type PRASI_NODE_DEFS = typeof allNodeDefinitions;
