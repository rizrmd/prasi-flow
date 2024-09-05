import { FC } from "react";
import { PFField, PFNode } from "../runtime/types";
import { fg } from "../utils/flow-global";
import { getNodeFields } from "../utils/get-node-fields";
import { savePF } from "../utils/save-pf";
import { PrasiFlowField } from "./prasi-flow-field";

export const PrasiFlowFields: FC<{ node: PFNode }> = ({ node }) => {
  const field = getNodeFields(node);

  return (
    <>
      <input
        type="text"
        spellCheck={false}
        value={node.name || ""}
        className={cx("px-4 pt-3 pb-2 text-lg outline-none border-b ")}
        onChange={(e) => {
          console.log(node);
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

      {/* <pre className={cx("text-[9px]")}>{JSON.stringify(node, null, 2)}</pre> */}
      {Object.entries(
        (field?.definition?.fields || {}) as Record<string, PFField>
      )
        .sort((a, b) => a[1].idx - b[1].idx)
        .map(([key, field]) => {
          return (
            <PrasiFlowField key={key} field={field} name={key} node={node} />
          );
        })}
    </>
  );
};
