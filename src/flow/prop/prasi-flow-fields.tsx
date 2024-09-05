import { FC } from "react";
import { PFField, PFNode } from "../runtime/types";
import { fg } from "../utils/flow-global";
import { getNodeFields } from "../utils/get-node-fields";
import { savePF } from "../utils/save-pf";
import { PrasiFlowField } from "./prasi-flow-field";

export const PrasiFlowFields: FC<{ node: PFNode }> = ({ node }) => {
  const field = getNodeFields(node);

  const def = field?.definition;
  if (!def) return null;
  return (
    <>
      <input
        type="text"
        spellCheck={false}
        value={node.name || ""}
        className={cx("px-1 pt-3 pb-2 text-lg outline-none border-b ")}
        onChange={(e) => {
          node.name = e.currentTarget.value;
          fg.main?.render();
        }}
        placeholder={"Node Name"}
        onBlur={() => {
          const pf = fg.pf;
          fg.reload();
          savePF(pf);
          fg.main?.render();
        }}
      />
      <div className="text-xs text-slate-400 p-1 border-b">ID: {node.id}</div>

      {Object.entries((def.fields || {}) as Record<string, PFField>)
        .sort((a, b) => a[1].idx - b[1].idx)
        .map(([key, item]) => {
          return (
            <PrasiFlowField key={key} field={item} name={key} node={node} />
          );
        })}
      {/* <pre className={cx("text-[9px]")}>{JSON.stringify(node, null, 2)}</pre> */}
    </>
  );
};
