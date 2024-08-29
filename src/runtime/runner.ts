import { allNodeDefinitions } from "./nodes";
import {
  PF,
  PFNode,
  PFNodeDefinition,
  PFRuntime,
  PFSingleBranch,
} from "./types";

export const runFlow = async (flow: PF, vars?: Record<string, any>) => {
  const runtime: PFRuntime = { nodes: flow.nodes };

  const result = await flowRuntime(runtime, vars);
  return { status: "ok", list: result.list, vars: result.vars };
};

const flowRuntime = async (
  runtime: PFRuntime,
  defaultVars?: Record<string, any>
) => {
  const list: { node: PFNode; branch?: PFSingleBranch }[] = [];
  const vars = { ...defaultVars };
  for (const current of runtime.nodes) {
    await runSingleNode({ current, list, vars });
  }
  return { list, vars };
};

const runSingleNode = async (opt: {
  current: PFNode;
  branch?: PFSingleBranch;
  list: { node: PFNode; branch?: PFSingleBranch }[];
  vars: Record<string, any>;
}) => {
  const { list, vars, current, branch } = opt;
  const def = (allNodeDefinitions as any)[current.type] as PFNodeDefinition;
  list.push({ node: current, branch });
  if (current.vars) {
    for (const [k, v] of Object.entries(current.vars)) {
      vars[k] = v;
    }
  }

  const next_branch = await new Promise<PFSingleBranch | void>(
    async (resolve) => {
      def.process({
        vars,
        node: {
          current,
          first: list[0].node,
          prev: list[list.length - 1].node,
          list,
        },
        nextBranch: resolve,
        next: resolve,
      });
    }
  );

  if (next_branch) {
    await runSingleNode({
      current: next_branch.node,
      branch: next_branch,
      list,
      vars,
    });
  }
};
