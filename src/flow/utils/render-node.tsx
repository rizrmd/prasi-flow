import { Handle, Position, useConnection, useStore, Node } from "@xyflow/react";
import { MoveIcon } from "lucide-react";
import { fg } from "./flow-global";
import { Combobox } from "@/components/ui/combobox";
import { savePF } from "./save-pf";

export const RenderNode = (arg: {
  id: string;
  data: { label: string; type: string };
}) => {
  const { data, id } = arg;
  const connection = useConnection<Node>();
  const isTarget = connection.inProgress && connection.fromNode.id !== id;

  const selected = useStore((actions) => ({
    add: actions.addSelectedNodes,
    reset: actions.resetSelectedElements,
  }));

  if (connection.inProgress) {
    fg.pointer_to = connection.to;
  }

  const pf = fg.pf;
  const node = pf?.nodes[id];

  return (
    <div
      className={
        data.type === "start"
          ? undefined
          : cx(
              "p-1 relative border border-slate-800 rounded-sm pf-node",
              css`
                min-height: 60px;
                &:hover {
                  .move {
                    opacity: 1;
                  }
                }
              `,
              fg.node_running.length > 0 &&
                css`
                  .node-type {
                    color: black;
                  }
                `,

              fg.run?.visited?.find((e) => e.node.id === arg.id) &&
                css`
                  background: #f3ffef;
                  border: 1px solid #175203;
                `,
              fg.node_running.includes(arg.id) &&
                (fg.node_running[fg.node_running.length - 1] === id ||
                !fg.pf!.nodes[arg.id].branches
                  ? css`
                      color: white;
                      background: #419625;
                      border: 1px solid #419625;
                    `
                  : css`
                      background: #f8f5d5;
                      border: 1px solid #91860c;
                    `)
            )
      }
      onPointerDown={() => {
        selected.reset();
        selected.add([id]);
      }}
      onPointerUp={() => {
        if (connection.inProgress && connection.fromNode.id) {
          fg.pointer_up_id = id;
        }
      }}
    >
      {!connection.inProgress && (
        <Handle
          type="source"
          position={Position.Bottom}
          className={cx(
            css`
              position: absolute;
              width: 100%;
              height: 100%;
              transform: none;
              top: 0;
              left: 0;
              border-radius: 0;
              border: 0;
              background: none;
            `
          )}
        />
      )}
      {data.type === "start" ? (
        "Start"
      ) : (
        <div
          className={cx(
            "flex flex-1 mt-[22px] text-[14px] items-center flex-col"
          )}
        >
          {node?.name}
        </div>
      )}

      {(!connection.inProgress || isTarget) && data.type !== "start" && (
        <Handle type="target" position={Position.Top} />
      )}

      {data.type !== "start" && (
        <>
          <Combobox
            options={[
              { value: "code", label: "Code" },
              { value: "condition", label: "Condition" },
            ]}
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
                onClickCapture={(e) => {
                  e.stopPropagation();
                  setOpen(true);
                }}
                className={cx("absolute z-10 top-[6px] left-[6px]")}
              >
                <div
                  className={cx(
                    "border hover:bg-blue-500 hover:border-blue-500 hover:text-white px-1 py-0 uppercase border-slate-500 bg-white text-[11px] rounded-xs node-type"
                  )}
                >
                  {data.type}
                </div>
              </div>
            )}
          </Combobox>
          <div
            className={cx(
              "move transition-all opacity-20 p-2 absolute top-0 right-0"
            )}
          >
            <MoveIcon size={12} />
          </div>
        </>
      )}
    </div>
  );
};
