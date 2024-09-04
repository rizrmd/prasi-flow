import { Handle, Position, useConnection, useStore, Node } from "@xyflow/react";
import { MoveIcon } from "lucide-react";
import { fg } from "./flow-global";

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

  return (
    <div
      className={cx(
        data.type !== "start" &&
          "p-2 relative border border-slate-800 rounded-sm pf-node",
        css`
          &:hover {
            .move {
              opacity: 1;
            }
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
      )}
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
      {data.label}
      {(!connection.inProgress || isTarget) && data.type !== "start" && (
        <Handle type="target" position={Position.Top} />
      )}

      {data.type !== "start" && (
        <div
          className={cx(
            "move transition-all opacity-20 p-2 absolute top-0 right-0"
          )}
        >
          <MoveIcon size={12} />
        </div>
      )}
    </div>
  );
};
