export type PFNodeID = string;

export type PF = {
  name: string;
  path?: string;
  nodes: Record<PFNodeID, PFNode>;
  main_flow: PFNodeID[];
  spare_flow: Record<string, PFNodeID[]>;
};

export type PFSingleBranch = { code?: string; name?: string; flow: PFNodeID[] };

export interface PFNode extends Record<string, any> {
  id: string;
  name?: string;
  type: string;
  vars?: Record<string, any>;
  branches?: PFSingleBranch[];
  position?: { x: number; y: number };
}

export type PFNodeDefinition = Record<string, any> & {
  type: string;
  vars?: Record<string, any>;
  branches?: PFSingleBranch[];
  process: (arg: {
    vars: Record<string, any>;
    node: PFNodeRuntime;
    nextBranch: (branch?: PFSingleBranch) => void;
    next: () => void;
  }) => void | Promise<void>;
  fields?: Record<
    string,
    | {
        type: "string";
      }
    | { type: "code" }
    | {
        type: "options";
        options: (string | { value: string; label: string })[];
      }
  >;
};

export interface PFNodeRuntime {
  current: PFNode;
  prev?: PFNode;
  first: PFNode;
  visited: { node: PFNode; branch?: PFSingleBranch }[];
}

export type PFRuntime = {
  nodes: PFNode[];
};
