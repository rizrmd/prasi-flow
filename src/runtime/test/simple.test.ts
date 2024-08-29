import { expect, test } from "bun:test";
import { sampleFlow } from "./fixture";
import { runFlow } from "../runner";

test("simple run flow", async () => {
  const result = await runFlow(sampleFlow());
  expect(result.status).toBe("ok");
  expect(result.list.length).toEqual(3);
  expect(result.vars).toEqual({
    result: 2,
    message: "horeee",
  });
});
