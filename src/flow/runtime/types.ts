import { allNodeDefinitions } from "./nodes";

export type PFNodeID = string;

export type PFNodeBranch = {
  code?: string;
  name?: string;
  flow: PFNodeID[];
  idx?: number;
};

export type PFNodePosition = { x: number; y: number };

export type PFNodeType = keyof typeof allNodeDefinitions;

export type PFNode = Record<string, any> & {
  id: string;
  name?: string;
  type: string;
  vars?: Record<string, any>;
  branches?: PFNodeBranch[];
  position?: PFNodePosition;
  unused_branches?: PFNodeBranch[];
};

export type PF = {
  name: string;
  path?: string;
  nodes: Record<PFNodeID, PFNode>;
  flow: Record<string, PFNodeID[]>;
};

export type PFNodeRuntime<T extends Record<string, any>> = {
  current: PFNode & T;
  prev?: PFNode;
  first: PFNode;
  visited: { node: PFNode; branch?: PFNodeBranch }[];
};

export type PFRuntime = {
  nodes: PFNode[];
};

export type PFNodeDefinition<F extends Record<string, PFField>> = {
  type: string;
  className?: string;
  vars?: Record<string, any>;
  icon: string;
  branching?: (arg: {
    node: PFNode;
    flow: PFNodeID[];
    nodes: Record<string, PFNode>;
  }) => void;
  process: (arg: {
    vars: Record<string, any>;
    node: PFNodeRuntime<{ [K in keyof F]: F[K] }>;
    processBranch: (branch: PFNodeBranch) => Promise<void>;
    next: () => void;
    console: typeof console;
  }) => void | Promise<void>;
  fields?: F;
};

export type PFField = (
  | { type: "string" }
  | { type: "array"; fields: Record<string, PFField> }
  | { type: "code" }
  | {
      type: "options";
      options: (string | { value: string; label: string })[];
    }
) & { idx: number; label: string };
