import { allNodeDefinitions } from "../runtime/nodes";
import { PFNodeDefinition } from "../runtime/types";

export const getNodeFields = (node: any) => {
  const data = {} as Record<string, any>;

  const def = (allNodeDefinitions as any)[node.type];

  if (def) {
    for (const key of Object.keys(def.fields || {})) {
      data[key] = node[key];
    }
    return { data, definition: def as PFNodeDefinition<any> };
  }
};
