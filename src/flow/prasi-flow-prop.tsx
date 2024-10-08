import { PFPropNode } from "./prop/pf-prop-node";
import { PFPropEdge } from "./prop/pf-prop.edge";
import { fg, PrasiFlowPropLocal } from "./utils/flow-global";

export const PrasiFlowProp = () => {
  const local = useLocal({
    selection: {
      nodes: [],
      edges: [],
      loading: false,
    },
  } as PrasiFlowPropLocal);
  fg.prop = local;

  const sel = local.selection;
  const rf_node = local.selection.nodes[0];
  const pf_node = rf_node ? fg.pf?.nodes[rf_node.id] : undefined;

  if (sel.loading) {
    sel.loading = false;
    return null;
  }
  return (
    <div className={cx("flex flex-col flex-1 w-full h-full ")}>
      {sel.nodes.length !== 1 && sel.edges.length !== 1 ? (
        <div
          className={cx(
            "flex items-center justify-center flex-1 flex-col space-y-1"
          )}
        >
          {sel.nodes.length === 0 && sel.edges.length === 0 ? (
            <>
              <div className="text-xs">Please Select Node</div>
              <div className="text-xs italic">&mdash; Or &mdash;</div>
              <div className="text-xs">Shift Drag to multi-select</div>
            </>
          ) : (
            <div
              className={cx(
                "p-2 border rounded-md",
                css`
                  width: 80%;
                `
              )}
            >
              <div className="text-xs">Selected:</div>
              <div className="text-xs">
                {sel.nodes.length} node{sel.nodes.length > 1 && "s"}
              </div>
              <div className="text-xs">
                {sel.edges.length} edge{sel.edges.length > 1 && "s"}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {sel.edges.length === 1 && (
            <>
              <PFPropEdge edge={sel.edges[0]} />
            </>
          )}
          {sel.nodes.length === 1 && (
            <>{pf_node && <PFPropNode node={pf_node} />}</>
          )}
        </>
      )}
    </div>
  );
};
