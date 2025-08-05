// ============================================================================
// ESPRESSO VARIABLES DATA
// ============================================================================

// Node types for styling
const nodeTypes = {
    input: 'bg-accent text-white',
    output: 'bg-main text-white',
    selected: 'bg-accent/50 text-white'
};

// Espresso variables data structure
const espressoVariablesData = {
    "Grind Size": {
        name: "Grind Size",
        type: "input",
        definition: "Controls puck resistance; finer = slower flow, higher extraction. Coarser = faster flow, lower extraction. Strongly affects acidity vs bitterness.",
        affects: ["Flow Rate", "Time", "Extraction Yield", "Shot Strength", "Flavor Balance"],
        ifTooFine: "Can cause channeling, bitter taste, and very slow shots",
        ifTooCoarse: "Results in weak, sour shots with fast flow",
        position: { x: 50, y: 20 }
    },
    "Dose": {
        name: "Dose",
        type: "input",
        definition: "More dose = more solubles, thicker body, stronger shot. Can hinder even extraction if overdosed.",
        affects: ["Shot Strength", "Extraction Yield", "Tactile Sensation", "Flavor Balance"],
        ifTooHigh: "Can cause uneven extraction and bitter taste",
        ifTooLow: "Results in weak, under-extracted shots",
        position: { x: 20, y: 40 }
    },
    "Yield": {
        name: "Yield",
        type: "output",
        definition: "Controls dilution, concentration and flavor balance. Larger yields = milder, sweeter, possibly more bitter. Lower yields = more intense, possibly muddier or sour/salty.",
        affects: ["Shot Strength", "Extraction Yield", "Tactile Sensation", "Flavor Balance"],
        ifTooHigh: "Can lead to over-extraction and bitterness",
        ifTooLow: "Results in under-extraction and sourness",
        position: { x: 80, y: 40 }
    },
    "Time": {
        name: "Time",
        type: "output",
        definition: "Determines nothing on its own, but is a diagnostic for what grind size, flow rate, pressure and dose are doing.",
        affects: ["Yield", "Extraction Yield", "Flavor Balance"],
        ifTooLong: "Can cause over-extraction and bitterness",
        ifTooShort: "Results in under-extraction and sourness",
        position: { x: 35, y: 60 }
    },
    "Pressure": {
        name: "Pressure",
        type: "input",
        definition: "Drives water through puck. Higher pressure can help extraction or choke puck if grind is too fine.",
        affects: ["Flow Rate", "Extraction Yield", "Tactile Sensation"],
        ifTooHigh: "Can cause channeling and uneven extraction",
        ifTooLow: "Results in weak, under-extracted shots",
        position: { x: 65, y: 60 }
    },
    "Temperature": {
        name: "Temperature",
        type: "input",
        definition: "Higher temps extract more quickly and deeply (can lead to bitterness). Lower temps preserve acidity (risk of underextraction).",
        affects: ["Extraction Yield", "Flavor Balance"],
        ifTooHigh: "Can cause bitter, burnt flavors",
        ifTooLow: "Results in sour, under-extracted flavors",
        position: { x: 50, y: 80 }
    },
    "Flow Rate": {
        name: "Flow Rate",
        type: "output",
        definition: "Fast = less contact, risk of sourness. Slow = risk of choking, bitterness. Depends heavily on puck prep.",
        affects: ["Time", "Yield", "Extraction Yield", "Tactile Sensation"],
        ifTooFast: "Indicates under-extraction, sour taste",
        ifTooSlow: "Indicates over-extraction, bitter taste",
        position: { x: 20, y: 20 }
    },
    "Shot Strength": {
        name: "Shot Strength",
        type: "output",
        definition: "Higher TDS = bolder taste, more texture. Lower = weaker but can enhance clarity.",
        affects: ["Tactile Sensation", "Flavor Balance"],
        ifTooHigh: "Can taste harsh and overwhelming",
        ifTooLow: "Can taste weak and watery",
        position: { x: 80, y: 20 }
    },
    "Extraction Yield": {
        name: "Extraction Yield",
        type: "output",
        definition: "Total % of soluble material extracted. Ideal range ~18–22%. Too low = sour; too high = bitter/dry.",
        affects: ["Shot Strength", "Flavor Balance"],
        ifTooHigh: "Results in bitter, astringent flavors",
        ifTooLow: "Results in sour, acidic flavors",
        position: { x: 50, y: 10 }
    },
    "Tactile Sensation": {
        name: "Tactile Sensation",
        type: "output",
        definition: "Perceived body/mouthfeel (creamy, silky, thin, etc.). Stronger shots = fuller body.",
        affects: ["Flavor Balance"],
        ifTooThick: "Can feel syrupy and overwhelming",
        ifTooThin: "Can feel watery and weak",
        position: { x: 10, y: 60 }
    },
    "Flavor Balance": {
        name: "Flavor Balance",
        type: "output",
        definition: "Final result of all variables. A balance of acidity, sweetness, bitterness. Sensitive to all upstream changes.",
        affects: [],
        ifTooBitter: "Can taste harsh and overwhelming",
        ifTooSour: "Can taste sharp and unpleasant",
        position: { x: 90, y: 60 }
    }
};

// Connection data - defines relationships between nodes
const connections = [
    // Input variables (controlled by barista)
    { from: "Grind Size", to: "Flow Rate", type: "direct" },
    { from: "Grind Size", to: "Time", type: "direct" },
    { from: "Grind Size", to: "Extraction Yield", type: "direct" },
    { from: "Grind Size", to: "Shot Strength", type: "direct" },
    { from: "Grind Size", to: "Flavor Balance", type: "direct" },
    
    { from: "Dose", to: "Shot Strength", type: "direct" },
    { from: "Dose", to: "Extraction Yield", type: "direct" },
    { from: "Dose", to: "Tactile Sensation", type: "direct" },
    { from: "Dose", to: "Flavor Balance", type: "direct" },
    
    { from: "Pressure", to: "Flow Rate", type: "direct" },
    { from: "Pressure", to: "Extraction Yield", type: "direct" },
    { from: "Pressure", to: "Tactile Sensation", type: "direct" },
    
    { from: "Temperature", to: "Extraction Yield", type: "direct" },
    { from: "Temperature", to: "Flavor Balance", type: "direct" },
    
    // Output variables (results/measurements)
    { from: "Flow Rate", to: "Time", type: "direct" },
    { from: "Flow Rate", to: "Yield", type: "direct" },
    { from: "Flow Rate", to: "Extraction Yield", type: "direct" },
    { from: "Flow Rate", to: "Tactile Sensation", type: "direct" },
    
    { from: "Time", to: "Yield", type: "direct" },
    { from: "Time", to: "Extraction Yield", type: "direct" },
    { from: "Time", to: "Flavor Balance", type: "direct" },
    
    { from: "Yield", to: "Shot Strength", type: "direct" },
    { from: "Yield", to: "Extraction Yield", type: "direct" },
    { from: "Yield", to: "Tactile Sensation", type: "direct" },
    { from: "Yield", to: "Flavor Balance", type: "direct" },
    
    { from: "Shot Strength", to: "Tactile Sensation", type: "direct" },
    { from: "Shot Strength", to: "Flavor Balance", type: "direct" },
    
    { from: "Extraction Yield", to: "Shot Strength", type: "direct" },
    { from: "Extraction Yield", to: "Flavor Balance", type: "direct" },
    
    { from: "Tactile Sensation", to: "Flavor Balance", type: "direct" }
];

// Mobile-friendly layout positions (percentage-based) - Optimized for connection visibility
const mobilePositions = {
    // Input variables (top section)
    "Grind Size": { x: 25, y: 10 },
    "Dose": { x: 50, y: 10 },
    "Pressure": { x: 75, y: 10 },
    "Temperature": { x: 50, y: 25 },
    
    // Primary flow variables (middle section)
    "Flow Rate": { x: 20, y: 40 },
    "Time": { x: 50, y: 40 },
    "Yield": { x: 80, y: 40 },
    
    // Extraction and strength variables
    "Extraction Yield": { x: 25, y: 60 },
    "Shot Strength": { x: 50, y: 60 },
    "Tactile Sensation": { x: 75, y: 60 },
    
    // Final result
    "Flavor Balance": { x: 50, y: 80 }
};

// Desktop layout positions (percentage-based) - Optimized for connection visibility
const desktopPositions = {
    // Input variables (top row - what the barista controls)
    "Grind Size": { x: 20, y: 10 },
    "Dose": { x: 40, y: 10 },
    "Pressure": { x: 60, y: 10 },
    "Temperature": { x: 80, y: 10 },
    
    // Primary flow variables (middle section)
    "Flow Rate": { x: 30, y: 35 },
    "Time": { x: 50, y: 35 },
    "Yield": { x: 70, y: 35 },
    
    // Extraction and strength variables
    "Extraction Yield": { x: 25, y: 60 },
    "Shot Strength": { x: 50, y: 60 },
    "Tactile Sensation": { x: 75, y: 60 },
    
    // Final result
    "Flavor Balance": { x: 50, y: 85 }
}; 