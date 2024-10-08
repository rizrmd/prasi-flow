import { PF } from "../runtime/types";

const save = { timeout: null as any };

// ini sementara save ke localStorage, nanti akan diganti save ke file di prasi
export const savePF = (pf: PF | null, opt?: { then?: () => void }) => {
  clearTimeout(save.timeout);
  save.timeout = setTimeout(() => {
    localStorage.setItem("pf-local", JSON.stringify(pf));
    if (opt?.then) opt.then();
  }, 200);
};
