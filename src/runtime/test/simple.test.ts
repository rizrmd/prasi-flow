import { expect, test } from "bun:test";
import { createNode } from "../lib/create-node";
import { runFlow } from "../runner";

test("simple run flow", async () => {
  const start = createNode("start", { coba: "haloa" });
  const result = await runFlow({
    name: "test",
    nodes: [start],
  });
  expect(result).toEqual({
    status: "ok",
  });
});
