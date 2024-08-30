import { PFNodeDefinition } from "../types";

export const defineNode = <T extends PFNodeDefinition>(node: T) => {
  return node;
};
