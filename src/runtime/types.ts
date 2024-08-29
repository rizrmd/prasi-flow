export type PF = {
  name: string;
  path?: string;
  nodes: PFNode[];
};

export type PFNode = {
  id: string;
  name?: string;
  type: string;
  branch: Record<string, PFNode>;
};

export interface PFNodeDefinition extends Record<string, any> {
  type: string;
  vars?: Record<string, any>;
  branch?: Record<string, { mandatory?: boolean }>;
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
}
