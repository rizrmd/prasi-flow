import { allNodeDefinitions } from "./nodes";
import { PF, PFNode, PFNodeDefinition, PFRuntime, PFNodeBranch } from "./types";

type RunFlowOpt = {
  vars?: Record<string, any>;
  capture_console: boolean;
  delay?: number;
  after_node?: (arg: { visited: PFRunVisited[]; node: PFNode }) => void;
  before_node?: (arg: { visited: PFRunVisited[]; node: PFNode }) => void;
};
export const runFlow = async (pf: PF, opt?: RunFlowOpt) => {
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
type PFRunVisited = {
  node: PFNode;
  parent_branch?: PFNodeBranch;
  log: any[];
  branching?: boolean;
  tstamp: number;
  error: any;
};

const flowRuntime = async (pf: PF, runtime: PFRuntime, opt?: RunFlowOpt) => {
  const visited: PFRunVisited[] = [];
  const vars = { ...opt?.vars };
  for (const current of runtime.nodes) {
    if (
      !(await runSingleNode({
        pf,
        current,
        visited,
        vars,
        opt,
      }))
    ) {
      break;
    }
  }
  return { visited, vars };
};

const runSingleNode = async (arg: {
  pf: PF;
  current: PFNode;
  branch?: PFNodeBranch;
  visited: PFRunVisited[];
  vars: Record<string, any>;
  opt?: RunFlowOpt;
}) => {
  const { pf, visited, vars, current, branch, opt } = arg;
  const { capture_console, after_node, before_node } = opt || {};
  const def = (allNodeDefinitions as any)[
    current.type
  ] as PFNodeDefinition<any>;

  if (before_node) {
    before_node({ visited: visited, node: current });
  }

  const run_visit: PFRunVisited = {
    node: current,
    parent_branch: branch,
    log: [] as any[],
    tstamp: 0,
    branching: false,
    error: null,
  };
  visited.push(run_visit);

  if (current.vars) {
    for (const [k, v] of Object.entries(current.vars)) {
      vars[k] = v;
    }
  }

  try {
    const execute_node = await new Promise<PFNodeBranch | void>(
      async (resolve, reject) => {
        if (current.branches) {
          run_visit.branching = true;

          if (after_node) {
            after_node({ visited: visited, node: current });
          }
        }

        try {
          await def.process({
            vars,
            node: {
              current,
              first: visited[0].node,
              prev: visited[visited.length - 1].node,
              visited,
            },
            processBranch: async (branch) => {
              run_visit.tstamp = Date.now();

              for (const id of branch.flow) {
                const current = pf.nodes[id];
                if (!current) break;
                if (
                  !(await runSingleNode({
                    pf,
                    current,
                    visited,
                    vars,
                    opt,
                  }))
                ) {
                  break;
                }
              }
            },
            next: resolve,
            console: capture_console
              ? {
                  ...console,
                  log(...args: any[]) {
                    run_visit.log.push(args);
                  },
                }
              : console,
          });
        } catch (e) {
          reject(e);
        }
      }
    );

    if (!run_visit.branching) {
      run_visit.tstamp = Date.now();
    }

    if (opt?.delay) {
      await new Promise((done) => {
        setTimeout(done, opt.delay);
      });
    }

    if (after_node) {
      after_node({ visited: visited, node: current });
    }

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
            opt,
          });
        }
      }
    }
    if (!run_visit.branching) return true;
    return false;
  } catch (e: any) {
    run_visit.tstamp = Date.now();
    if (e) {
      run_visit.error = e;
      console.error(e);
    }
    return false;
  }
};
