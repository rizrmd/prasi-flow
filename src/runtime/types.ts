export type PF = {
  name: string;
  path?: string;
  nodes: PFNode<any>[];
};

export type PFIO<D> = Record<
  string,
  {
    mode: "record" | "array" | "static-record";
    default: D;
  }
>;

export type PFNode<A> = {
  id: string;
  type: string;
  input: A;
};
export interface PFNodeDefinition extends Record<string, any> {
  type: string;
  input?: PFIO<any>;
  output?: PFIO<any>;
}
