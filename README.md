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

The skill rail groups everything by its premise so the loop reads at a glance: **Gather → Refine → Conjure → Craft → Shop**. The **🏚️ The Lab** tab shows every line at once; the **🗺️ World Map** charts new biomes; the **🏆 Almanac** tracks achievements; **🜚 The Great Work** is the endgame; the top bar shows the current **season**, **moon phase**, and **Coziness**.

### How to play the current build
1. **Foraging / Gardening** — pick an ingredient and press **Begin**; it gathers on a loop. Each skill runs its own line at once, so the shop hums.
2. **Separation** — break a gathered ingredient into its five element **motes**.
3. **Glassblowing** — fuse Terra + Ignis motes into **vials** (and later Aether Flasks) to bottle your wares.
4. **Conjunction** — in *Experiment*, drop motes (and discovered essences) into the crucible and **Combine**. A valid new blend is a **discovery** (e.g. `Ignis + Aqua → Steam Essence`, or `Steam + Ember → Geyser Tincture`); nonsense becomes harmless **Muddle**. Discovered recipes can then be set to auto-run.
5. **Remedycraft** — formulate essences + a vessel into finished products (Sleep Tonic → … → Lesser Panacea).
6. **Hospitality** — townsfolk wander in with orders; serve them from stock for coins, reputation, and XP.
7. **Calcination** — burn ingredients down to **salts & ash** (the Materials feedstock).
8. **Distillation** — purify essences into potent **distillates** for the finest remedies.
9. **Transmutation** — forge salts + essences into **materials → tools** (held items that grant passive bonuses) and **luxury goods** to sell.
10. **Aethercraft** — **channel raw Aether** from the ley-blooms over time, and refine it into **Quintessence**. Aether is the scarce thread that the arcane crafts all pull on.
11. **Inscription** — etch **Sigils** (arcane feedstock), and **program your lines**: set a line to *brew until N, then idle* so it never overproduces or hogs your Aether.
12. **Feltcraft** — distill and bottle **emotions** (Calm, Courage, Focus, Wonder, Nostalgia, Serenity, Euphoria) — the Bottled Feelings tree. Each one drinks Aether, and townsfolk arrive with little emotional-need stories.
13. **Lore** — run **Study** actions for **Insight**, then spend it in the **Research Log** on permanent perks (+quality, +speed, recipe reveals, Codex hints).
14. **Quality** — every product is crafted at a grade (**Crude → Fine → Pure → Pristine**) set by your skill level, tools, and research. Higher grades sell for more, and fussy customers demand a minimum grade.
15. **Codex** — your collection log: track which of the ~28 combinations you've discovered.
16. **Apothecary (shop)** — spend coins on upgrades that speed up your lines.
17. **The Lab** — the dashboard: see every line's status (running / stalled / paused / idle) and rate, read the **net resource flow per minute** to spot bottlenecks (red = you're spending it faster than you make it), **Stop all**, and **save/apply line presets** to switch your whole factory at once.

Everything **ticks while idle** and continues offline — close the tab and the lab keeps simmering (you'll get a welcome-back summary). Progress autosaves to `localStorage`.

## Architecture (Phase 0 foundation)
- **`src/game/`** — the engine. Generic and content-agnostic: tick simulation, RuneScape-style XP curve (`xp.ts`), the Zustand store with save/load + offline progress (`store.ts`), and selectors. It knows nothing about specific content.
- **`src/game/content/`** — all data-driven content (elements, items, skills, the combination web, order templates). Adding ingredients/recipes/skills = adding data here.
- **`src/ui/`** — the React app: skill rail, per-skill panels, the discovery crucible, order book, larder + activity log.
- **`src/game/*.test.ts`** — engine + UI tests (XP table, production lines, discovery, orders, render smoke).

## Status
Design + roadmap complete. **The full 0–7 roadmap is built and playable:**
- **19 skills**, grouped by premise (Gather → Refine → Conjure → Craft → Shop) — Foraging, Gardening, Prospecting, Tidewalking, Husbandry, Astrology, Aethercraft, Separation, Glassblowing, Calcination, Conjunction, Distillation, Transmutation, Inscription, Remedycraft, Feltcraft, Curation, Lore, Hospitality
- The 5-element system · a ~28-recipe discoverable combination web · distillates · a managed **Aether/Quintessence economy** · materials, tools, sigils & stardust
- **All three product trees live**: Remedies, **Bottled Feelings** (Feltcraft), and the Materials tree (tools + luxury goods)
- **Deterministic quality system** (Crude → Fine → Pure → Pristine) with min-quality orders and quality-scaled rewards
- **A world of 6 biomes** to chart, a **four-season cycle** with seasonal crops + **festivals**, and a faster **moon-phase cycle** whose four phases each grant a timing boon (read via Astrology)
- **Husbandry** creatures (incl. an Aether source), **Curation** decor that raises a **Coziness** stat (bigger tips, more patient customers), and an **Almanac** collection log of 15 achievements
- **Programmable lines** ("brew until N, then idle") and **The Lab dashboard** with net resource-flow analytics & presets
- **The Great Work** endgame — synthesise the **Philosopher's Stone** through the four alchemical stages (Nigredo → Albedo → Citrinitas → Rubedo), then **New Bloom** (prestige / New Game+) for a permanent, stacking legacy speed bonus
- **Lore research** (Study → Insight → perks) · Codex · World Map · Almanac · reputation-tiered order book (5 → 10) · idle + capped offline progress · autosave · **export/import save codes**
- Verified: typecheck clean, **32 tests passing** (incl. a 90-minute headless playtest), production build OK.

The roadmap's solo-play arc is complete. Remaining Phase 7 items are **server-dependent** (cloud sync, shared codex, leaderboards) and out of scope for this client-only build; see [`docs/ROADMAP.md`](docs/ROADMAP.md).
