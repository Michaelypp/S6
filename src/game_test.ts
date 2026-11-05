import { buy, cost, fresh, production, restore } from "./game.ts";
function assert(value: boolean, message: string) {
  if (!value) throw new Error(message);
}
Deno.test("purchases require funds and scale the next price", () => {
  const state = fresh();
  assert(!buy(state, 0), "Cannot buy without beans");
  state.beans = 15;
  state.total = 15;
  assert(buy(state, 0), "Can buy at exact price");
  assert(
    state.beans === 0 && state.owned[0] === 1,
    "Deduct price and grant one upgrade",
  );
  assert(cost(0, 1) === 18, "Next price rounds up");
  assert(production(state) === 0.2, "Upgrade produces passive income");
  assert(!buy(state, -1), "Reject invalid upgrade");
});
Deno.test("save restoration preserves progress and rejects corrupt data", () => {
  const state = fresh();
  state.beans = 22;
  state.total = 25;
  state.owned[0] = 1;
  assert(restore(JSON.stringify(state)).beans === 22, "Restore balance");
  assert(
    production(restore(JSON.stringify(state))) === 0.2,
    "Restore production",
  );
  for (
    const raw of [
      null,
      "broken",
      "{}",
      JSON.stringify({ ...state, beans: -1 }),
      JSON.stringify({ ...state, owned: [1] }),
      JSON.stringify({ ...state, owned: [1.5, 0, 0, 0, 0] }),
    ]
  ) {
    assert(restore(raw).beans === 0, "Invalid save falls back to fresh game");
  }
});
