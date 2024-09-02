import { Tooltip } from "@/components/ui/tooltip";
import { BugPlay, Play } from "lucide-react";
import { fg } from "./utils/flow-global";

export const PrasiFlowRunner = () => {
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
            <div className="btn">
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
        <div className="absolute inset-0 font-mono text-xs p-2">
          {fg.log.length === 0 ? (
            <div className="text-slate-400">Flow Log...</div>
          ) : (
            fg.log.map((_) => {
              return "";
            })
          )}
        </div>
      </div>
    </div>
  );
};
