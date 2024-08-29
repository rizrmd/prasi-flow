import { createId } from "@paralleldrive/cuid2";
import { allNodeDefinitions, PRASI_NODE_DEFS } from "../nodes";
import { PFSingleBranch } from "../types";

export const createNode = <T extends keyof PRASI_NODE_DEFS>(
  //@ts-ignore
  create: { [K in keyof PRASI_NODE_DEFS[T]["fields"]]: any } & {
    name?: string;
    type: T;
    vars?: Record<string, any>;
    branches?: PFSingleBranch[];
  }
) => {
  const definition = allNodeDefinitions[create.type];
  const node = {
    id: createId(),
    type: definition.type,
    vars: structuredClone(create.vars),
    branches: structuredClone(create.branches),
  };
  for (const [k, v] of Object.entries(create)) {
    if ((node as any)[k] === undefined) (node as any)[k] = v;
  }

  return node;
};
