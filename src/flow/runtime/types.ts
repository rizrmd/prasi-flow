export type PFNodeID = string;

export type PFNodeBranch = { code?: string; name?: string; flow: PFNodeID[] };

export type PFNodePosition = { x: number; y: number };

export enum PFNodeType {
  START = "start",
  STRING = "string",
  CODE = "code",
  CONDITION = "condition",
  OPTIONS = "options",
}

export type PFNode = Record<string, any> & {
  id: string;
  name?: string;
  type: string;
  vars?: Record<string, any>;
  branches?: PFNodeBranch[];
  position?: PFNodePosition;
};

export type PFNodeLog = {
  nodeId: string;
  log: string;
};

export type PF = {
  name: string;
  path?: string;
  nodes: Record<PFNodeID, PFNode>;
  flow: Record<string, PFNodeID[]>;
};

export type PFNodeRuntime = {
  current: PFNode;
  prev?: PFNode;
  first: PFNode;
  visited: { node: PFNode; branch?: PFNodeBranch }[];
};

export type PFRuntime = {
  nodes: PFNode[];
};

export type PFNodeDefinition = Record<string, any> & {
  type: PFNodeType;
  vars?: Record<string, any>;
  branches?: PFNodeBranch[];
  process: (arg: {
    vars: Record<string, any>;
    node: PFNodeRuntime;
    nextBranch: (branch?: PFNodeBranch) => void;
    next: () => void;
  }) => void | Promise<void>;
  fields?: Record<string, PFField>;
};

export type PFField = (
  | { type: PFNodeType.STRING }
  | { type: PFNodeType.CODE }
  | {
      type: PFNodeType.OPTIONS;
      options: (string | { value: string; label: string })[];
    }
) & { idx: number; label: string };
