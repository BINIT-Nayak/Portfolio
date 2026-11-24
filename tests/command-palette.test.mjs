import assert from "node:assert/strict";
import test from "node:test";
import {
  paletteCommands,
  searchCommands,
  rememberCommand,
  validRecents,
} from "../lib/command-palette.mjs";

test("all twelve commands have unique stable IDs", () => {
  assert.equal(paletteCommands.length, 12);
  assert.equal(new Set(paletteCommands.map((c) => c.id)).size, 12);
});
test("fuzzy search supports partial sequences, aliases, casing, and no matches", () => {
  assert.equal(searchCommands("  PLNK ")[0].id, "plinko");
  assert.equal(searchCommands("gthb")[0].id, "github");
  assert.equal(searchCommands("cv")[0].id, "resume");
  assert.equal(searchCommands("pub sub")[0].id, "toast");
  assert.equal(searchCommands("zzzzzz").length, 0);
});
test("session recents deduplicate, move to front, cap at five, and reject stale IDs", () => {
  let recent = ["github", "plinko", "toast", "contact", "theme"];
  recent = rememberCommand(recent, "plinko");
  assert.deepEqual(recent, ["plinko", "github", "toast", "contact", "theme"]);
  recent = rememberCommand(recent, "sneaky");
  assert.deepEqual(recent, ["sneaky", "plinko", "github", "toast", "contact"]);
  assert.deepEqual(validRecents([null, "unknown", "github", "github"]), ["github"]);
  assert.deepEqual(validRecents({}), []);
  assert.equal(searchCommands("", recent)[0].id, "sneaky");
  assert.equal(searchCommands("plinko", recent)[0].id, "plinko");
});
