import { allNodeDefinitions } from "../runtime/nodes";
import { PFNode, PFNodeDefinition } from "../runtime/types";

export const getNodeFields = (node: PFNode) => {
  const data = {} as Record<string, any>;

  const def = (allNodeDefinitions as any)[node.type];

  for (const key of Object.keys(def.fields)) {
    data[key] = node[key];
  }
  return { data, definition: def as PFNodeDefinition };
};
