import { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import { PF, PFNodeLog } from "../runtime/types";

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
  runner: {
    log: [] as PFNodeLog[],
  },
  main: null as null | {
    pf: null | PF;
    reactflow: null | ReactFlowInstance<Node, Edge>;
    render: () => void;
  },
  prop: null as null |  PrasiFlowPropLocal & {
    render: () => void;
  },
};
const w = window as unknown as {
  prasi_flow_global: typeof fg_default;
};
if (!w.prasi_flow_global) {
  w.prasi_flow_global = fg_default;
}

export const fg = w.prasi_flow_global;
