# QUINTESSENCE

> A **cozy alchemy apothecary** automation game for the browser. Run a little magical shop where alchemy works by **breaking ingredients down into five elements** — Terra, Aqua, Ignis, Aer, and the rare **Aether** — and **recombining them through a discoverable combination web** to make remedies, bottled feelings, and transmuted materials for the townsfolk who wander in.

It's *Little Alchemy's* joyful "aha!" discovery, automated like a factory game and grafted onto a deep, idle-friendly **RuneScape / Melvor Idle–style multi-skill system** (1–99, ~16 interlocking skills growing to 20+). No steel, no smokestacks — just mortars, alembics, a cozy lab you slowly expand, and a town that comes to rely on you.

**The twist on "factory":** you don't automate *industry*, you automate *alchemy*. Your "machines" are alchemical stations (still, crucible, calcinator, athanor); your "belts" are little essence-flow lines you wire between them; your "tech tree" is a **combination web** you *discover* by experimenting. And it's **cozy** — botched brews become compost, not disasters; the pace is calm; the point is a warm shop, a full codex, and numbers that go satisfyingly up.

---

## Design pillars
1. **Cozy first.** No harsh fail states. Calm pace. A shop that feels like home.
2. **Discovery is the dopamine.** The elemental combination web rewards experimentation like *Little Alchemy* — gated and empowered by skills.
3. **A deep skill spine.** ~16 skills (→20+), 1–99, idle-friendly, *tightly interwoven* so leveling one helps the rest.
4. **Gentle automation.** Wire up little production lines that tick away; light throughput tension from the order book; full offline progress.
5. **Breadth over time.** Three product trees and a steady cadence of brand-new skills/systems keep it growing for years.

## Documents
- **[`docs/DESIGN.md`](docs/DESIGN.md)** — Full game design: the elemental system, the combination web, all skills, stations, products, the town, economy, cozy systems, and endgame.
- **[`docs/ROADMAP.md`](docs/ROADMAP.md)** — Phased build plan: a strong base (playable vertical slice) first, then a skill-by-skill, system-by-system expansion. Includes tech stack, data architecture, simulation model, schemas, and milestone acceptance criteria.

## One-line pitch
*Melvor Idle's skill grind + Little Alchemy's discovery, running a cozy apothecary where you automate alchemy itself.*

## Play it (Phase 0 + vertical-slice in progress)

```bash
npm install
npm run dev      # opens a Vite dev server (default http://localhost:5173)
```

Other scripts:

```bash
npm run build    # typecheck + production build to dist/
npm run preview  # serve the production build
npm test         # run the engine + UI test suite (Vitest)
```

### How to play the current build
1. **Foraging / Gardening** — pick an ingredient and press **Begin**; it gathers on a loop. Each skill can run its own line at once, so the shop hums.
2. **Separation** — break a gathered ingredient into its five element **motes**.
3. **Conjunction** — in *Experiment*, drop motes into the crucible and **Combine**. A valid new blend is a **discovery** (e.g. `Ignis + Aqua → Steam Essence`); nonsense becomes harmless **Muddle**. Discovered recipes can then be set to auto-run.
4. **Remedycraft** — formulate essences into finished products (Sleep Tonic, Warming Salve…).
5. **Hospitality** — townsfolk wander in with orders; serve them from stock for coins, reputation, and XP.

Everything **ticks while idle** and continues offline — close the tab and the lab keeps simmering (you'll get a welcome-back summary). Progress autosaves to `localStorage`.

## Architecture (Phase 0 foundation)
- **`src/game/`** — the engine. Generic and content-agnostic: tick simulation, RuneScape-style XP curve (`xp.ts`), the Zustand store with save/load + offline progress (`store.ts`), and selectors. It knows nothing about specific content.
- **`src/game/content/`** — all data-driven content (elements, items, skills, the combination web, order templates). Adding ingredients/recipes/skills = adding data here.
- **`src/ui/`** — the React app: skill rail, per-skill panels, the discovery crucible, order book, larder + activity log.
- **`src/game/*.test.ts`** — engine + UI tests (XP table, production lines, discovery, orders, render smoke).

## Status
Design + roadmap complete. **Phase 0 engine is built and a playable cozy vertical slice runs on top of it** (6 skills, 10 ingredients, the 5-element system, a discoverable combination web, idle + offline progress). Next up per [`docs/ROADMAP.md`](docs/ROADMAP.md): expand the combination web, add the Lore/research and processing skills (Distillation, Calcination), and the second product tree.
