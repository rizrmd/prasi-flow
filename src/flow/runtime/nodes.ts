import { nodeCode } from "./nodes/code";
import { nodeBranch } from "./nodes/branch";
import { nodeStart } from "./nodes/start";
import { nodeDbFindMany } from "./nodes/db.findmany";

export const allNodeDefinitions = {
  start: nodeStart,
  code: nodeCode,
  branch: nodeBranch,
  "db.findmany": nodeDbFindMany,
};
export type PRASI_NODE_DEFS = typeof allNodeDefinitions;
