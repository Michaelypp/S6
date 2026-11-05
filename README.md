# Cozy Coffee — S6

A small incremental browser game built from the CMPM 121 D1 starter template.
Click the cup to earn beans, then purchase five types of automatic producers.
Prices increase by 15% per purchase. Milestones track lifetime beans.

## Run locally

Install Deno, open this folder in OpenChamber or a terminal, and run:

```sh
deno task dev
```

Open http://localhost:3000. Use `deno task ci` for formatting, lint, type
checking, and a production build. Run `deno test src/game_test.ts` for gameplay
logic tests.

## Features

- Manual brewing and automatic production calculated from elapsed time.
- Five producers with escalating costs and disabled unaffordable purchases.
- Browser-local autosave every five seconds and on page exit.
- Offline production up to eight hours, milestones, and confirmed reset.
- Responsive layout and keyboard-operable buttons.

Saves belong to the current browser and site address. Private browsing or
clearing browser storage may remove progress. The game still runs if storage
is unavailable, but progress will not persist.

## Assignment status

The linked D1 Google Doc could not be accessed during implementation, so exact
D1 specification compliance has not been verified. This implementation targets
the S6 activity's mostly-working incremental game requirement. Browser UI
verification and OpenChamber/BayLeaf model setup remain for the student to
complete. This project was implemented with Codex; no GLM session is claimed.

## Publishing

Create a repository named S6 using the course template, then push this local
project to it. The included workflow builds and deploys to GitHub Pages when
Pages is configured to use GitHub Actions. Submit your own S6 repository URL,
not the starter-template URL.

## Credits

Starter: https://github.com/ucsc-cmpm-121-f26/d1-starter

Tooling adapted from the CMPM 121 Fall 2026 S01 starter, which has no explicit
repository license. No new license is assigned to that material. The D1 scaffold
and original SVG were authored with OpenAI GPT-6 Astra assistance. Dependencies
retain their respective licenses. S6 gameplay and interface were created with
Codex assistance.
