import { allNodeDefinitions } from "./nodes";
import {
  PF,
  PFNode,
  PFNodeDefinition,
  PFRuntime,
  PFNodeBranch,
} from "./types";

export const runFlow = async (pf: PF, vars?: Record<string, any>) => {
  const runtime: PFRuntime = { nodes: pf.main_flow.map((id) => pf.nodes[id]) };

  const result = await flowRuntime(pf, runtime, vars);
  return { status: "ok", visited: result.visited, vars: result.vars };
};

const flowRuntime = async (
  pf: PF,
  runtime: PFRuntime,
  defaultVars?: Record<string, any>
) => {
  const visited: { node: PFNode; branch?: PFNodeBranch }[] = [];
  const vars = { ...defaultVars };
  for (const current of runtime.nodes) {
    await runSingleNode({ pf, current, visited, vars });
  }
  return { visited, vars };
};

const runSingleNode = async (opt: {
  pf: PF;
  current: PFNode;
  branch?: PFNodeBranch;
  visited: { node: PFNode; branch?: PFNodeBranch }[];
  vars: Record<string, any>;
}) => {
  const { pf, visited, vars, current, branch } = opt;
  const def = (allNodeDefinitions as any)[current.type] as PFNodeDefinition;
  visited.push({ node: current, branch });
  if (current.vars) {
    for (const [k, v] of Object.entries(current.vars)) {
      vars[k] = v;
    }
  }

  const next_branch = await new Promise<PFNodeBranch | void>(
    async (resolve) => {
      def.process({
        vars,
        node: {
          current,
          first: visited[0].node,
          prev: visited[visited.length - 1].node,
          visited,
        },
        nextBranch: resolve,
        next: resolve,
      });
    }
  );

  if (next_branch) {
    for (const id of next_branch.flow) {
      const current = pf.nodes[id];
      if (current) {
        await runSingleNode({
          pf,
          current,
          branch: next_branch,
          visited,
          vars,
        });
      }
    }
  }
};
