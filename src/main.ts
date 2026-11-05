import "./style.css";
import { buy, cost, fresh, production, restore, upgrades } from "./game.ts";
const key = "s6-cozy-coffee-v1";
let stored: string | null = null;
try {
  stored = localStorage.getItem(key);
} catch { /* Play without storage. */ }
let state = restore(stored);
const offline =
  Math.min(8 * 3600, Math.max(0, (Date.now() - state.savedAt) / 1000)) *
  production(state);
state.beans += offline;
state.total += offline;
const format = (n: number) =>
  new Intl.NumberFormat("en", {
    maximumFractionDigits: 1,
    notation: n >= 10000 ? "compact" : "standard",
  }).format(n);
const app = document.querySelector<HTMLElement>("#app")!;
app.innerHTML = `
<header><a class="brand" href="./">☕ &nbsp; COZY COFFEE</a><span class="tag">S6 · INCREMENTAL GAME</span></header>
<section class="intro"><span class="eyebrow">A LITTLE COFFEE. A LOT OF POSSIBILITY.</span><h1>Good things<br>start with a cup.</h1><p>From your first pour to a city full of cafés.<br>Brew, grow, and make yourself at home.</p></section>
<div class="game"><section class="brew panel"><div class="live"><span></span> YOUR COFFEE CORNER</div><div class="balance"><strong id="beans">0</strong><span>coffee beans</span></div><button id="brew" aria-label="Brew coffee, earn one bean"><span class="steam">∿ ∿ ∿</span><span class="cup">☕</span></button><div class="brew-label">Click to brew <span>+1 bean</span></div><div class="stats"><div><strong id="rate">0</strong><span>beans / second</span></div><div><strong id="total">0</strong><span>all-time beans</span></div></div></section>
<section class="shop panel"><div class="shop-heading"><div><span class="eyebrow">MAKE ROOM FOR MORE</span><h2>Grow your corner</h2></div><span class="leaf">✿</span></div><p class="hint">Every upgrade earns beans automatically.</p><div id="upgrades">${
  upgrades.map((item, i) =>
    `<button class="upgrade" data-index="${i}"><span class="icon">${item.icon}</span><span class="details"><strong>${item.name} <small id="owned-${i}">0 owned</small></strong><span>${item.description}</span><em>+${
      format(item.rate)
    } beans / sec</em></span><span class="price" id="price-${i}"></span></button>`
  ).join("")
}</div></section></div>
<section class="milestone panel"><span>✧</span><div><strong id="milestone"></strong><p id="progress-text"></p><progress id="progress" max="100" value="0"></progress></div></section><footer><span id="status" role="status">${
  offline > 0
    ? `Welcome back! Earned ${
      format(offline)
    } beans while away (up to 8 hours).`
    : "Take your time. Your coffee empire starts here."
}</span><button id="reset">Reset progress</button></footer>`;
const el = (id: string) => document.getElementById(id)!;
function render() {
  el("beans").textContent = format(state.beans);
  el("rate").textContent = format(production(state));
  el("total").textContent = format(state.total);
  upgrades.forEach((_, i) => {
    const price = cost(i, state.owned[i]);
    el(`price-${i}`).textContent = `${format(price)} beans`;
    el(`owned-${i}`).textContent = `${state.owned[i]} owned`;
    (document.querySelector(`[data-index="${i}"]`) as HTMLButtonElement)
      .disabled = state.beans < price;
  });
  const goals = [100, 1000, 10000, 100000, 1000000];
  const goal = goals.find((n) => n > state.total);
  el("milestone").textContent = goal
    ? `Next milestone · ${format(goal)} beans brewed`
    : "A million little moments. Your coffee empire is thriving!";
  el("progress-text").textContent = goal
    ? `${format(state.total)} / ${format(goal)} lifetime beans`
    : "All milestones completed — keep brewing.";
  (el("progress") as HTMLProgressElement).value = goal
    ? state.total / goal * 100
    : 100;
}
function save() {
  state.savedAt = Date.now();
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    el("status").textContent =
      "Saving unavailable in this browser. Keep this tab open to continue.";
  }
}
el("brew").addEventListener("click", () => {
  state.beans++;
  state.total++;
  state.clicks++;
  render();
});
el("upgrades").addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
    "button[data-index]",
  );
  if (button && buy(state, Number(button.dataset.index))) {
    render();
    save();
  }
});
el("reset").addEventListener("click", () => {
  if (confirm("Reset all beans and upgrades? This cannot be undone.")) {
    state = fresh();
    save();
    render();
    el("status").textContent = "A fresh pot. A fresh start.";
  }
});
let previous = Date.now();
setInterval(() => {
  const now = Date.now();
  const earned = production(state) *
    Math.min(8 * 3600, Math.max(0, (now - previous) / 1000));
  previous = now;
  state.beans += earned;
  state.total += earned;
  render();
}, 100);
setInterval(save, 5000);
addEventListener("pagehide", save);
render();
