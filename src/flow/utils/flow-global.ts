const fg_default = {
  pointer_up_id: "",
};
const w = window as unknown as {
  prasi_flow_global: typeof fg_default;
};
if (!w.prasi_flow_global) {
  w.prasi_flow_global = fg_default;
}

export const fg = w.prasi_flow_global;
