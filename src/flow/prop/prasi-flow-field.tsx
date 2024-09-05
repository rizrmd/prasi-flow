import { Tooltip } from "@/components/ui/tooltip";
import { Trash2 } from "lucide-react";
import { FC, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { PFField, PFNode } from "../runtime/types";
import { fg } from "../utils/flow-global";
import { savePF } from "../utils/save-pf";

export const PrasiFlowField: FC<{
  field: PFField;
  node: PFNode;
  name: string;
}> = ({ field, node, name }) => {
  const label = field.label || name;
  const ref = useRef<HTMLTextAreaElement>(null);
  return (
    <>
      <div
        className={cx(
          "border-b flex text-xs",
          css`
            min-height: 24px;
          `
        )}
      >
        <Tooltip content={label} placement="left">
          <div
            className={cx(
              " px-1 flex items-center",
              css`
                width: 80px;
                overflow: hidden;
              `
            )}
            onClick={() => {
              ref.current?.focus();
            }}
          >
            {label}
          </div>
        </Tooltip>
        {field.type === "string" && (
          <TextareaAutosize
            ref={ref}
            className={cx(
              "flex-1 outline-none p-1 border-l resize-none min-w-0 w-full bg-transparent"
            )}
            value={node[name] || ""}
            spellCheck={false}
            onChange={(e) => {
              const value = e.currentTarget.value;
              node[name] = value;
              fg.prop?.render();
            }}
          />
        )}
        {field.type === "code" && (
          <div className="flex-1 border-l justify-center items-center flex">
            <div
              className={cx(
                "border px-2 text-[11px] mx-[2px] cursor-pointer hover:bg-blue-600 hover:border-blue-600 hover:text-white"
              )}
              onClick={() => {}}
            >
              Edit Code
            </div>
          </div>
        )}

        {field.type === "array" && (
          <div className="flex-1 justify-end items-center flex">
            <div
              className={cx(
                "border px-2 text-[11px] mr-[2px] cursor-pointer hover:bg-blue-600 hover:border-blue-600 hover:text-white"
              )}
              onClick={() => {
                const item = {} as any;
                for (const [k, v] of Object.entries(field.fields)) {
                  item[k] = "";
                }
                if (!Array.isArray(node[name])) {
                  node[name] = [];
                }
                node[name].push(item);

                fg.prop?.render();
                savePF(fg.pf);
              }}
            >
              + Add
            </div>
          </div>
        )}
      </div>
      {field.type === "array" && (
        <div className={cx("flex flex-col items-stretch")}>
          {Array.isArray(node[name]) &&
            node[name].map((data, idx) => {
              return (
                <div
                  key={idx}
                  className={cx(
                    "flex items-stretch border-b-4",
                    idx > 0 && "border-t",
                    idx % 2 ? "even" : "odd"
                  )}
                >
                  <div className="num select-none flex items-center justify-center w-[15px] border-r border-b bg-slate-100 text-[9px]">
                    {idx + 1}
                  </div>
                  <div className="flex flex-col ">
                    {Object.entries(field.fields)
                      .sort((a, b) => a[1].idx - b[1].idx)
                      .map(([key, field]) => {
                        return (
                          <PrasiFlowField
                            key={key}
                            field={field}
                            name={key}
                            node={data}
                          />
                        );
                      })}
                  </div>
                  <div
                    className="del flex items-center justify-center w-[25px] border-l border-b cursor-pointer hover:bg-red-100"
                    onClick={() => {
                      node[name].splice(idx, 1);
                      fg.prop?.render();
                      savePF(fg.pf);
                    }}
                  >
                    <Trash2 size={14} />
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
};
