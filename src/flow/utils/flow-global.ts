import { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import { PFRunResult } from "../runtime/runner";
import { PF } from "../runtime/types";

export type PrasiFlowPropLocal = {
  selection: {
    nodes: Node[];
    edges: Edge[];
  };
};

const fg_default = {
  pf: null as null | PF,
  pointer_up_id: "",
  pointer_to: null as null | { x: number; y: number },
  // @ts-ignore
  reload: (relayout?: boolean) => {},
  main: null as null | {
    pf: null | PF;
    reactflow: null | ReactFlowInstance<Node, Edge>;
    render: () => void;
    action: {
      resetSelectedElements: () => void;
      addSelectedNodes: (arg: string[]) => void;
    };
  },
  run: null as null | PFRunResult,
  node_running: [] as string[],
  prop: null as
    | null
    | (PrasiFlowPropLocal & {
        render: () => void;
      }),
};
const w = window as unknown as {
  prasi_flow_global: typeof fg_default;
};
if (!w.prasi_flow_global) {
  w.prasi_flow_global = fg_default;
}

export const fg = w.prasi_flow_global;
