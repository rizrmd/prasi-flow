import { PrasiFlow } from "./flow/prasi-flow";

export const Main = () => {
  return (
    <div className={cx("fixed inset-0 w-screen h-screen")}>
      <PrasiFlow />
    </div>
  );
};
