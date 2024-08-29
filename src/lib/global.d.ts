import goober from "goober";
import { useLocal as useLocalHook } from "./use-local";
declare global {
  const css: typeof goober.css;
  const useLocal: typeof useLocalHook;
  const cx: (...arg: any[]) => string;
}
export {};
