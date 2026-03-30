/*
  Guides dataset: initial batch and scaffolding for future categories.
  Categories: Brew Methods, Milk Steaming, Cleaning, Recipes, Other
*/

// Utility: today ISO date for updatedOn default
const TODAY_ISO = new Date().toISOString().slice(0, 10);

// Shared categories
export const GUIDE_CATEGORIES = [
  "Recipes",
  "Milk & Steaming",
  "Understanding Methods",
  "Cleaning & Maintenance",
  "Equipment",
  "Other"
];

// Initial guides
export const GUIDES = [
  {
    id: "french-press-hoffmann",
    title: "The Ultimate French Press Technique — James Hoffmann",
    category: "Recipes",
    summary: "A remarkably clean, sweet French press with minimal sediment using settle-and-skim.",
    source: { name: "James Hoffmann", url: "https://youtu.be/st571DYYTR8", embed: "youtube" },
    meta: { ratio: "60 g/L", dose: "30 g", water: "500 ml", grind: "medium", temp: "freshly boiled, clean, soft water" },
    steps: [
      "Grind 30 g of coffee at a medium grind.",
      "Put coffee into the French press first, then add 500 ml freshly boiled, clean, soft water.",
      "Mix and make sure no dry coffee remains.",
      "Steep for 4:00.",
      "Mix a bit, then remove all the floaty bits and foam.",
      "Leave for at least 5:00 more minutes.",
      "Put on the mesh filter and press it until it barely touches the surface (not completely down!).",
      "Carefully pour out the coffee without disturbing the bed at the bottom.",
      "Enjoy!"
    ],
    updatedOn: TODAY_ISO,
    changelog: [{ date: TODAY_ISO, change: "Initial addition." }]
  },
  {
    id: "iced-clever-hoffmann",
    title: "Iced coffee (Clever Dripper) — James Hoffmann",
    category: "Recipes",
    summary: "A dependable iced coffee workflow using hot brew over ice with the Clever.",
    source: { name: "James Hoffmann", url: "https://youtu.be/8uGGeV8A-BM", embed: "youtube" },
    meta: { dose: "37.5 g", grind: "finer than pourover (not espresso-fine)", water: "330 g", ice: "170 g (from freezer)", temp: "freshly boiled, clean, soft water" },
    steps: [
      "Preheat your brewer.",
      "Grind 37.5 g of coffee, finer than pourover (but not close to espresso fine).",
      "Add 330 g freshly boiled, clean, soft water then your coffee.",
      "Make sure all the coffee is mixed with the water and no dry pockets remain.",
      "Steep for ≥ 5:00 (or 4:00 for darker roasts).",
      "Place 170 g of ice straight from the freezer into a carafe.",
      "Strain the coffee onto the ice.",
      "Once the brewer has drawn down and finished, stir in any remaining ice.",
      "Serve over ice and enjoy!"
    ],
    updatedOn: TODAY_ISO,
    changelog: [{ date: TODAY_ISO, change: "Initial addition." }]
  },
  {
    id: "v60-hoffmann",
    title: "The Ultimate V60 Technique — James Hoffmann",
    category: "Recipes",
    summary: "A clean, fast two-pour brew with a focused bloom and a flat bed finish.",
    source: { name: "James Hoffmann", url: "https://youtu.be/AI4ynXzkSQo", embed: "youtube" },
    meta: { ratio: "60 g/L", dose: "30 g", water: "500 g total", grind: "medium-fine", temp: "higher temps help (esp. lighter roasts)" },
    steps: [
      "Grind 30 g of coffee.",
      "Rinse paper filter with water just off the boil (removes paper taste; preheats brewer).",
      "Add grounds to V60; create a well in the middle (even bloom saturation).",
      "Start timer (t = 0:00).",
      "Bloom: add 2× dose = 60 g water (avoid >3×); swirl to mix evenly.",
      "Bloom time: up to 0:45.",
      "Pour 1: aim for 60% total = 300 g by 1:15 (add ~240 g in ~30 s ≈ 8 g/s).",
      "Pour 2: aim for 100% total = 500 g by 1:45 (add ~200 g in ~30 s ≈ 6.66 g/s).",
      "Stir 1× clockwise + 1× anticlockwise (knocks grounds off sidewall).",
      "Allow V60 to drain a little; gentle swirl for a flat bed.",
      "Drawdown target: finish by ~3:30.",
      "Enjoy!"
    ],
    updatedOn: TODAY_ISO,
    changelog: [{ date: TODAY_ISO, change: "Initial addition." }]
  },
  {
    id: "aeropress-hedrick",
    title: "AeroPress — Lance Hedrick",
    category: "Recipes",
    summary: "Roast-adjusted ratios and temps with gentle pressing and minimal bypass.",
    source: { name: "Lance Hedrick", url: "https://youtu.be/CafyJ2p0Bgs", embed: "youtube" },
    meta: { ratio: "60 g/L (light), 64 g/L (medium), 68 g/L (dark)", grind: "medium-fine (coarser if older/more processed)", temp: "92°C (light), 88°C (medium), 84°C (dark)" },
    steps: [
      "Put in the coffee and level it.",
      "Slowly add 2–3 g water per g coffee (e.g., 30–45 g for 15 g coffee), then swirl to saturate the grounds.",
      "Steep for 0:45.",
      "Add the rest of the water, add the plunger, and swirl again.",
      "Wait until 2:00.",
      "Press gently (avoid channeling or bypass through the paper filter).",
      "Stop before you touch the coffee bed or hear a hiss.",
      "Enjoy."
    ],
    updatedOn: TODAY_ISO,
    changelog: [{ date: TODAY_ISO, change: "Initial addition." }]
  },
  {
    id: "machine-care-hoffmann",
    title: "Machine Care — James Hoffmann",
    category: "Cleaning & Maintenance",
    summary: "How to care for your machine and keep it and your coffee tasting clean.",
    source: { name: "James Hoffmann", url: "https://youtu.be/Bl7kuC1IQ-g", embed: "youtube" },
    meta: { },
    steps: [
    ],
    updatedOn: TODAY_ISO,
    changelog: [{ date: TODAY_ISO, change: "Initial addition." }]
  },
  {
    id: "milk-steaming-bryant",
    title: "Milk Steaming — Emilee Bryant",
    category: "Milk & Steaming",
    summary: "A beginner-friendly guide to milk steaming with a focus on overall technique and consistency.",
    source: { name: "Emilee Bryant", url: "https://youtu.be/SswxZZlgEyg", embed: "youtube" },
    meta: { },
    steps: [
    ],
    updatedOn: TODAY_ISO,
    changelog: [{ date: TODAY_ISO, change: "Initial addition." }]
  },
  {
    id: "milk-steaming-hedrick",
    title: "Milk Steaming — Lance Hedrick",
    category: "Milk & Steaming",
    summary: "Milk steaming techniques for creating perfect consistancy and micro-foamed milk.",
    source: { name: "Lance Hedrick", url: "https://youtu.be/gTC3dJvwgUI", embed: "youtube" },
    meta: { },
    steps: [
    ],
    updatedOn: TODAY_ISO,
    changelog: [{ date: TODAY_ISO, change: "Initial addition." }]
  },
  {
    id: "flow-and-pressure-hedrick",
    title: "Flow and Pressure in Espresso — Lance Hedrick",
    category: "Understanding Methods",
    summary: "Learn about flow and pressure in espresso, how they interact, and how to use them properly.",
    source: { name: "Lance Hedrick", url: "https://youtu.be/d829iUgM8aw", embed: "youtube" },
    meta: { },
    steps: [
    ],
    updatedOn: TODAY_ISO,
    changelog: [{ date: TODAY_ISO, change: "Initial addition." }]
  },
  {
    id: "dialing-in-espresso-hedrick",
    title: "Dialing in Espresso — Lance Hedrick",
    category: "Understanding Methods",
    summary: "Learn how to dial espresso in by taste and how to finetune it.",
    source: { name: "Lance Hedrick", url: "https://youtu.be/j-Hu4hF5PTM", embed: "youtube" },
    meta: { },
    steps: [
    ],
    updatedOn: TODAY_ISO,
    changelog: [{ date: TODAY_ISO, change: "Initial addition." }]
  },
  {
    id: "fixing-bad-shots-hedrick",
    title: "Fixing Bad Shots — Lance Hedrick",
    category: "Understanding Methods",
    summary: "Learn how to fix bad espresso shots by understanding the cause and how to prevent them.",
    source: { name: "Lance Hedrick", url: "https://youtu.be/dZh8sjfKegw", embed: "youtube" },
    meta: { },
    steps: [
    ],
    updatedOn: TODAY_ISO,
    changelog: [{ date: TODAY_ISO, change: "Initial addition." }]
  },
  {
    id: "espresso-baskets-hedrick",
    title: "Espresso Baskets — Lance Hedrick",
    category: "Equipment",
    summary: "Learn about different espresso baskets and if they are worth it.",
    source: { name: "Lance Hedrick", url: "https://youtu.be/JzmGNwyN0MI", embed: "youtube" },
    meta: { },
    steps: [
    ],
    updatedOn: TODAY_ISO,
    changelog: [{ date: TODAY_ISO, change: "Initial addition." }]
  },
  {
    id: "tampers-hedrick",
    title: "Tampers — Lance Hedrick",
    category: "Equipment",
    summary: "Learn about different tampers and their differences.",
    source: { name: "Lance Hedrick", url: "https://youtu.be/tifwe68kUv8", embed: "youtube" },
    meta: { },
    steps: [
    ],
    updatedOn: TODAY_ISO,
    changelog: [{ date: TODAY_ISO, change: "Initial addition." }]
  },
  {
    id: "burrs-hedrick",
    title: "Conical vs Flat Burrs — Lance Hedrick",
    category: "Equipment",
    summary: "Learn about the differences between conical and flat burrs and how they affect taste, texture and more.",
    source: { name: "Lance Hedrick", url: "https://youtu.be/me-Q1M3NZNU", embed: "youtube" },
    meta: { },
    steps: [
    ],
    updatedOn: TODAY_ISO,
    changelog: [{ date: TODAY_ISO, change: "Initial addition." }]
  }
];

// Placeholder groups ensure category sections appear even with no guides yet
export const PLACEHOLDER_SECTIONS = [
  { category: "Recipes", description: "Signature drinks and repeatable formulas." },
  { category: "Milk & Steaming", description: "Foundations and techniques for consistent, silky milk." },
  { category: "Understanding Methods", description: "Learn about different brewing methods and their characteristics." },
  { category: "Cleaning & Maintenance", description: "Care and maintenance to keep gear tasting clean." },
  { category: "Equipment", description: "Learn about different equipment and how to use them." },
  { category: "Other", description: "Miscellaneous, but useful references." }
];

