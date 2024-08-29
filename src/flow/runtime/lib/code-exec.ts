import { PFNodeRuntime } from "../types";

export const codeExec = (arg: {
  code: string;
  vars: Record<string, any>;
  node: PFNodeRuntime;
}) => {
  const fn = new Function("node", "vars", arg.code);
  return fn(arg.node, arg.vars);
};
