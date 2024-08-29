import { createId } from "@paralleldrive/cuid2";
import { allNodeDefinitions, PRASI_NODE_DEFS } from "../nodes";

export const createNode = <
  T extends keyof PRASI_NODE_DEFS,
  K extends {
    [J in keyof Exclude<PRASI_NODE_DEFS[T]["input"], undefined>]: Exclude<
      PRASI_NODE_DEFS[T]["input"],
      undefined
    >[J]["default"];
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
