import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { PrasiFlow } from "./flow/prasi-flow";
import { PrasiFlowRunner } from "./flow/prasi-flow-runner";
import { PrasiFlowProp } from "./flow/prasi-flow-prop";

export const Main = () => {
  return (
    <div className={cx("fixed inset-0 w-screen h-screen")}>
      <PanelGroup direction="horizontal">
        <Panel>
          <PanelGroup direction="vertical">
            <Panel>
              <PrasiFlow />
            </Panel>

            <PanelResizeHandle className={"border-t"} />
            <Panel
              defaultSize={
                Number(localStorage.getItem("prasi-flow-panel-v")) || 25
              }
              onResize={(size) => {
                localStorage.setItem("prasi-flow-panel-v", size + "");
              }}
            >
              <PrasiFlowRunner />
            </Panel>
          </PanelGroup>
        </Panel>

        <PanelResizeHandle className={"border-l"} />
        <Panel
          defaultSize={Number(localStorage.getItem("prasi-flow-panel-h")) || 15}
          onResize={(size) => {
            localStorage.setItem("prasi-flow-panel-h", size + "");
          }}
        >
          <PrasiFlowProp />
        </Panel>
      </PanelGroup>
    </div>
  );
};
