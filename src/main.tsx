import { Baru } from "./baru";
import "./main.css";

export function Main() {
  return <>{location.pathname === "/halo" && <Baru />}</>;
}
