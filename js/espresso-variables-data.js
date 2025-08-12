// ============================================================================
// ESPRESSO VARIABLES DATA (RESTORED)
// ============================================================================

// Tailwind-driven classes for node styling
const nodeTypes = {
  input: 'bg-accent text-white',
  output: 'bg-tertiary text-white',
  selected: 'bg-accent/50 text-white'
};

// Core dataset of variables and relationships
const espressoVariablesData = {
  'Grind Size': {
    name: 'Grind Size',
    type: 'input',
    definition:
      'Primary control of resistance through the puck. Finer grinds increase contact area and resistance → slower flow and deeper extraction; coarser grinds do the opposite. This is the most sensitive dial for shifting acidity ↔ bitterness.',
    affects: ['Flow Rate', 'Time', 'Extraction Yield', 'Shot Strength', 'Flavor Balance'],
    ifTooFine: 'Flow chokes, shot runs long or stalls; greater risk of channeling, harsh bitterness and dryness.',
    ifTooCoarse: 'Flow races, time is short; under‑extracted flavors dominate (sour, salty, thin).'
  },
  Dose: {
    name: 'Dose',
    type: 'input',
    definition:
      'How much ground coffee is in the basket. Higher doses increase available solubles and body, but crowd the basket and can impede even flow; lower doses do the reverse and lighten texture.',
    affects: ['Shot Strength', 'Extraction Yield', 'Tactile Sensation', 'Flavor Balance', 'Flow Rate'],
    ifTooHigh: 'Basket overfilled; puck is dense → slow or uneven flow, elevated bitterness/astringency.',
    ifTooLow: 'Puck too thin; easy flow → weak body, watery texture, tendency toward sourness.'
  },
  Yield: {
    name: 'Yield',
    type: 'output',
    definition:
      'Liquid mass/volume in the cup. Larger yields dilute concentration and can pull more late‑stage bitters; smaller yields intensify body and acids. Yield is the lever for concentration and balance.',
    affects: ['Shot Strength', 'Extraction Yield', 'Tactile Sensation', 'Flavor Balance'],
    ifTooHigh: 'Over‑diluted; flavors wash out and bitter/woody notes creep in.',
    ifTooLow: 'Overly concentrated; shot tastes sharp/salty or dusty, lacking sweetness.'
  },
  Time: {
    name: 'Time',
    type: 'output',
    definition:
      'Brew duration is a diagnostic of puck resistance and flow. Adjust grind/dose/prep to move time rather than chasing time directly.',
    affects: ['Yield', 'Extraction Yield', 'Flavor Balance'],
    ifTooLong: 'Likely high resistance; risk of drying bitterness and hollow aftertaste.',
    ifTooShort: 'Likely low resistance; under‑extracted acids dominate and sweetness is low.'
  },
  Pressure: {
    name: 'Pressure',
    type: 'input',
    definition:
      'Force pushing water through the puck. Within normal ranges it shapes how water finds paths: too high on tight pucks promotes channeling; too low may not develop body.',
    affects: ['Flow Rate', 'Extraction Yield', 'Tactile Sensation'],
    ifTooHigh: 'Jetting and channeling; harsh spikes of bitterness with uneven body.',
    ifTooLow: 'Sluggish extraction of solubles; flat body and weak sweetness.'
  },
  Temperature: {
    name: 'Temperature',
    type: 'input',
    definition:
      'Thermal energy driving extraction kinetics. Higher temps accelerate extraction (more bitters and deeper roast notes); lower temps preserve acidity and clarity but risk sourness.',
    affects: ['Extraction Yield', 'Flavor Balance'],
    ifTooHigh: 'Roasty, bitter, ashy notes; dries out finish.',
    ifTooLow: 'Sour/metallic edge, lack of sweetness; under‑developed flavors.'
  },
  'Flow Rate': {
    name: 'Flow Rate',
    type: 'output',
    definition:
      'How quickly liquid moves through the puck. Fast flow means less contact and lighter extraction; slow flow increases contact and draws more bitters. Flow reflects grind, dose and prep.',
    affects: ['Time', 'Yield', 'Extraction Yield', 'Tactile Sensation'],
    ifTooFast: 'Watery texture, low sweetness; sour/salty and thin finish.',
    ifTooSlow: 'Harsh bitterness, chalky/dry finish; body feels heavy but dull.'
  },
  'Shot Strength': {
    name: 'Shot Strength',
    type: 'output',
    definition:
      'Concentration (TDS) perceived as intensity. Stronger shots feel bolder and heavier; weaker shots are lighter and can read clearer but less satisfying.',
    affects: ['Tactile Sensation', 'Flavor Balance'],
    ifTooHigh: 'Overbearing intensity, muted nuance; may skew bitter.',
    ifTooLow: 'Watery and dilute; flavors fade quickly.'
  },
  'Extraction Yield': {
    name: 'Extraction Yield',
    type: 'output',
    definition:
      'Percent of coffee mass dissolved into the beverage. Typical palatable range ~18–22% depending on roast and recipe.',
    affects: ['Shot Strength', 'Flavor Balance'],
    ifTooHigh: 'Drying bitterness/astringency, hollow finish.',
    ifTooLow: 'Sourness, salty edge, grassiness; sweetness underdeveloped.'
  },
  'Tactile Sensation': {
    name: 'Tactile Sensation',
    type: 'output',
    definition:
      'Perceived body and mouthfeel (creamy, syrupy, silky, thin). Influenced by dose, yield, flow and fines migration.',
    affects: ['Flavor Balance'],
    ifTooThick: 'Syrupy and heavy; sticky finish, muted brightness.',
    ifTooThin: 'Watery and hollow; lacks texture and persistence.'
  },
  'Flavor Balance': {
    name: 'Flavor Balance',
    type: 'output',
    definition:
      'The final harmony of acidity, sweetness and bitterness. It emerges from the combined effects of grind, dose, pressure, temperature, flow, time and yield.'
  }
};

// Connections between variables (affects → affected)
const connections = [
  // Inputs to flow diagnostics and results
  { from: 'Grind Size', to: 'Flow Rate' },
  { from: 'Grind Size', to: 'Time' },
  { from: 'Grind Size', to: 'Extraction Yield' },
  { from: 'Grind Size', to: 'Shot Strength' },
  { from: 'Grind Size', to: 'Flavor Balance' },

  { from: 'Dose', to: 'Shot Strength' },
  { from: 'Dose', to: 'Extraction Yield' },
  { from: 'Dose', to: 'Tactile Sensation' },
  { from: 'Dose', to: 'Flavor Balance' },
  { from: 'Dose', to: 'Flow Rate' },

  { from: 'Pressure', to: 'Flow Rate' },
  { from: 'Pressure', to: 'Extraction Yield' },
  { from: 'Pressure', to: 'Tactile Sensation' },

  { from: 'Temperature', to: 'Extraction Yield' },
  { from: 'Temperature', to: 'Flavor Balance' },

  // Flow variables interrelations
  { from: 'Flow Rate', to: 'Time' },
  { from: 'Flow Rate', to: 'Yield' },
  { from: 'Flow Rate', to: 'Extraction Yield' },
  { from: 'Flow Rate', to: 'Tactile Sensation' },

  { from: 'Time', to: 'Yield' },
  { from: 'Time', to: 'Extraction Yield' },
  { from: 'Time', to: 'Flavor Balance' },

  { from: 'Yield', to: 'Shot Strength' },
  { from: 'Yield', to: 'Extraction Yield' },
  { from: 'Yield', to: 'Tactile Sensation' },
  { from: 'Yield', to: 'Flavor Balance' },

  // Second row to final
  { from: 'Extraction Yield', to: 'Shot Strength' },
  { from: 'Extraction Yield', to: 'Flavor Balance' },
  { from: 'Shot Strength', to: 'Tactile Sensation' },
  { from: 'Shot Strength', to: 'Flavor Balance' },
  { from: 'Tactile Sensation', to: 'Flavor Balance' }
];

// Mobile layout positions (percentages)
const mobilePositions = {
  'Grind Size': { x: 20, y: 20 },
  Dose: { x: 50, y: 20 },
  Pressure: { x: 80, y: 20 },
  Temperature: { x: 20, y: 35 },
  'Flow Rate': { x: 50, y: 35 },
  Time: { x: 80, y: 35 },
  Yield: { x: 50, y: 50 },
  'Extraction Yield': { x: 25, y: 65 },
  'Shot Strength': { x: 50, y: 65 },
  'Tactile Sensation': { x: 75, y: 65 },
  'Flavor Balance': { x: 50, y: 80 }
};

// Desktop default layout positions
const desktopPositions = {
  'Grind Size': { x: 20, y: 10 },
  Dose: { x: 40, y: 10 },
  Pressure: { x: 60, y: 10 },
  Temperature: { x: 80, y: 10 },
  'Flow Rate': { x: 30, y: 35 },
  Time: { x: 50, y: 35 },
  Yield: { x: 70, y: 35 },
  'Extraction Yield': { x: 25, y: 60 },
  'Shot Strength': { x: 50, y: 60 },
  'Tactile Sensation': { x: 75, y: 60 },
  'Flavor Balance': { x: 50, y: 85 }
};

// Radial layout (Flavor Balance centered)
const radialPositions = (() => {
  const center = { x: 50, y: 50 };
  const radius = 32;
  const names = [
    'Grind Size',
    'Dose',
    'Pressure',
    'Temperature',
    'Flow Rate',
    'Time',
    'Yield',
    'Extraction Yield',
    'Shot Strength',
    'Tactile Sensation'
  ];
  const coords = {};
  const toXY = deg => ({
    x: center.x + radius * Math.cos((deg * Math.PI) / 180),
    y: center.y + radius * Math.sin((deg * Math.PI) / 180)
  });
  const step = 360 / names.length;
  names.forEach((name, idx) => {
    const p = toXY(-90 + step * idx);
    coords[name] = { x: Math.round(p.x), y: Math.round(p.y) };
  });
  coords['Flavor Balance'] = { x: center.x, y: center.y };
  return coords;
})();

// Flow layout (left ➜ right, staged columns)
const flowPositions = {
  // Stage 1: Setup/Controls
  'Grind Size': { x: 15, y: 20 },
  Dose: { x: 15, y: 40 },
  Pressure: { x: 15, y: 60 },
  Temperature: { x: 15, y: 80 },

  // Stage 2: Process diagnostics
  'Flow Rate': { x: 40, y: 35 },
  Time: { x: 40, y: 65 },

  // Stage 3: Results
  'Extraction Yield': { x: 60, y: 30 },
  Yield: { x: 60, y: 50 },
  'Shot Strength': { x: 60, y: 70 },

  // Stage 4: Sensory/Outcome (slight vertical offset to avoid overlap)
  'Tactile Sensation': { x: 80, y: 62 },
  'Flavor Balance': { x: 90, y: 42 }
};

// Grid layout (alphabetical-ish fill across a 4x3 grid)
const gridPositions = {
  'Grind Size': { x: 15, y: 20 },
  Dose: { x: 40, y: 20 },
  Pressure: { x: 65, y: 20 },
  Temperature: { x: 85, y: 20 },
  'Flow Rate': { x: 15, y: 45 },
  Time: { x: 40, y: 45 },
  Yield: { x: 65, y: 45 },
  'Shot Strength': { x: 85, y: 45 },
  'Extraction Yield': { x: 15, y: 70 },
  'Tactile Sensation': { x: 40, y: 70 },
  'Flavor Balance': { x: 65, y: 70 }
};

// (cluster view removed)

