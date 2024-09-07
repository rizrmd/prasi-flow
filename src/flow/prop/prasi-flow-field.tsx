import { Combobox } from "@/components/ui/combobox";
import { Tooltip } from "@/components/ui/tooltip";
import { ChevronDown, Trash2 } from "lucide-react";
import { FC, useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { PFField, PFNode } from "../runtime/types";
import { fg } from "../utils/flow-global";
import { savePF } from "../utils/save-pf";

export const PrasiFlowField: FC<{
  field: PFField;
  node: PFNode;
  name: string;
  value: any;
}> = ({ field, node, name, value }) => {
  const label = field.label || name;
  const ref = useRef<HTMLTextAreaElement>(null);

  const local = useLocal(
    {
      options: [] as {
        value: string;
        label: string;
        el?: React.ReactElement;
      }[],
    },
    async () => {
      local.options =
        field.type === "options" || field.type === "buttons"
          ? (await field.options()).map((e) => {
              if (typeof e === "string") return { value: e, label: e };
              return e;
            })
          : [];
      local.render();
    }
  );

  return (
    <>
      <div
        className={cx(
          "border-b flex text-xs",
          css`
            min-height: 24px;
          `,
          field.className
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
        {field.type === "options" && (
          <Combobox
            options={local.options}
            defaultValue={node[name]}
            onChange={(value) => {
              node[name] = value;
              fg.prop?.render();
            }}
            className={css`
              * {
                font-size: 13px !important;
              }
            `}
          >
            {({ setOpen }) => {
              const current_value = local.options[node[name]];
              return (
                <div className="flex flex-1 border-l items-stretch cursor-pointer hover:bg-blue-50">
                  <div className="flex-1 flex px-1 items-center">
                    {current_value?.el || current_value?.label}
                  </div>
                  <div className="flex w-[25px] items-center justify-center">
                    <ChevronDown size={12} />
                  </div>
                </div>
              );
            }}
          </Combobox>
        )}
        {field.type === "buttons" && (
          <div
            className={cx(
              "flex flex-wrap space-x-1 px-1 flex-1 border-l items-center"
            )}
          >
            {local.options.map((e, idx) => {
              let is_checked = false;

              if (field.multiple) {
                if (Array.isArray(value) && value.includes(e.value)) {
                  is_checked = true;
                }
              } else {
                if (e.value === value) is_checked = true;
              }

              return (
                <div
                  key={idx}
                  className={cx(
                    "border flex items-center justify-center  border-blue-500 px-2 rounded cursor-pointer  select-none",
                    is_checked ? "bg-blue-500 text-white" : "hover:bg-blue-50"
                  )}
                  onClick={() => {
                    if (field.multiple) {
                      if (!Array.isArray(node[name])) {
                        node[name] = [];
                      }
                      const idx = node[name].findIndex(
                        (val: any) => val === e.value
                      );
                      if (idx >= 0) {
                        node[name].splice(idx, 1);
                      } else {
                        node[name].push(e.value);
                      }
                    } else {
                      node[name] = e.value;
                    }
                    fg.prop?.render();
                  }}
                >
                  {e.el || e.label}
                </div>
              );
            })}
          </div>
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
                if (field.fields) {
                  for (const [k, v] of Object.entries(field.fields)) {
                    item[k] = "";
                  }
                  if (!Array.isArray(node[name])) {
                    node[name] = [];
                  }
                  node[name].push(item);

                  fg.prop?.render();
                  savePF(fg.pf);
                }
              }}
            >
              + Add
            </div>
          </div>
        )}
        {field.optional && node[name] && (
          <div
            className="del flex items-center justify-center w-[25px] border-l cursor-pointer hover:bg-red-100"
            onClick={() => {
              delete node[name];
              fg.prop?.render();
              savePF(fg.pf);
            }}
          >
            <Trash2 size={14} />
          </div>
        )}
      </div>

      {field.type === "array" && (
        <div className={cx("flex flex-col items-stretch", field.className)}>
          {Array.isArray(node[name]) &&
            node[name].map((data, idx) => {
              return (
                <div
                  key={idx}
                  className={cx(
                    "flex items-stretch array-item",
                    idx % 2 ? "even" : "odd"
                  )}
                >
                  {field.render ? (
                    field.render({
                      node,
                      save: () => {
                        fg.prop?.render();
                        savePF(fg.pf);
                      },
                    })
                  ) : (
                    <>
                      <div className="num select-none flex items-center justify-center w-[15px] border-r border-b bg-slate-100 text-[9px]">
                        {idx + 1}
                      </div>
                      <div className="flex flex-col flex-1 ">
                        {Object.entries(field.fields)
                          .sort((a, b) => a[1].idx - b[1].idx)
                          .map(([key, field]) => {
                            return (
                              <PrasiFlowField
                                key={key}
                                field={field}
                                name={key}
                                node={data}
                                value={data[key]}
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
                    </>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </>
  );
};
