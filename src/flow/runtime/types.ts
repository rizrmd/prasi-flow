export type PF = {
  name: string;
  path?: string;
  main_nodes: PFNode[]; // nodes yg nyambung ke start, dan start cuma 1
  spare_nodes: PFNode[][]; // nodes yg tidak nyambung ke main
  meta?: {
    // meta adalah informasi PF yg bukan bisnis proses
    start: { position: { x: number; y: number } };
  };
};

export type PFSingleBranch = { code?: string; name?: string; nodes: PFNode[] };

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
