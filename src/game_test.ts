import {
  betterBeansCost,
  buy,
  buyBetterBeans,
  cost,
  fresh,
  manualBrew,
  production,
  restore,
} from "./game.ts";
function assert(value: boolean, message: string) {
  if (!value) throw new Error(message);
}
Deno.test("better beans upgrade gates, pays, and doubles brewing", () => {
  const state = fresh();
  assert(manualBrew(state) === 1, "Fresh game brews one bean per click");
  assert(
    !buyBetterBeans(state),
    "Cannot buy without reaching the price",
  );
  state.beans = betterBeansCost;
  assert(buyBetterBeans(state), "Buy once the price is met");
  assert(
    state.beans === 0 && state.betterBeans === true,
    "Deduct the price and grant the upgrade",
  );
  assert(manualBrew(state) === 2, "Manual brewing doubles");
  assert(
    !buyBetterBeans(state),
    "Reject buying the one-time upgrade twice",
  );
  state.beans = 500;
  assert(
    !buyBetterBeans(state),
    "Cannot repurchase even with plenty of beans",
  );
});
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
Deno.test("older saves restore with the upgrade off", () => {
  const state = fresh();
  state.beans = 60;
  state.total = 60;
  state.owned[0] = 2;
  state.betterBeans = true;
  const save = JSON.parse(JSON.stringify(state));
  delete save.betterBeans;
  const legacy = restore(JSON.stringify(save));
  assert(
    legacy.beans === 60 && legacy.owned[0] === 2,
    "Legacy balance and upgrades survive",
  );
  assert(
    legacy.betterBeans === false && manualBrew(legacy) === 1,
    "Missing upgrade flag defaults to off",
  );
  const corrupt = restore(
    JSON.stringify({ ...state, betterBeans: "yes" }),
  );
  assert(
    corrupt.betterBeans === false && corrupt.beans === 0,
    "Non-boolean flag falls back to fresh game",
  );
});
