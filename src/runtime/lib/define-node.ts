import { PFNode } from "../types";

export const defineNode = <T extends PFNode>(arg: T) => {
  return arg;
};
