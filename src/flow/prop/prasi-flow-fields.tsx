import { FC } from "react";
import { PFNode } from "../runtime/types";
import { getNodeFields } from "../utils/get-node-fields";

export const PrasiFlowFields: FC<{ node: PFNode }> = ({ node }) => {
  const field = getNodeFields(node);
  return (
    <>
      {Object.entries(field?.definition?.fields || {})
        .sort((a, b) => a[1].idx - b[1].idx)
        .map(([key, field]) => {
          return (
            <div key={field.idx}>
              {field.label} {node[key]}
            </div>
          );
        })}
    </>
  );
};
