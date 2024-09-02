import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { PrasiFlow } from "./flow/prasi-flow";

export const Main = () => {
  return (
    <div className={cx("fixed inset-0 w-screen h-screen")}>
      <PanelGroup direction="vertical">
        <Panel>
          <PrasiFlow />
        </Panel>
        <PanelResizeHandle className={"border-t"} />
        <Panel defaultSize={25}></Panel>
      </PanelGroup>
      ;
    </div>
  );
};
