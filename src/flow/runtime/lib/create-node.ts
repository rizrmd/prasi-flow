import { createId } from "@paralleldrive/cuid2";
import { allNodeDefinitions, PRASI_NODE_DEFS } from "../nodes";
import { PFNode, PFNodeID, PFSingleBranch } from "../types";

type NODE_TYPES = keyof PRASI_NODE_DEFS;

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

export const createManyNodes = (
  nodes: Record<
    string,
    {
      name?: string;
      type: NODE_TYPES;
      vars?: Record<string, any>;
      branches?: PFSingleBranch[];
    } & Record<string, any>
  >
) => {
  const result = {} as Record<PFNodeID, PFNode>;
  for (const [k, create] of Object.entries(nodes)) {
    result[k] = {
      id: k,
      type: create.type,
      vars: structuredClone(create.vars),
      branches: structuredClone(create.branches),
    };

    const node = result[k];
    for (const [k, v] of Object.entries(create)) {
      if ((node as any)[k] === undefined) (node as any)[k] = v;
    }
  }
  return result;
};

export const createIds = (total: number) => {
  const result: string[] = [];
  for (let i = 0; i < total; i++) {
    result.push(createId());
  }

  return result;
};
