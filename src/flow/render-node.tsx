import { Handle, Position, useConnection, useStore, Node } from "@xyflow/react";
import { MoveIcon } from "lucide-react";
import { fg } from "./utils/flow-global";

export const RenderNode = (arg: { id: string; data: { label: string } }) => {
  const { data, id } = arg;
  const connection = useConnection<Node>();
  const isTarget = connection.inProgress && connection.fromNode.id !== id;

  const selected = useStore((actions) => ({
    add: actions.addSelectedNodes,
    reset: actions.resetSelectedElements,
  }));

  return (
    <div
      className={cx(
        "p-2 relative",
        css`
          &:hover {
            .move {
              opacity: 1;
            }
          }
        `
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
      {(!connection.inProgress || isTarget) && (
        <Handle type="target" position={Position.Top} />
      )}

      <div
        className={cx(
          "move transition-all opacity-20 p-2 absolute top-0 right-0"
        )}
      >
        <MoveIcon size={12} />
      </div>
    </div>
  );
};
