import { FC } from "react";
import { PFField, PFNode } from "../runtime/types";
import { fg } from "../utils/flow-global";
import TextareaAutosize from "react-textarea-autosize";
import { Tooltip } from "@/components/ui/tooltip";

export const PrasiFlowField: FC<{
  field: PFField;
  node: PFNode;
  name: string;
}> = ({ field, node, name }) => {
  const label = field.label || name;
  return (
    <div className="border-b flex text-xs">
      <Tooltip content={label} placement="left">
        <div
          className={cx(
            " px-1 flex items-center",
            css`
              width: 80px;
              overflow: hidden;
            `
          )}
        >
          {label}
        </div>
      </Tooltip>
      <TextareaAutosize
        className={cx("flex-1 outline-none p-1 border-l resize-none")}
        value={node[name] || ""}
        spellCheck={false}
        onChange={(e) => {
          const value = e.currentTarget.value;
          node[name] = value;
          fg.prop?.render();
        }}
      />
    </div>
  );
};
