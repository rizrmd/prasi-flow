import { Tooltip } from "@/components/ui/tooltip";
import { BugPlay, Play, Trash } from "lucide-react";
import { PFRunResult, runFlow } from "./runtime/runner";
import { fg } from "./utils/flow-global";
import JsonView from "@uiw/react-json-view";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const PrasiFlowRunner = () => {
  const local = useLocal({
    start: 0,
    status: "idle" as "idle" | "running",
    result: null as null | PFRunResult,
    logref: null as null | HTMLDivElement,
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
                  local.status = "running";
                  local.start = Date.now();
                  local.result = null;
                  local.render();
                  
                  local.result = await runFlow(fg.pf, {
                    capture_console: true,
                  });
                  local.status = "idle";
                  local.render();

                  setTimeout(() => {
                    const div = local.logref;
                    if (div) {
                      div.scrollTop = div.scrollHeight;
                    }
                  });
                }
              }}
            >
              <Play />
            </div>
          </Tooltip>
          {/* <Tooltip content={"Debug Flow - Step by Step"}>
            <div className="btn">
              <BugPlay />
            </div>
          </Tooltip> */}
        </div>
        <div className="flex items-center">
          <Tooltip content={"Clear Log"}>
            <div
              className="btn"
              onClick={() => {
                local.result = null;
                local.render();
              }}
            >
              <Trash />
            </div>
          </Tooltip>
        </div>
      </div>
      <div
        className="flex-1 relative overflow-auto"
        ref={(el) => {
          local.logref = el;
        }}
      >
        <div
          className={cx(
            "absolute inset-0 font-mono",
            css`
              * {
                font-size: 12px;
              }
            `
          )}
        >
          {!local.result ? (
            <div className="text-slate-400 p-2">
              {local.status === "idle" ? "Flow Log..." : "🚀 Running Flow..."}
            </div>
          ) : (
            local.result.visited?.map((e, idx) => {
              return (
                <div
                  key={idx}
                  className={cx(
                    "border-b font-mono flex flex-col items-stretch bg-slate-100 hover:bg-blue-100"
                  )}
                  onClick={() => {
                    fg.main?.action.resetSelectedElements();
                    fg.main?.action.addSelectedNodes([e.node.id]);
                  }}
                >
                  <div className="pl-2">
                    <div
                      className={cx(
                        "cursor-pointer select-none flex space-x-2 items-center"
                      )}
                    >
                      <div
                        className={cx(
                          "text-blue-600 font-mono",
                          css`
                            font-size: 90%;
                          `
                        )}
                      >
                        {dayjs(Math.max(0, e.tstamp - local.start)).format(
                          `m[m] s[s] SSS[ms]`
                        )}
                      </div>
                      <div>
                        {e.node.type} {e.node.name}
                      </div>
                    </div>
                  </div>
                  {e.log.length > 0 && (
                    <div
                      className="ml-2 bg-white p-2"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {e.log.map((line, idx) => (
                        <div key={idx} className={cx("flex space-x-1")}>
                          {line.map((e: any) =>
                            typeof e === "object" ? (
                              <div>
                                <JsonView value={e} collapsed />
                              </div>
                            ) : (
                              <div>{e}</div>
                            )
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
