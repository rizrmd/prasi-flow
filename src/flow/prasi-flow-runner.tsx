import { Tooltip } from "@/components/ui/tooltip";
import JsonView from "@uiw/react-json-view";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { Play, Trash } from "lucide-react";
import { runFlow } from "./runtime/runner";
import { fg } from "./utils/flow-global";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const PrasiFlowRunner = () => {
  const local = useLocal({
    start: 0,
    status: "idle" as "idle" | "running",
    logref: null as null | HTMLDivElement,
    delay: Number(localStorage.getItem("prasi-flow-delay")) || 300,
    delay_timeout: null as any,
  });
  return (
    <div
      className={cx(
        "flex flex-col flex-1 w-full h-full",
        css`
          .btn {
            cursor: pointer;
            border: 1px solid #ddd;
            padding: 5px;
            border-radius: 3px;
            svg {
              width: 14px;
              height: 14px;
            }
            &:hover {
              background: #e0efff;
              border-color: #e0efff;
            }
          }
        `
      )}
    >
      <div className="border-b h-[40px] text-sm px-2 flex justify-between items-stretch space-x-1">
        <div className="flex items-center space-x-[5px]">
          <Tooltip content={"Run Flow"}>
            <div
              className={cx(
                "btn",
                local.status === "running" &&
                  css`
                    opacity: 0.3;
                  `
              )}
              onClick={async () => {
                if (local.status === "running") return;
                if (fg.pf) {
                  local.status = "running";
                  local.start = Date.now();
                  fg.run = null;
                  local.render();

                  fg.run = await runFlow(fg.pf, {
                    capture_console: true,
                    delay: local.delay,
                    before_node({ node }) {
                      fg.node_running.push(node.id);
                      fg.main?.render();
                    },
                    after_node({ visited, node }) {
                      fg.node_running = fg.node_running.filter(
                        (id) => id !== node.id
                      );
                      fg.run = { visited } as any;
                      local.render();
                      fg.main?.render();

                      setTimeout(() => {
                        const div = local.logref;
                        if (div) {
                          div.scrollTop = div.scrollHeight;
                        }
                      });
                    },
                  });
                  local.status = "idle";
                  local.render();
                  fg.main?.render();

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

          <Tooltip content={"Clear Log"}>
            <div
              className="btn"
              onClick={() => {
                fg.run = null;
                fg.node_running = [];
                fg.main?.render();
                local.render();
              }}
            >
              <Trash />
            </div>
          </Tooltip>

          <label className="border text-xs flex items-stretch rounded-sm">
            <div className="bg-slate-100 px-2 flex items-center rounded-l-sm">
              Delay
            </div>
            <input
              type="text"
              value={local.delay}
              className={cx(
                "px-1 outline-none",
                css`
                  padding-top: 5px;
                  padding-bottom: 4px;
                  width: 40px;
                `
              )}
              onChange={(e) => {
                const val = Number(e.currentTarget.value);
                if (!isNaN(val)) {
                  local.delay = val;
                  local.render();
                  clearTimeout(local.delay_timeout);
                  local.delay_timeout = setTimeout(() => {
                    localStorage.setItem("prasi-flow-delay", val + "");
                  }, 100);
                }
              }}
            />
            <div className="px-1 flex items-center"> ms</div>
          </label>
          {/* <Tooltip content={"Debug Flow - Step by Step"}>
            <div className="btn">
              <BugPlay />
            </div>
          </Tooltip> */}
        </div>
        <div className="flex items-center"></div>
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
              .node-type {
                font-size: 9px;
              }
            `
          )}
        >
          {!fg.run ? (
            <div className="text-slate-400 p-2">
              {local.status === "idle" ? "Flow Log..." : "🚀 Running Flow..."}
            </div>
          ) : (
            fg.run.visited?.map((e, idx) => {
              return (
                <div
                  key={idx}
                  className={cx(
                    "border-b font-mono flex flex-col items-stretch  hover:bg-blue-100",
                    e.error ? "bg-red-100" : "bg-slate-100"
                  )}
                  onClick={() => {
                    const rf_node = fg.prop?.selection.nodes[0];
                    if (rf_node?.id !== e.node.id) {
                      fg.main?.action.resetSelectedElements();
                      fg.main?.action.addSelectedNodes([e.node.id]);
                    }
                  }}
                >
                  <div
                    className={cx(
                      "cursor-pointer pl-2 py-1 select-none flex space-x-2 items-center"
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
                      {dayjs(
                        e.node.type === "start"
                          ? 0
                          : Math.max(0, e.tstamp - local.start)
                      ).format(`m[m] s[s] SSS[ms]`)}
                    </div>
                    <div className="flex items-center space-x-2 flex-1">
                      {e.error && (
                        <span className="bg-red-600 text-white px-2 mr-2">
                          ERROR
                        </span>
                      )}
                      <div
                        className={cx(
                          "uppercase node-type border border-slate-500 font-mono px-2 bg-white"
                        )}
                      >
                        {e.node.type}
                      </div>
                      <div className="flex-1">{e.node.type !== "start" ? e.node.name : ""}</div>
                      <div className={cx("text-slate-400 node-type pr-2")}>
                        {e.node.id}
                      </div>
                    </div>
                  </div>
                  {e.error && (
                    <div
                      className="ml-2 bg-white p-2"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {e.error.message}
                    </div>
                  )}
                  {e.log.length > 0 && (
                    <div
                      className="ml-2 bg-white p-2"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {e.log.map((line, idx) => (
                        <div key={idx} className={cx("flex space-x-1")}>
                          {line.map((e: any, idx: number) =>
                            typeof e === "object" ? (
                              <div key={idx}>
                                <JsonView value={e} collapsed />
                              </div>
                            ) : (
                              <div key={idx}>{e}</div>
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
          {fg.run?.visited && (
            <div
              className={cx(
                "select-none",
                css`
                  padding: 10px;
                  height: 50px;
                  color: ${local.status === "idle" ? "#ccc" : "#63a2ff"};
                  * {
                    font-size: 9px;
                  }
                `
              )}
            >
              {local.status === "idle" && <div>&mdash; END &mdash;</div>}
              {local.status === "running" && (
                <div className="flex items-center space-x-1">
                  <LoadingSpinner size={12} /> <div>Running...</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export const LoadingSpinner = ({
  size = 24,
  className,
  ...props
}: ISVGProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx("animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};
