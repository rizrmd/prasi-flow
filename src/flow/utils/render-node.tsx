import { Combobox } from "@/components/ui/combobox";
import { Handle, Node, Position, useConnection, useStore } from "@xyflow/react";
import capitalize from "lodash.capitalize";
import { Unplug } from "lucide-react";
import { Fragment, useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { allNodeDefinitions } from "../runtime/nodes";
import { PFNodeDefinition } from "../runtime/types";
import { fg } from "./flow-global";
import { savePF } from "./save-pf";
export const RenderNode = (arg: {
  id: string;
  data: { label: string; type: string };
}) => {
  const { data, id } = arg;
  const connection = useConnection<Node>();
  const isTarget = connection.inProgress && connection.fromNode.id !== id;
  const ref_name = useRef<HTMLTextAreaElement>(null);
  const ref_node = useRef<HTMLDivElement>(null);

  const selection = useStore((actions) => ({
    add: actions.addSelectedNodes,
    reset: actions.resetSelectedElements,
  }));

  useEffect(() => {
    setTimeout(() => {
      if (ref_name.current) ref_name.current.select();
    });
  }, [fg.prop?.selection.nodes.find((e) => e.id === id)]);

  if (connection.inProgress) {
    fg.pointer_to = connection.to;
  }

  const pf = fg.pf;
  const node = pf?.nodes[id];
  const def: PFNodeDefinition<any> = node
    ? (allNodeDefinitions as any)[node.type]
    : undefined;

  const left = data.type === "start" ? 38 : 74;
  return (
    <div
      ref={ref_node}
      className={cx(
        "border border-slate-600 rounded-sm relative",
        def?.className,
        css`
          .source-edge svg {
            opacity: 0;
          }
          &:hover {
            .source-edge svg {
              opacity: 1;
            }
          }
        `,
        fg.prop?.selection.nodes?.find((e) => e.id === id) &&
          css`
            border: 1px solid blue;
            outline: 1px solid blue;
          `,
        fg.node_running.length > 0 &&
          css`
            .node-type {
              color: black;
            }
          `,

        fg.node_running.includes(arg.id) &&
          (fg.node_running[fg.node_running.length - 1] === id ||
          !fg.pf!.nodes[arg.id].branches
            ? css`
                color: white;
                background: #419625 !important;
                border: 1px solid #419625;
              `
            : css`
                background: #f8f5d5 !important;
                border: 1px solid #91860c;
              `),

        fg.run?.visited?.find((e) => e.node.id === arg.id) &&
          css`
            background: #f3ffef;
            border: 1px solid #175203;
          `
      )}
      // onPointerDown={() => {
      //   selection.reset();
      //   selection.add([id]);
      // }}
      onPointerUp={() => {
        if (connection.inProgress && connection.fromNode.id) {
          fg.pointer_up_id = id;
        }
        ref_name.current?.select();
      }}
    >
      <Handle
        type="source"
        position={Position.Bottom}
        className={cx(
          "source-edge",
          css`
            border-radius: 0;
            border: 1px solid transparent;
            background: none;
            &:after {
              content: "";
              position: absolute;
              width: 25px;
              height: 25px;
              transform: none;
              top: -25px;
              left: ${left}px;
              border-radius: 3px;
              border: 1px dashed transparent;
            }

            &:hover {
              border: 1px solid black;
              background: black;

              &:after {
                border: 1px dashed black;
              }
            }
          `
        )}
      >
        <div
          className={cx(
            "flex items-center justify-center",
            css`
              position: absolute;
              transform: none;
              top: -25px;
              left: ${left}px;
              width: 25px;
              height: 25px;
              border: 1px solid transparent;
            `
          )}
        >
          <Unplug size={14} />
        </div>
      </Handle>
      <Handle
        type="target"
        position={Position.Top}
        className={cx("opacity-0")}
      />
      {node && def && (
        <div
          className={cx(
            "flex flex-col items-stretch",
            data.type !== "start" ? "min-w-[137px] " : "min-w-[65px] "
          )}
        >
          <div
            className={cx(
              "line-type flex items-center pl-2 ",
              !node.name && "justify-center pr-2",
              css`
                svg {
                  width: 14px;
                  height: 14px;
                }
              `
            )}
          >
            <Combobox
              options={Object.keys(allNodeDefinitions)
                .filter((e) => e !== "start")
                .map((e) => {
                  const def = (allNodeDefinitions as any)[
                    e
                  ] as PFNodeDefinition<any>;
                  return {
                    value: e,
                    label: e,
                    el: (
                      <>
                        <div
                          className={css`
                            svg {
                              width: 12px;
                              height: 12px;
                              margin-right: 5px;
                            }
                          `}
                          dangerouslySetInnerHTML={{ __html: def.icon }}
                        ></div>

                        {def.type.split(".").map((e, idx) => (
                          <div key={idx} className="flex space-x-1 ml-1">
                            {idx > 0 && <div> &bull; </div>}
                            <div
                              className={
                                e.length > 2 ? "capitalize" : "uppercase"
                              }
                            >
                              {e}
                            </div>
                          </div>
                        ))}
                      </>
                    ),
                  };
                })}
              defaultValue={data.type}
              onChange={(value) => {
                data.type = value;
                const pf = fg.pf;
                if (pf) {
                  const node = pf.nodes[id];
                  node.type = value;
                  fg.reload();

                  setTimeout(() => {
                    fg.reload();
                    savePF(pf);
                    setTimeout(() => {
                      selection.add([id]);
                    });
                  });
                }
              }}
              className={css`
                * {
                  font-size: 13px !important;
                }
              `}
            >
              {({ setOpen }) => (
                <div
                  className="flex items-center py-1 space-x-1"
                  onClickCapture={(e) => {
                    e.stopPropagation();
                    selection.add([id]);
                    setTimeout(() => {
                      setOpen(true);
                    }, 100);
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: def.icon }}></div>
                  <div className="flex space-x-1">
                    {def.type.split(".").map((e, idx) => (
                      <Fragment key={idx}>
                        {idx > 0 && <div> &bull; </div>}
                        <div
                          className={e.length > 2 ? "capitalize" : "uppercase"}
                        >
                          {e}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              )}
            </Combobox>
          </div>
          {node.name && data.type !== "start" && (
            <div
              className={cx(
                "flex items-center py-1 px-2 border-t border-t-slate-500"
              )}
            >
              <TextareaAutosize
                value={node.name}
                spellCheck={false}
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
                rows={1}
                ref={ref_name}
                onChange={(e) => {
                  if (node) {
                    const value = e.currentTarget.value;
                    node.name = value;
                    fg.main?.render();
                  }
                }}
                onKeyDown={(e) => {
                  if (
                    !e.currentTarget.value &&
                    (e.key === "Backspace" || e.key === "Delete")
                  ) {
                    delete fg.pf?.nodes[id];
                    savePF(fg.pf);
                    fg.reload();
                  }
                }}
                className={cx(
                  "flex flex-1 bg-transparent min-w-0 w-0 outline-none resize-none text-[15px] items-center flex-col"
                )}
              ></TextareaAutosize>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
