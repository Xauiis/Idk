# QUINTESSENCE — Game Design Document

*A cozy alchemy-apothecary automation game with a deep, idle-friendly multi-skill system.*

> Companion doc: **[ROADMAP.md](ROADMAP.md)** turns everything below into a phased build plan.

---

## 1. Vision & Pillars

You are an alchemist who has just inherited a sleepy little apothecary on the edge of a town called **Mirefen**. Magic here is **elemental**: every leaf, stone, and feeling can be broken down into the five elements, and anything can be made by recombining them. Your job is to rediscover the old recipes, automate your little lab, and quietly become the heart of the town.

The genre twist: this is a **factory/automation game**, but you don't automate *industry* — you automate **alchemy**. Replace every industrial metaphor with a cozy alchemical one:

| Factory-game concept | Quintessence equivalent |
|---|---|
| Mine ore | Forage herbs, garden crops, prospect crystals |
| Smelter / assembler | Alchemical **stations** (mortar, alembic, crucible, calcinator, athanor) |
| Conveyor belts / pipes | **Essence-flow lines** wired between stations |
| Electricity / power grid | **Aether** (the rare 5th element) + heat/fuel |
| Pollution | **Muddle** (botched residue) — gentle, compostable, never punishing |
| Tech tree (research) | The **Combination Web** — *discovered* by experimenting |
| Rocket / win condition | The **Magnum Opus**: synthesize the Quintessence (Philosopher's Stone) |

### Design pillars (the tie-breakers for every decision)
1. **Cozy first.** No harsh fail states; calm pace; warmth over challenge. When in doubt, make it kinder.
2. **Discovery is the dopamine.** The combination web should feel like *Little Alchemy* — experimentation rewarded with delight.
3. **A deep skill spine.** ~16 skills (growing to 20+), 1–99, idle-friendly, and *interwoven* so every skill matters to the others.
4. **Gentle automation.** Set-and-forget production lines; light throughput tension; full offline progress.
5. **Breadth over time.** Three product trees + a steady drip of new skills/systems = years of growth (see roadmap).

### Target feel & references
- **Melvor Idle / OSRS** — the skill grind, 1–99, action queues, offline progress, completion logs.
- **Little Alchemy / Doodle God** — combinatorial discovery joy.
- **Stardew Valley / Cult of the Lamb / Spiritfarer** — cozy tone, NPC warmth, gentle stakes.
- **Factorio / Shapez** (dialed *way* down) — the "set up a line and watch it hum" satisfaction, without pixel-perfect belt routing.

---

## 2. The Elemental System (the core mechanic)

Everything in the world is composed of **five elements**:

| Element | Symbol | Domain | Feels like |
|---|---|---|---|
| **Terra** | 🜃 | body, structure, salt, minerals, roots | solidity |
| **Aqua** | 🜄 | flow, solvents, sap, blood, tears | movement |
| **Ignis** | 🜂 | energy, heat, spice, transformation | change |
| **Aer** | 🜁 | spirit, vapor, scent, breath | lightness |
| **Aether** | ✦ | the **quintessence** — magic, emotion, light, binding | wonder |

Aether is the rare, advanced, "fifth" element — your scarce strategic resource (the game's namesake). The first four are common; Aether gates the deep content.

### Ingredient composition
Every ingredient carries an **elemental composition** vector, e.g.:

```
Lavender     → { Aer: 3, Aqua: 2, Aether: 1 }
River Stone  → { Terra: 4, Aqua: 1 }
Embercap     → { Ignis: 3, Terra: 1 }
Moondrop Dew → { Aqua: 2, Aether: 2 }
```

### The core loop (one full cycle)
1. **Gather** ingredients (Foraging, Gardening, Prospecting, Tidewalking…).
2. **Decompose / Extract** — break ingredients into raw **element motes** (Terra/Aqua/Ignis/Aer/Aether) via the **Separation** skill at extraction stations.
3. **Process** — purify and transform motes & reagents (**Distillation**, **Calcination**) into higher-grade essences and intermediate **compounds**.
4. **Combine** — recombine elements & compounds through the **Combination Web** (the **Conjunction** skill) — this is the discovery engine.
5. **Finish** — formulate the result into a finished product via a product skill (**Remedycraft**, **Feltcraft**, or **Transmutation**), bottled in a vessel you made (**Glassblowing**).
6. **Fulfill** — sell/serve to townsfolk via the **order book** (**Hospitality**) → coins, reputation, XP, gifts → upgrades → faster gathering. Loop.

### The Combination Web (the "tech tree" you discover)
Combinations are *recipes over elements and compounds*, surfaced as a growing web you explore:

```
Ignis + Aqua            → Steam Essence
Terra + Aether          → Loamheart Crystal
Aer  + Aether           → Whisper (base feeling-essence)
Steam Essence + Terra   → Geyser Salt
Whisper + Calm-herb     → Essence of Calm   (a Feeling)
Loamheart + Ignis x2    → Living Brass        (a Material)
```

- Some combos are **taught** (tutorials, recipe scrolls, NPC gifts, Lore research).
- Many are **discovered** by experimenting — drop elements/compounds into the **Conjunction** station and see what emerges. Unknown-but-valid combos give a burst of "Discovery XP" and a codex entry. Invalid combos produce harmless **Muddle**.
- Skills gate **which** combos you can attempt (level/ingredient requirements) and govern **yield + purity**.

### Quality: Purity & Potency
Every essence/compound/product has a **Purity %** (0–100). Purity is driven by:
`skill level + station tier + ingredient quality + process care (active timing or passive stat) + sigils/enchants.`
Higher purity → higher value, stronger effects, and is required to unlock the highest recipes. This gives every skill a *quality* axis on top of *unlock* and *speed*, so leveling always matters.

---

## 3. The Skill System (the RuneScape/Melvor spine)

~16 skills at launch, each **1–99**, leveled by repeated actions (Melvor-style action queues), each granting: recipe/tier unlocks, passive bonuses, and quality/speed/yield improvements. They are deliberately **interwoven** — most products touch many skills, and gathering feeds processing feeds products feeds upgrades feeds gathering.

Skills are organized into five clusters:

### Gathering cluster (get raw ingredients)
1. **Foraging** — gather wild herbs, flowers, mushrooms from world nodes (timed/idle).
2. **Gardening** — grow your own ingredients in plots & greenhouse; plant → wait → harvest (deeply idle-friendly; seasonal).
3. **Prospecting** — mine crystals, salts, and minerals from the hills and caves.
4. **Tidewalking** — gather water-reagents, pearls, kelp, and reed from streams and the coast.

### Processing cluster (refine raw into usable)
5. **Separation (Spagyrics)** — decompose ingredients into raw element motes; the extraction engine that feeds everything.
6. **Distillation** — purify essences & liquids, raise potency, produce spirits & solvents.
7. **Calcination** — burn/ash ingredients into Terra-rich salts and mineral compounds (the "fire" processing path).
8. **Conjunction** — the heart: combine elements & compounds via the Combination Web. Governs discovery success, yield, and which combos are possible.

### Product cluster (make the things you sell)
9. **Remedycraft (Apothecary)** — formulate potions, tonics, and salves → the **Remedies** product tree.
10. **Feltcraft (Affect-alchemy)** — distill and bottle emotions → the **Feelings** product tree (cozy, narrative).
11. **Transmutation** — refine base matter into precious/living materials & components → the **Materials** product tree (also crafts station upgrades).
12. **Glassblowing (Vesselcraft)** — craft the vials, jars, flasks, and apparatus everything else needs; supplies the whole shop.

### Arcane cluster (the rare, advanced layer)
13. **Aethercraft (Quintessence)** — harvest and channel Aether; powers advanced combinations and enchantments. The "magic" skill and central late-game bottleneck.
14. **Inscription (Sigilcraft)** — etch sigils/labels that **program station & line behavior** (light automation logic) and **enchant** products with lasting effects.

### Support / meta cluster
15. **Hospitality (Shopkeeping)** — read customer needs, serve, upsell, build reputation; expands the order book, unlocks regulars and town events. The social/economy skill.
16. **Lore (Naturalism)** — research ingredients & phenomena to *permanently* unlock recipes, reveal hidden combinations, and grow the codex. The meta-progression skill.

> **Expansion skills** (added post-launch, see roadmap Phase 6) keep the "new skill drop" cadence that makes Melvor/RS feel alive: **Astrology** (lunar/celestial timing bonuses), **Husbandry** (cozy reagent creatures — bees, glowcrabs, dust-moths), **Curation** (decorate the shop for real bonuses + a "coziness" stat), **Trade/Caravan** (long-distance commerce & arbitrage), and **Mycology** (a mushroom specialization branch).

### Entwinement — why it feels like RuneScape
A single order — *"a Potion of Calm for the baker who can't sleep"* — touches **nine skills**:

```
Gardening (grow lavender) + Foraging (chamomile)
  → Separation (extract Aer/Aqua/Aether motes)
  → Distillation (purify to high potency)
  → Conjunction (combine into Calm-essence via the web)
  → Feltcraft (bottle it as Essence of Calm)
  → Glassblowing (the vial it goes in)
  → Hospitality (serve the baker, earn reputation)
  ...and Lore had to research the recipe first.
```

Every skill feeds the others; nothing is a dead end. The **XP curve** is exponential (RS-style — see roadmap §schemas), so 1–50 is brisk and cozy while 90–99 is the long completionist tail.

---

## 4. Stations & Automation (light, cozy "factory")

Your **lab** is a room you expand. You place **stations** (the "machines") and wire them into **lines** (the "belts"). This is the automation layer — deliberately *light and abstract* (a node graph / simple piping), not a pixel-perfect belt puzzle.

### Stations (each performs operations / hosts skills)
- **Mortar & Pestle** — basic prep & Separation (early).
- **Alembic / Still** — Distillation.
- **Crucible** — Conjunction (combining).
- **Calcinator** — Calcination.
- **Athanor** (slow furnace) — long, high-potency processes; Transmutation.
- **Condenser** — Feltcraft (bottling feelings).
- **Glass Furnace** — Glassblowing.
- **Aether Font** — Aethercraft.
- **Inscription Desk** — Sigilcraft.

Each station has a **tier** (upgradeable via Transmutation/materials), a **speed**, a **quality bonus**, and slots for **sigils** (Inscription) that modify behavior.

### Lines & flow (the automation)
- You **link** stations: outputs of one feed inputs of the next (e.g., Mortar → Still → Crucible → Condenser).
- A line **auto-runs**: it pulls inputs from storage, runs each station's operation, and deposits outputs to bins/storage, granting XP all the while — until inputs run out or output bins fill. This is the idle engine.
- **Throughput tension (gentle):** stations have speeds and Aether is scarce, so you balance *which lines run* against the **order book's** demand. It's a soft optimization, never a punishing one.
- **Inscription** adds light "logic": schedule a line to only run at night, cap output, prioritize an order, or stop when stock is full.

### Why not full Factorio routing?
Cozy + browser + idle wants approachability. The fun lives in **recipe chains and skill synergies**, not geometry. Lines are quick to set up and easy to read; the depth comes from the alchemy, not spatial gymnastics.

---

## 5. The Three Product Trees

Unlocked in sequence so the game keeps opening up (see roadmap), all three eventually run in parallel:

1. **Remedies** *(Remedycraft)* — potions, tonics, salves. Concrete, gamey demand: cure ailments, brew buffs, supply travelers & townsfolk. The most "classic" tree and the tutorial path.
2. **Bottled Feelings** *(Feltcraft + Aether)* — distilled emotions: Calm, Courage, Wonder, Nostalgia, Focus. Customers arrive with **emotional needs**, and each order is a little story. The warm, narrative heart of the game; the tree that makes it *cozy* and unusual.
3. **Transmuted Materials** *(Transmutation)* — gold, gems, living-brass, dreamsilk, reagent crystals. The "factory/economy" tree: feeds station upgrades, tools, shop decor, and the broader economy.

Three trees = three overlapping endgames and a reason to keep all skills leveled.

---

## 6. The Town, Economy & Cozy Systems

### Mirefen, the town (the warmth)
- A hub of **named regulars** with little ongoing storylines: the insomniac baker, the nervous bridge-builder, a homesick traveling bard, a grumpy-but-kind herbalist rival. Their orders, gifts, and arcs are the emotional spine.
- **Reputation** (via Hospitality) unlocks bigger order books, special requests, and town events.
- **Seasons & festivals** shift demand (a Courage tonic run before the Spring Trials; warming remedies in winter), tying into Gardening's seasonal crops.

### Economy
- **Coins** from orders & walk-in sales → station upgrades, lab expansions, seeds, tools, decor.
- **Material tiers:** Raw (herbs, stones) → Motes (elements) → Essences (purified) → Compounds (combined) → Products (finished) → Masterworks (legendary, near-100% purity).
- Later: a **caravan/market** (expansion skill) for buying rare reagents and selling surplus.

### Cozy guarantees (pillar #1, made concrete)
- **No harsh fail.** Botched combos → **Muddle**, a compost you can reclaim for a little Terra. Out of stock just *pauses* a line.
- **Decoration** (Curation, expansion) is cosmetic **and** grants a **Coziness** stat that raises customer patience & tips.
- **Gentle rhythm.** A calm day/season cycle. Idle progress framed warmly: *"the lab kept gently simmering while you were away."*
- **Accessibility:** colorblind-safe element coding (symbols + shapes, not just color), adjustable text, no twitch reflexes required.

---

## 7. Idle / Active Play & Offline Progress

- **Tick simulation** (1 tick/sec) runs in a **Web Worker**; the UI reads a snapshot. Offline progress is computed on return (capped, cozy-framed).
- **Melvor-style action model:** pick an action per skill / start a line; it **auto-repeats**, consuming inputs and granting XP + outputs.
- **Active play is rewarded, not required:** timing a harvest, gambling on a discovery, or hand-serving a customer for a combo bonus gives an edge — but idle always advances. This keeps it cozy and respectful of the player's time.

---

## 8. Progression & Endgame

- **Mid-game:** unlock all three product trees, raise potency ceilings, expand the lab, befriend the town, and fill the **Codex** (every ingredient, every combination, every recipe — RS-style collection logs).
- **The Magnum Opus (endgame):** master all elements & skills to synthesize the **Quintessence / Philosopher's Stone** — the perfect fifth-element artifact. The cozy answer to a factory game's "launch the rocket."
- **New Bloom (prestige):** completing the Opus lets you pass the shop to an apprentice and move to a new town — a **New Game+** with carryover meta-perks (Lore unlocks, legacy bonuses) and fresh content tiers.
- **Completionist tail:** max all skills (1–99 each), 100% the Codex, befriend every villager, craft every Masterwork — the long, calm, RuneScape-style horizon.

---

## 9. Art, Audio & UX direction

- **Visual:** warm, hand-drawn / storybook 2D. A cozy lit lab interior; a soft watercolor town & world map. Bioluminescent jewel tones for essences; gentle particle wisps for elements (each with a distinct **shape + color** for accessibility).
- **Audio:** lo-fi/folk ambient, bubbling alembics, soft chimes on discovery, seasonal motifs.
- **UX:** React-driven panels (skills, codex, orders, lab) over a Canvas/DOM lab view. Readable at a glance; one-click action queues; a discovery web that's a joy to browse. Mobile-friendly responsive layout (idle games live on phones).

---

## 10. Scope & platform

- **Platform:** browser-first (desktop + mobile web), TypeScript. Installable PWA later.
- **Model:** single-player first; free; optional cosmetic monetization much later. Light social (shared codex, leaderboards, gifting) post-launch.
- See **[ROADMAP.md](ROADMAP.md)** for the tech stack, data architecture, simulation model, schemas, and the phase-by-phase build order that starts with a strong, *fun-first* vertical slice.
