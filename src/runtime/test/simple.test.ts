import { expect, test } from "bun:test";
import { runFlow } from "../runner";
import { start } from "../node/start";

test("simple run flow", async () => {
  const result = await runFlow({ name: "test", nodes: [start] });
  expect(result).toEqual({
    status: "ok",
  });
});
