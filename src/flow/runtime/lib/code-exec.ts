import { PFNodeRuntime } from "../types";

export const codeExec = (arg: {
  code: string;
  vars: Record<string, any>;
  node: PFNodeRuntime<any>;
  console: typeof console;
}) => {
  const fn = new Function("node", "vars", "console", arg.code);
  return fn(arg.node, arg.vars, arg.console);
};
