const w = window as any;
import { css, extractCss } from "goober";
import { useLocal } from "./use-local";

w.useLocal = useLocal;
w.css = css;
w.extractCss = extractCss;
w.cx = (...classNames: any[]) => {
  const result: string[] = [];

  classNames
    .filter((e) => {
      if (e) {
        if (typeof e === "string" && e.trim()) return true;
        else return true;
      }
      return false;
    })
    .forEach((e) => {
      if (Array.isArray(e)) {
        for (const f of e) {
          if (typeof f === "string" && f.trim()) {
            result.push(f.trim());
          }
        }
      } else result.push(e.trim());
    });
  return result.join(" ");
};
