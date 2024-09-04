import { Tooltip } from "@/components/ui/tooltip";
import { BugPlay, Play } from "lucide-react";
import { PFRunResult, runFlow } from "./runtime/runner";
import { fg } from "./utils/flow-global";

export const PrasiFlowRunner = () => {
  const local = useLocal({
    result: null as null | PFRunResult,
  });
  return (
    <div
      className={cx(
        "flex flex-col flex-1 w-full h-full",
        css`
          .btn {
            cursor: pointer;
            border: 1px solid #ddd;
            padding: 4px;
            border-radius: 3px;
            svg {
              width: 12px;
              height: 12px;
            }
            &:hover {
              background: #e0efff;
              border-color: #e0efff;
            }
          }
        `
      )}
    >
      <div className="border-b min-h-8 text-sm px-2 flex justify-between items-stretch space-x-1">
        <div className="flex items-center space-x-1">
          <Tooltip content={"Run Flow"}>
            <div
              className="btn"
              onClick={async () => {
                if (fg.pf) {
                  local.result = await runFlow(fg.pf, {
                    capture_console: true,
                  });
                  local.render();
                }
              }}
            >
              <Play />
            </div>
          </Tooltip>
          <Tooltip content={"Debug Flow - Step by Step"}>
            <div className="btn">
              <BugPlay />
            </div>
          </Tooltip>
        </div>
        <div className="flex items-center"></div>
      </div>
      <div className="flex-1 relative overflow-auto">
        <div className="absolute inset-0 font-mono text-xs">
          {!local.result ? (
            <div className="text-slate-400 p-2">Flow Log...</div>
          ) : (
            local.result.visited
              ?.filter((e) => e.log?.length > 0)
              .map((e, idx) => {
                return (
                  <div
                    key={idx}
                    className={cx(
                      "border-b font-mono text-[9px] flex space-x-1 items-center hover:bg-blue-50"
                    )}
                  >
                    <div
                      className="border-r px-2 py-1 bg-slate-100 cursor-pointer select-none"
                      onClick={() => {
                        fg.main?.action.resetSelectedElements();
                        fg.main?.action.addSelectedNodes([e.node.id]);
                      }}
                    >
                      {e.node.type} {e.node.name}
                    </div>
                    <div className="flex-1">
                      {e.log.map((e) =>
                        typeof e === "object" ? JSON.stringify(e) : e
                      )}
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
};
