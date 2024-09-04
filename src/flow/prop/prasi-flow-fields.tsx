import { FC } from "react";
import { PFField, PFNode } from "../runtime/types";
import { getNodeFields } from "../utils/get-node-fields";

export const PrasiFlowFields: FC<{ node: PFNode }> = ({ node }) => {
  const field = getNodeFields(node);
  return (
    <>
      {Object.entries(
        (field?.definition?.fields || {}) as Record<string, PFField>
      )
        .sort((a, b) => a[1].idx - b[1].idx)
        .map(([key, field]) => {
          return (
            <div
              key={field.idx}
              className="text-xs font-mono whitespace-pre-wrap"
            >
              {field.label} {node[key]}
            </div>
          );
        })}
    </>
  );
};
