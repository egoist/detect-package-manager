import { test } from "uvu";
import * as assert from "uvu/assert";
import { detect } from "./src";

test("in this repo", async () => {
  const pm = await detect();
  assert.is(pm, "pnpm");
});

test("in fixture which is using package-lock.json", async () => {
  const pm = await detect({ cwd: "fixtures/package-lock" });
  assert.is(pm, "npm");
});

test("in fixture which is using pnpm-lock.yaml", async () => {
  const pm = await detect({ cwd: "fixtures/pnpm-lock" });
  assert.is(pm, "pnpm");
});

test("in fixture which is using bun lockfile", async () => {
  const pm = await detect({ cwd: "fixtures/bun-lock" });
  assert.is(pm, "bun");
});

test("in fixture which is empty", async () => {
  const pm = await detect({ cwd: "fixtures/empty" });
  assert.is(pm, "yarn");
});

test.run();
