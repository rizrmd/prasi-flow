import {
  BaseEdge,
  EdgeComponentProps,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
} from "@xyflow/react";
import { fg } from "./utils/flow-global";

export const RenderEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  label,
  markerEnd,
}: EdgeComponentProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          className={cx(
            "nodrag nopan absolute",
            css`
              font-size: 11px;
              pointer-events: all;
              cursor: pointer;
              background: white;
              transform: translate(-50%, -50%)
                translate(${labelX}px, ${labelY}px);
              .plus {
                opacity: 0;
              }
              &:hover {
                .label {
                  opacity: 0;
                }
                .plus {
                  opacity: 1;
                }
              }
            `,
            !label &&
              css`
                .plus {
                  opacity: 0.4 !important;
                  transform: translate(-50%, -50%);
                  &:hover {
                    opacity: 1 !important;
                  }
                }
                .label {
                  display: none;
                }
              `
          )}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();

            // setEdges((edges) => edges.filter((edge) => edge.id !== id));
          }}
        >
          <div className={"label"}>{label}</div>
          <button
            className={cx(
              "plus absolute transition-all flex items-center justify-center",
              css`
                transform: translate(50%, -100%);
                width: 20px;
                height: 20px;
                background: #eee;
                border: 1px solid #fff;
                border-radius: 50%;
                font-size: 12px;
                line-height: 1;
              `
            )}
            dangerouslySetInnerHTML={{
              __html: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
            }}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
