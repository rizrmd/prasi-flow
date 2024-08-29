import { createId } from "@paralleldrive/cuid2";
import { allNodeDefinitions, PRASI_NODE_DEFS } from "../nodes";
import { PFNode } from "../types";

export const createNode = <T extends keyof PRASI_NODE_DEFS>(
  //@ts-ignore
  create: { [K in keyof PRASI_NODE_DEFS[T]["fields"]]: any } & {
    name?: string;
    type: T;
    vars?: Record<string, any>;
    branch?: Record<string, { code?: string; idx: number; node: PFNode }>;
  }
) => {
  const definition = allNodeDefinitions[create.type];
  return {
    id: createId(),
    type: definition.type,
  };
};
