import { FC } from "react";
import { PFNode } from "../runtime/types";
import { getNodeFields } from "../utils/get-node-fields";

export const PrasiFlowFields: FC<{ node: PFNode }> = ({ node }) => {
  const field = getNodeFields(node);
  return (
    <>
      {Object.values(field.definition?.fields || {})
        .sort((a, b) => a.idx - b.idx)
        .map((field) => {
          return <div key={field.idx}>{field.label}</div>;
        })}
    </>
  );
};
