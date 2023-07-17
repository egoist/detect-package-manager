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

test("in fixture which is empty", async () => {
  const pm = await detect({ cwd: "fixtures/empty" });
  assert.is(pm, "yarn");
});

test("in monorepo at one level", async () => {
  const pm = await detect({ cwd: "fixtures/monorepo/first" });
  assert.is(pm, "pnpm");
});

test("in monorepo at one level (with monorepo explicitly enabled)", async () => {
  const pm = await detect({ cwd: "fixtures/monorepo/first" });
  assert.is(pm, "pnpm");
});

test("in monorepo at two levels", async () => {
  const pm = await detect({ cwd: "fixtures/monorepo/first/two" });
  assert.is(pm, "pnpm");
});

test("in monorepo at one level (with monorepo disabled)", async () => {
  const pm = await detect({ cwd: "fixtures/monorepo/first", monorepo: false });
  assert.is(pm, "yarn");
});

test.run();
