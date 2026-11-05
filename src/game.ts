export const upgrades = [
  {
    name: "Barista",
    icon: "☕",
    base: 15,
    rate: 0.2,
    description: "A helping hand behind the counter.",
  },
  {
    name: "Espresso machine",
    icon: "⚙",
    base: 100,
    rate: 2,
    description: "Perfect shots, around the clock.",
  },
  {
    name: "Coffee cart",
    icon: "🛵",
    base: 1100,
    rate: 20,
    description: "Take your coffee to the neighborhood.",
  },
  {
    name: "Cozy café",
    icon: "🏠",
    base: 12000,
    rate: 150,
    description: "A little place everyone calls their own.",
  },
  {
    name: "Roastery",
    icon: "🔥",
    base: 130000,
    rate: 1000,
    description: "Fresh beans for the whole city.",
  },
];
export interface State {
  beans: number;
  total: number;
  clicks: number;
  owned: number[];
  betterBeans: boolean;
  savedAt: number;
}
export const betterBeansCost = 50;
export function fresh(): State {
  return {
    beans: 0,
    total: 0,
    clicks: 0,
    owned: upgrades.map(() => 0),
    betterBeans: false,
    savedAt: Date.now(),
  };
}
export function manualBrew(state: State): number {
  return state.betterBeans ? 2 : 1;
}
export function buyBetterBeans(state: State): boolean {
  if (state.betterBeans || state.beans < betterBeansCost) return false;
  state.beans -= betterBeansCost;
  state.betterBeans = true;
  return true;
}
export function cost(index: number, owned: number): number {
  return Math.ceil(upgrades[index].base * 1.15 ** owned);
}
export function production(state: State): number {
  return upgrades.reduce((sum, item, i) => sum + item.rate * state.owned[i], 0);
}
export function buy(state: State, index: number): boolean {
  if (!Number.isInteger(index) || index < 0 || index >= upgrades.length) {
    return false;
  }
  const price = cost(index, state.owned[index]);
  if (state.beans < price) return false;
  state.beans -= price;
  state.owned[index]++;
  return true;
}
export function restore(raw: string | null): State {
  try {
    const data = JSON.parse(raw ?? "null");
    if (
      !data || ![data.beans, data.total, data.clicks, data.savedAt].every((n) =>
        typeof n === "number" && Number.isFinite(n) && n >= 0
      ) || !Array.isArray(data.owned) ||
      data.owned.length !== upgrades.length || !data.owned.every((n: number) =>
        Number.isSafeInteger(n) && n >= 0 && n <= 1000
      ) || data.total < data.beans ||
      (data.betterBeans !== undefined && typeof data.betterBeans !== "boolean")
    ) {
      return fresh();
    }
    return { ...data, betterBeans: data.betterBeans === true };
  } catch {
    return fresh();
  }
}
