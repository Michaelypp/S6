# Cozy Coffee — S6

[Play Cozy Coffee](https://michaelypp.github.io/S6/)

A cozy incremental game about growing a small coffee corner into a coffee
empire. Built with TypeScript and Vite using the CMPM 121 D1 starter template.

## How to play

1. Click the coffee cup to earn one bean.
2. Spend beans on baristas, espresso machines, coffee carts, cafés, and roasteries.
3. Each producer earns beans automatically. Buying more increases production,
   while its next purchase price increases by 15% (rounded up).
4. Reach milestones based on all the beans you have earned over time.

The game saves automatically every five seconds and when you leave the page.
When you return, your producers can earn up to eight hours of offline income.
Use **Reset progress** to start over; a confirmation appears before resetting.

## Features

- Five automatic producer types with increasing prices.
- Live bean balance, production rate, and lifetime earnings.
- Milestone progress tracking.
- Local saves, offline income, and recovery from invalid save data.
- Responsive layout and keyboard-operable buttons.

Progress is stored in the current browser for the current site address.
Clearing browser storage removes that save. If storage is unavailable, you can
still play, but progress will not be saved.

## Run locally

Install [Deno](https://deno.com/), then run these commands in the project folder:

```sh
deno task dev
```

Open http://localhost:3000 in your browser.

```sh
deno test src/game_test.ts
deno task ci
```

The tests cover upgrade purchases and save restoration. The CI task checks
formatting, lint, and TypeScript types, then creates a production build in `dist`.

## Deployment

The GitHub Actions workflow in `.github/workflows/deploy.yml` builds and deploys
the game on pushes to `main`. In repository settings, configure GitHub Pages to
use **GitHub Actions** as its source.

## Credits

Course template: [CMPM 121 D1 starter](https://github.com/ucsc-cmpm-121-f26/d1-starter).

Tooling adapted from the CMPM 121 Fall 2026 S01 starter, which has no explicit
repository license. No new license is assigned to that material. The D1 scaffold
and original SVG were authored with OpenAI GPT-6 Astra assistance. Dependencies
retain their respective licenses. S6 gameplay and interface were created with
Codex assistance.
