export type PF = {
  name: string;
  path?: string;
  nodes: PFNode[];
};

export type PFIO = {
  mode: "record" | "array" | "static-record";
  typings?: string;
  default?: any;
};

export interface PFNode extends Record<string, any> {
  type: string;
  input?: PFIO;
  output?: PFIO;
}
