import { createId } from "@paralleldrive/cuid2";
import { allNodeDefinitions, PRASI_NODE_DEFS } from "../nodes";

export const createNode = <
  T extends keyof PRASI_NODE_DEFS,
  K extends {
    //@ts-ignore
    [J in keyof PRASI_NODE_DEFS[T]["input"]]: PRASI_NODE_DEFS[T]["input"][J]["default"];
  }
>(
  type: T,
  input: K
) => {
  const definition = allNodeDefinitions[type];
  return {
    id: createId(),
    type: definition.type,
    input,
  };
};
