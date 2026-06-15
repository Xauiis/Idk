# QUINTESSENCE — Development Roadmap

*How we build [the game](DESIGN.md): a strong, fun-first base, then a skill-by-skill, system-by-system expansion.*

The guiding principle: **prove the cozy core loop is fun before building breadth.** Phase 1 is a complete, polished, ~3-hour vertical slice. Everything after is additive content that slots into the same data-driven engine, mirroring how Melvor/RuneScape ship "a new skill" as a self-contained update.

> **Build status:** ✅ **Phases 0–5** are implemented and playable — **16 skills** (grouped Gather→Refine→Conjure→Craft→Shop), the 5-element system, a ~28-recipe combination web, the deterministic quality system (Crude→Pristine) with min-quality orders, the Lore research log, all three product trees (Remedies, **Bottled Feelings** via Feltcraft, Materials), a managed **Aether/Quintessence economy**, **Inscription** with programmable "brew until N" line caps, **The Lab** dashboard, plus Phase 5's **world of 6 biomes** (Prospecting & Tidewalking), a **four-season cycle** with seasonal crops + festival bonuses, **reputation-tiered** order slots, order expiry/decline, the Codex, shop upgrades, and idle + offline progress. A 90-minute headless playtest runs in CI as a balance regression. **Phase 6 is the next target.**

---

## Tech stack

| Concern | Choice | Why |
|---|---|---|
| Language | **TypeScript** | Type-safe content definitions; one language client+sim. |
| Build/dev | **Vite** | Fast HMR, simple PWA path. |
| UI | **React** | Menus, skill panels, codex, order book — data-heavy UI. |
| State | **Zustand** (+ Immer) | Lightweight, ergonomic, easy to snapshot/persist. |
| Lab view | **PixiJS** (Canvas/WebGL); DOM/SVG fallback for the node graph | Cozy 2D + particles; node graph can start as plain DOM. |
| Simulation | **Web Worker** running the tick loop | Keeps the sim smooth & off the UI thread; enables fast offline catch-up. |
| Persistence | **localStorage** (versioned, with migrations) → IndexedDB for big saves → optional cloud later | Browser-first, no backend to start. |
| Content | **Data-driven registries** (TS/JSON defs validated with **Zod**) | Add ingredients/recipes/skills without touching engine code. |
| Testing | **Vitest** + Playwright (smoke) | Unit-test the sim math; smoke-test the loop. |

**Architecture rule:** the **engine** (tick loop, XP, inventory, lines, offline calc) is generic and knows *nothing* about specific content. All elements, ingredients, recipes, skills, stations, products, and orders live in **data**. Adding content = adding data + maybe a small effect handler. This is what makes years of expansion cheap.

---

## Data architecture (the content registry)

Everything is a registered definition keyed by id. Illustrative schemas:

```ts
type ElementId = 'terra' | 'aqua' | 'ignis' | 'aer' | 'aether';
type Composition = Partial<Record<ElementId, number>>;

interface Ingredient {
  id: string;
  name: string;
  source: SkillId;            // which gathering skill yields it
  tier: number;
  composition: Composition;   // what it decomposes into
  baseQuality: number;        // 0–100 starting purity
  season?: Season[];          // gardening/foraging seasonality
}

interface Recipe {              // a node in the Combination Web
  id: string;
  inputs: { ref: string; qty: number }[];  // elements, essences, or compounds
  output: { ref: string; qty: number };
  skill: SkillId;             // usually 'conjunction'
  levelReq: number;
  discovery: 'taught' | 'experiment' | 'research';
  xp: number;
  purityModel: PurityModel;   // how inputs/level/station → output purity
}

interface Skill {
  id: SkillId;
  name: string;
  cluster: 'gather' | 'process' | 'product' | 'arcane' | 'support';
  maxLevel: 99;
  xpCurve: 'rs-exponential';
  unlocks: Record<number, string[]>;   // level → unlocked def ids
  passives: Passive[];                  // per-level bonuses
}

interface Station {
  id: string; name: string;
  operations: OperationId[];  // what it can run
  tier: number; speed: number; qualityBonus: number;
  sigilSlots: number;         // Inscription
  upgradeCost: CostBundle;
}

interface Order {             // demand from the town
  id: string; customer: string;
  wants: { productId: string; qty: number; minPurity?: number };
  reward: { coins: number; rep: number; gifts?: string[] };
  story?: string;             // for Feelings orders especially
  deadline?: number;          // soft; expiry just removes the order
}
```

**XP curve** (RuneScape's, so the grind feels right): cumulative XP for level *L* is
`floor( Σ_{n=1}^{L-1} floor(n + 300·2^(n/7)) / 4 )` — ~83 XP for L2, ~13M for L99. Brisk and cozy early, long completionist tail late.

**Simulation model:** fixed-step tick (1s). Each tick the worker advances every active **action** and **line**: accrue progress, on completion consume inputs / emit outputs / award XP / roll purity & discovery, then repeat or stall (out of inputs / full bins). **Offline** = run the same stepper at high speed for `min(elapsed, cap)` with a cozy summary on return.

---

## Phase 0 — Foundation *(engine & data, no content yet)*

Build the generic engine and the content pipeline.
- Project scaffold (Vite + TS + React + Zustand + Zod + Vitest).
- Tick loop in a Web Worker; UI snapshot subscription.
- Core systems: **inventory/resources**, **skills + XP/leveling**, **action queue**, **production lines**, **save/load** (versioned + migrations), **offline-progress calculator**.
- Content registry + Zod validation; dev tools to hot-add a def.

**Acceptance:** define one toy ingredient + one toy skill in data, run an action that ticks, grants XP & items, persists across reload, and correctly catches up after a simulated offline gap.

---

## Phase 1 — The Strong Base *(the cozy vertical slice — must be FUN)*

A small, complete, polished slice that proves the twist. **One town, one lab room.**
- **5 core skills:** Foraging, Gardening, Separation, Conjunction, Remedycraft — plus minimal **Glassblowing** (vials) and a minimal **Hospitality** order book.
- **Elemental system live:** ~15 ingredients, all 5 elements, a starter **Combination Web** (~30 combos), ~10 remedies.
- **Stations & lines:** Mortar, Still, Crucible placeable; 1–2 automated lines.
- **The discovery UI / Codex**, the order book, coins, basic shop upgrades.
- Levels tuned for **1–30**; full **offline progress**; cozy framing & first-pass art/audio.

**Acceptance:** a new player gets a satisfying **2–4 hour** loop — gather → discover combos → fulfill orders → level up → unlock the next tier — and *wants more*. If this isn't fun, we fix it before building anything below.

---

## Phase 2 — Depth & a second product tree

- Add **Lore** (research) → codex-driven permanent unlocks & hidden combos.
- Add **Distillation** + **Calcination** → longer alchemy chains and the full **Purity/Potency** system.
- Add **Transmutation** → the **Materials** product tree, plus station upgrades & tools (gloves, better mortar) that boost skills.
- Greatly expand the Combination Web; introduce intermediate **compounds**.

**Acceptance:** two full product trees (Remedies + Materials), a working potency system, and research-gated discovery that gives a meta-progression hook.

---

## Phase 3 — Feelings & Aether *(the emotional + arcane heart)*

- Add **Feltcraft** → the **Bottled Feelings** tree + narrative villager "emotional need" orders (little stories).
- Add **Aethercraft** → harvest/channel **Aether** (5th element) as the gentle late-game bottleneck gating advanced combos & enchantments.
- Add **Inscription (Sigilcraft)** → program station/line behavior (light automation logic) + product enchantments.

**Acceptance:** all **three product trees** live; a working Aether economy; programmable lines; and a noticeably warmer, more narrative town experience.

---

## Phase 4 — Automation depth *(the lab as a system)*

- Bigger lab; more stations; a real **line-management UI**; gentle **throughput/logistics** tension; essence routing, storage bins, bottleneck balancing.
- Quality-of-life: bulk actions, line presets, scheduling (via Inscription), production analytics/overview.

**Acceptance:** the "set up the factory and watch it hum" satisfaction lands; idle efficiency is meaningfully improvable through clever line design, without becoming a stressful optimization puzzle.

---

## Phase 5 — World expansion & more gathering

- Add gathering breadth: **Prospecting** (mining) and **Tidewalking** (water), and deepen **Gardening** (greenhouse, crop tiers, seasons).
- A **world map** of biomes/locations to unlock, each with unique ingredients and element ratios → reasons to explore.
- Deepen **Hospitality**: regulars with storylines, reputation tiers, and **seasonal festivals/events** that shift demand.

**Acceptance:** a much larger ingredient pool, a living seasonal world, and travel that feels rewarding.

---

## Phase 6 — Cozy meta-systems & the "new skill" cadence

Ship new skills as self-contained updates (the Melvor/RS live-game rhythm):
- **Astrology** — lunar/celestial timing bonuses (folds in the lunar-alchemy flavor).
- **Husbandry** — cozy reagent creatures (bees → honey/Aer, glowcrabs → Aether dust).
- **Curation** — decorate the shop for real bonuses + the **Coziness** stat.
- **Trade/Caravan** — buy rare reagents, sell surplus, light arbitrage.
- Plus **achievements / completion logs**, full Codex completion, and collection goals.

**Acceptance:** ~16–20 skills, deep long-tail completionist content, and a content pipeline proven to ship a new skill cleanly.

---

## Phase 7 — Magnum Opus, prestige & live/social

- **Endgame:** synthesize the **Quintessence / Philosopher's Stone** (the "rocket" moment).
- **New Bloom** prestige → New Game+ with carryover meta-perks and fresh tiers.
- **Social/live:** shared codex, leaderboards, gifting, cloud saves, seasonal live events.
- Final balance pass, polish, audio, performance, accessibility certification.

**Acceptance:** a complete arc — tutorial → mastery → Opus → prestige — and a sustainable cadence for live content drops.

---

## Sequencing rationale (why this order)
1. **Engine before content** (P0) so all later content is cheap to add.
2. **Fun-first vertical slice** (P1) to de-risk the core twist before investing in breadth.
3. **One new product tree at a time** (P2 Materials, P3 Feelings) so complexity ramps gently and each adds a fresh hook.
4. **Automation depth after content exists** (P4) — you can only make routing fun once there's enough to route.
5. **World & gathering breadth** (P5) once the processing/product side is rich enough to demand more inputs.
6. **New-skill cadence** (P6) as the long-tail live-game engine.
7. **Endgame & social last** (P7), once there's a full game to crown and a community to serve.

## Top risks & mitigations
- **Combination web becomes grindy, not delightful** → keep discovery bursts frequent, telegraph "near misses," let Lore research reveal hints. *(Tune relentlessly in P1.)*
- **Cozy vs. depth tension** → depth lives in *systems & synergies*, never in punishment; every fail state is soft (Muddle). Revisit against pillar #1 each phase.
- **Idle balance / runaway or stall economies** → simulate long offline runs in tests (Vitest) from P0; cap and curve carefully.
- **Scope creep across 16→20 skills** → the data-driven engine + strict "engine knows no content" rule keeps each skill an additive, testable module.
- **Mobile performance with many lines** → sim in a worker, snapshot-based UI, virtualized lists; budget perf checks each phase.
