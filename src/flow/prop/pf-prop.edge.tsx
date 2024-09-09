import { Edge } from "@xyflow/react";
import { FC } from "react";
import { fg } from "../utils/flow-global";
import { PFNodeBranch } from "../runtime/types";
import { savePF } from "../utils/save-pf";
import { Split } from "lucide-react";

export const PFPropEdge: FC<{ edge: Edge }> = ({ edge }) => {
  const pf = fg.pf!;
  const local = useLocal({ selected: null as null | PFNodeBranch });

  const node = pf.nodes[edge.source];
  if (!node) return <></>;

  return (
    <div className="flex flex-col text-xs">
      {node.branches && (
        <>
          <div className="flex items-center p-1 border-b px-1 space-x-1">
            <Split size={9} />
            <div>Change Branch:</div>
          </div>
          <div>
            {(node.branches || []).map((e, idx) => {
              const selected = e.flow.includes(edge.target);
              if (selected) local.selected = e;
              return (
                <div
                  key={idx}
                  className={cx(
                    "pl-4 py-1 select-none",
                    selected
                      ? "cursor-default bg-blue-500 text-white"
                      : "cursor-pointer hover:bg-blue-50"
                  )}
                  onClick={() => {
                    if (local.selected && local.selected !== e) {
                      const temp = local.selected.flow;
                      local.selected.flow = e.flow;
                      e.flow = temp;
                      if (fg.prop) fg.prop.selection.loading = true;
                      savePF(pf);
                      fg.reload(false);
                    }
                  }}
                >
                  {e.name}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
