import { allNodeDefinitions } from "./nodes";
import { PF, PFNode, PFNodeDefinition, PFRuntime, PFNodeBranch } from "./types";

export const runFlow = async (
  pf: PF,
  opt?: { vars?: Record<string, any>; capture_console: boolean }
) => {
  const main_flow_id = Object.keys(pf.flow).find(
    (id) => pf.nodes[id].type === "start"
  );
  if (main_flow_id) {
    const runtime: PFRuntime = {
      nodes: pf.flow[main_flow_id].map((id) => pf.nodes[id]),
    };
    const result = await flowRuntime(pf, runtime, opt);
    return { status: "ok", visited: result.visited, vars: result.vars };
  }

  return { status: "error", reason: "Main Flow Not Found" };
};

export type PFRunResult = Awaited<ReturnType<typeof runFlow>>;

const flowRuntime = async (
  pf: PF,
  runtime: PFRuntime,
  opt?: { vars?: Record<string, any>; capture_console: boolean }
) => {
  const visited: { node: PFNode; branch?: PFNodeBranch; log: any[] }[] = [];
  const vars = { ...opt?.vars };
  for (const current of runtime.nodes) {
    await runSingleNode({
      pf,
      current,
      visited,
      vars,
      capture_console: opt?.capture_console,
    });
  }
  return { visited, vars };
};

const runSingleNode = async (opt: {
  pf: PF;
  current: PFNode;
  branch?: PFNodeBranch;
  visited: { node: PFNode; branch?: PFNodeBranch; log?: any[] }[];
  vars: Record<string, any>;
  capture_console?: boolean;
}) => {
  const { pf, visited, vars, current, branch, capture_console } = opt;
  const def = (allNodeDefinitions as any)[
    current.type
  ] as PFNodeDefinition<any>;
  const run_result = { node: current, branch, log: [] as any[] };
  visited.push(run_result);

  if (current.vars) {
    for (const [k, v] of Object.entries(current.vars)) {
      vars[k] = v;
    }
  }

  const execute_node = await new Promise<PFNodeBranch | void>(
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
        console: capture_console
          ? {
              ...console,
              log(...args: any[]) {
                run_result.log = args;
              },
            }
          : console,
      });
    }
  );

  if (execute_node) {
    for (const id of execute_node.flow) {
      const current = pf.nodes[id];
      if (current) {
        await runSingleNode({
          pf,
          current,
          branch: execute_node,
          visited,
          vars,
          capture_console,
        });
      }
    }
  }
};
