import { expect, test } from "bun:test";
import { sampleFlow } from "./fixture";
import { runFlow } from "../runner";

test("simple run flow", async () => {
  expect(await runFlow(sampleFlow())).toEqual({
    status: "ok",
  });
});
