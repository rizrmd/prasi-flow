import { PrasiFlowFields } from "./prop/prasi-flow-fields";
import { fg, PrasiFlowPropLocal } from "./utils/flow-global";

export const PrasiFlowProp = () => {
  const local = useLocal({
    selection: {
      nodes: [],
      edges: [],
    },
  } as PrasiFlowPropLocal);
  fg.prop = local;

  const sel = local.selection;
  const rf_node = local.selection.nodes[0];
  const pf_node = rf_node ? fg.pf?.nodes[rf_node.id] : undefined;

  return (
    <div className={cx("c-flex c-flex-col")}>
      {sel.nodes.length !== 1 ? (
        <>
          <div>Node:{sel.nodes.length}</div>
          <div>Edge:{sel.edges.length}</div>
        </>
      ) : (
        <>{pf_node && <PrasiFlowFields node={pf_node} />}</>
      )}
    </div>
  );
};
