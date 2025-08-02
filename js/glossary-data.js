// ============================================================================
// GLOSSARY DATA
// ============================================================================

// Category colors
const categoryColors = {
    espresso: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    brewing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    equipment: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    grinding: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    roasting: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    processing: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    botany: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    flavor: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    evaluation: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    sourcing: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
};

// Glossary data
const glossaryData = {
    "9 Bar": {
        "definition": "The traditional brew pressure used in espresso machines. Equivalent to 9 times atmospheric pressure and often referenced in \"9-bar flat\" extractions.",
        "categories": ["espresso", "equipment"]
    },
    "9 Bar Flat": {
        "definition": "A classic espresso profile where pressure stays constant at 9 bar throughout the shot. Effective for traditional espresso, but less flexible than profiling methods.",
        "categories": ["espresso"]
    },
    "Acidity": {
        "definition": "A desirable trait in specialty coffee, often perceived as brightness or liveliness. Can resemble citrus, malic (apple), tartaric (grape) or phosphoric (sparkling) acidity. Not to be confused with sourness.",
        "categories": ["flavor", "evaluation"]
    },
    "Aerobic fermentation": {
        "definition": "Fermentation that occurs in the presence of oxygen — typically used in traditional washed and honey processes.",
        "categories": ["processing"]
    },
    "Aftertaste": {
        "definition": "The lingering flavor or sensation left after swallowing. Can be clean, sweet, dry or bitter.",
        "categories": ["flavor", "evaluation"]
    },
    "Agitation": {
        "definition": "Any movement during brewing that disturbs the coffee bed — includes stirring, swirling or pouring techniques.",
        "categories": ["brewing"]
    },
    "Alignment": {
        "definition": "The precise calibration of burrs to ensure even particle size distribution. Misalignment can cause uneven extraction.",
        "categories": ["grinding", "equipment"]
    },
    "Anaerobic fermentation": {
        "definition": "A controlled fermentation environment without oxygen, often in sealed tanks. Leads to more exotic, intense flavors.",
        "categories": ["processing"]
    },
    "Arabica": {
        "definition": "Coffea arabica — the dominant species in specialty coffee. Known for its complex flavors, lower caffeine and high-altitude cultivation.",
        "categories": ["botany"]
    },
    "Altitude / MASL": {
        "definition": "Meters Above Sea Level. Impacts bean density and flavor development — higher altitudes often = more complex flavors.",
        "categories": ["sourcing", "botany"]
    },
    "Balance": {
        "definition": "A harmonious interplay of acidity, sweetness and bitterness in the cup. Indicates a well-structured flavor profile.",
        "categories": ["flavor", "evaluation"]
    },
    "Baked (roast defect)": {
        "definition": "A roast defect caused by excessive time in the roaster at low temperatures. Results in flat, muted flavors, low acidity and a papery or \"stale\" aftertaste.",
        "categories": ["roasting", "flavor"]
    },
    "Basket": {
        "definition": "The metal insert in a portafilter that holds the coffee grounds. Basket size, shape and precision all affect flow, resistance and extraction.",
        "categories": ["espresso", "equipment"]
    },
    "Blind Shaker": {
        "definition": "A container used to shake and declump coffee grounds. Helps with even distribution and static reduction.",
        "categories": ["equipment"]
    },
    "Bloom": {
        "definition": "The initial phase of brewing where hot water hits dry grounds, releasing CO₂ and expanding the coffee bed. Affects flow and extraction.",
        "categories": ["brewing", "espresso"]
    },
    "Body": {
        "definition": "The tactile weight or texture of a coffee in the mouth. Can feel light like tea, creamy like milk or thick and syrupy like honey.",
        "categories": ["flavor", "evaluation"]
    },
    "Bourbon": {
        "definition": "A foundational Arabica variety known for sweetness and balance. Parent to many modern hybrids.",
        "categories": ["botany"]
    },
    "Brew Ratio": {
        "definition": "Another term for ratio — the proportion of coffee in vs. espresso out. Usually written like 1:2 or 1:3. Impacts strength, balance and extraction.",
        "categories": ["espresso", "brewing"]
    },
    "Brix": {
        "definition": "A measure of sugar concentration, often used to determine cherry ripeness before harvesting.",
        "categories": ["processing", "evaluation"]
    },
    "Burrs": {
        "definition": "The grinding elements inside a grinder. Can be flat or conical and vary in material and geometry. Their sharpness and alignment affect consistency and retention.",
        "categories": ["grinding", "equipment"]
    },
    "Carbonic maceration": {
        "definition": "A fermentation method borrowed from winemaking, where whole cherries are sealed in a CO₂-rich environment. Produces vibrant, wine-like flavors.",
        "categories": ["processing"]
    },
    "Castillo": {
        "definition": "A disease-resistant variety developed in Colombia. Known for productivity and variable cup quality depending on altitude and care.",
        "categories": ["botany"]
    },
    "Caturra": {
        "definition": "A dwarf mutation of Bourbon, common in Latin America. Shorter stature allows dense planting; known for balanced, clean cups.",
        "categories": ["botany"]
    },
    "Catuai": {
        "definition": "A hybrid of Mundo Novo and Caturra. Compact, productive and widely grown. Tends to have balanced flavor.",
        "categories": ["botany"]
    },
    "Channeling": {
        "definition": "When water finds weak or uneven paths through the puck, bypassing some grounds and over extracting others. Causes spurting, uneven flow and inconsistent flavor. Often visible with bottomless portafilters as streams, jets or \"tiger stripes.\"",
        "categories": ["espresso", "brewing"]
    },
    "Charge": {
        "definition": "Another term for the act of adding green coffee to the roaster (i.e., \"charge the drum\").",
        "categories": ["roasting"]
    },
    "Charging": {
        "definition": "The moment green coffee is added to the roaster. It marks the start of the roast and affects how quickly heat transfers into the beans. Charge temperature — the roaster’s temp at this point — sets the tone for the entire profile.",
        "categories": ["roasting"]
    },
    "Charge Temperature": {
        "definition": "The initial temperature of the roaster when green coffee is added. Affects how quickly the roast progresses and how energy transfers into the bean.",
        "categories": ["roasting"]
    },
    "Chaff": {
        "definition": "The thin, papery layer on a coffee bean that comes off during roasting.",
        "categories": ["roasting"]
    },
    "Clarity": {
        "definition": "A flavor attribute in espresso that refers to distinct separation of notes. Opposite of muddiness or excessive body.",
        "categories": ["flavor", "evaluation"]
    },
    "Clean cup": {
        "definition": "A sensory term indicating the absence of defects or off-flavors. Often associated with washed coffees.",
        "categories": ["flavor", "evaluation"]
    },
    "Contact Time": {
        "definition": "The total time water and coffee are in contact. Influences extraction — longer = more extracted (to a point).",
        "categories": ["brewing", "espresso"]
    },
    "Cooperative": {
        "definition": "A collective of smallholder farmers who process, market and sell coffee together. Often the structure behind traceable lots.",
        "categories": ["sourcing"]
    },
    "Crema": {
        "definition": "The golden-brown foam on top of an espresso shot. Made of emulsified oils and CO₂ bubbles. Not a sign of quality on its own.",
        "categories": ["espresso", "flavor"]
    },
    "Cupping": {
        "definition": "The standardized method for evaluating coffee aroma and flavor. Used by producers, roasters and tasters.",
        "categories": ["evaluation"]
    },
    "Cupping Score": {
        "definition": "The final numeric value assigned during sensory evaluation, usually out of 100. Coffees scoring 80+ are considered specialty.",
        "categories": ["evaluation", "sourcing"]
    },
    "Decent": {
        "definition": "Short for the Decent DE1 espresso machine, a premium home unit with full digital control over flow, pressure and temperature — popular for profiling.",
        "categories": ["espresso", "equipment"]
    },
    "Density": {
        "definition": "A measure of how compact the bean is. Denser beans (often from higher altitudes) usually develop more flavor and roast differently.",
        "categories": ["botany", "roasting"]
    },
    "Development Time Ratio (DTR    )": {
        "definition": "The percentage of total roast time spent after first crack. Affects sweetness and balance.",
        "categories": ["roasting"]
    },
    "Direct trade": {
        "definition": "A sourcing model where roasters buy directly from producers, aiming for better quality, transparency and prices than traditional models or certifications.",
        "categories": ["sourcing"]
    },
    "Donut Extraction": {
        "definition": "A visual effect where coffee extracts more around the edges of the puck than in the center. Sometimes mistaken for channeling, but usually not a problem.",
        "categories": ["espresso"]
    },
    "Dose": {
        "definition": "The weight of dry ground coffee used to brew coffee.",
        "categories": ["brewing", "espresso"]
    },
    "Distribution": {
        "definition": "The act of spreading coffee grounds evenly. Crucial for even water flow and consistent extraction.",
        "categories": ["espresso"]
    },
    "Drawdown Time": {
        "definition": "The total time it takes for water to pass through the coffee in pour-over or batch brews. Affects strength and extraction.",
        "categories": ["brewing"]
    },
    "Drying bed": {
        "definition": "A mesh drying platform that allows air to flow above and below the coffee. Common in specialty processing for even, clean drying.",
        "category": "processing"
    },
    "E61": {
        "definition": "A classic grouphead design introduced by Faema in 1961. Known for thermal mass and passive preinfusion. Common on many prosumer machines.",
        "categories": ["espresso", "equipment"]
    },
    "Espresso": {
        "definition": "A brewing method that uses pressure (traditionally ~9 bar) to force hot water through finely ground coffee, resulting in a small, concentrated shot.",
        "categories": ["espresso", "brewing"]
    },
    "Espresso Machine": {
        "definition": "A device designed to brew espresso using heat, pressure and flow control. Can be manual, semi-automatic or fully programmable.",
        "categories": ["espresso", "equipment"]
    },
    "Espresso Style": {
        "definition": "Refers to the intended expression of a shot — ristretto (short), normale (classic), lungo (long), turbo, etc.",
        "categories": ["espresso"]
    },
    "Evaluation": {
        "definition": "The process of tasting and scoring coffee to determine its quality. Involves aroma, flavor, acidity, body and balance.",
        "categories": ["evaluation"]
    },
    "Extraction": {
        "definition": "The process of dissolving soluble compounds from coffee grounds into water. Good extraction balances acidity, sweetness and bitterness. Influenced by grind size, water temperature, brew time and brew ratio.",
        "categories": ["brewing", "espresso"]
    },
    "Farmgate Price": {
        "definition": "The price paid directly to the producer (vs. FOB or export price). Important in transparent sourcing.",
        "categories": ["sourcing"]
    },
    "Fermentation": {
        "definition": "A key processing step where yeast and bacteria break down sugars in the mucilage. Can be spontaneous or controlled and drastically shapes flavor.",
        "categories": ["processing"]
    },
    "Fermentation Tank": {
        "definition": "A vessel used in washed or anaerobic processes to break down mucilage. Can be plastic, concrete, steel or ceramic.",
        "categories": ["processing", "equipment"]
    },
    "Fines": {
        "definition": "Tiny coffee particles created during grinding. Can 'clog' baskets, cause uneven flow or contribute to bitterness.",
        "categories": ["grinding"]
    },
    "Finish": {
        "definition": "Synonym for aftertaste, sometimes used to describe how quickly flavors fade or evolve.",
        "categories": ["flavor", "evaluation"]
    },
    "Flavor Clarity": {
        "definition": "Describes how distinct and identifiable individual flavors are. High clarity = clean separation of notes.",
        "categories": ["flavor", "evaluation"]
    },
    "Flavor Wheel / SCA Flavor Wheel": {
        "definition": "A visual tool created by the SCA and WCR. Used to describe coffee flavors. Helps tasters find the language for what they perceive.",
        "categories": ["evaluation"]
    },
    "Flow Profiling": {
        "definition": "Controlling the rate of water flow during extraction, allowing the puck to define the pressure. Offers greater nuance and clarity than fixed-pressure brewing.",
        "categories": ["espresso"]
    },
    "Flow Rate": {
        "definition": "The speed at which water moves through the puck. Measured in grams per second. A key variable in profiling.",
        "categories": ["espresso", "brewing"]
    },
    "Flow Rate (Pouring)": {
        "definition": "In manual brews, the rate at which water is poured over the bed — different from espresso flow rate.",
        "categories": ["brewing"]
    },
    "FOB (Free on Board)": {
        "definition": "Price at which coffee leaves the port of origin — includes milling and export costs but not farmgate.",
        "categories": ["sourcing"]
    },
    "Force Tamper": {
        "definition": "A tamper with a calibrated spring that applies consistent pressure during tamping and signals when tamped enough. Reduces user error.",
        "categories": ["espresso", "equipment"]
    },
    "Gaggiuino": {
        "definition": "An open-source mod project for the Gaggia Classic that adds control over pressure, temperature and flow. Transforms a basic machine into a profiling powerhouse.",
        "categories": ["espresso", "equipment"]
    },
    "Genotype": {
        "definition": "The genetic makeup of a coffee plant. Determines potential traits but not how they express in the cup.",
        "categories": ["botany"]
    },
    "Geisha / Gesha": {
        "definition": "A high-end variety originally from Ethiopia, now cultivated in Panama and elsewhere. Known for floral, tea-like and citrusy flavors.",
        "categories": ["botany"]
    },
    "Green coffee": {
        "definition": "Unroasted coffee beans. The raw, shelf-stable form of coffee after post-harvest processing and milling, but before roasting.",
        "categories": ["processing", "roasting"]
    },
    "Grind Distribution": {
        "definition": "The spread of particle sizes produced during grinding. A narrower distribution generally leads to more even extraction.",
        "categories": ["grinding"]
    },
    "Grind Retention (Total vs Exchange)": {
        "definition": "Total is the amount left behind; exchange is how much old grinds contaminate the new dose.",
        "categories": ["grinding"]
    },
    "Grind Size": {
        "definition": "How coarse or fine the coffee is ground. Affects flow, pressure and extraction balance. The size of coffee particles after grinding. Affects how quickly flavors are extracted — finer grinds extract faster, coarser grinds slower.",
        "categories": ["grinding", "espresso", "brewing"]
    },
    "Grind Size Drift": {
        "definition": "When burrs shift slightly during use (especially manual grinders), changing size unintentionally.",
        "categories": ["grinding"]
    },
    "Grinder": {
        "definition": "The device that grinds whole beans. Affects particle size, distribution, retention and static — all of which influence espresso quality.",
        "categories": ["grinding", "equipment"]
    },
    "Grouphead": {
        "definition": "The component on an espresso machine where the portafilter locks in. Delivers water from the boiler to the puck. Its temperature and flow uniformity can impact shot quality.",
        "categories": ["espresso", "equipment"]
    },
    "Headspace": {
        "definition": "The vertical space between the top of the coffee puck and the shower screen. Affects flow and compression.",
        "categories": ["espresso"]
    },
    "Heirloom": {
        "definition": "A term often used for wild or landrace varieties in Ethiopia. Not a botanical term, but a catch-all for genetically diverse local cultivars.",
        "categories": ["botany"]
    },
    "Honey process": {
        "definition": "Also called pulped natural. Some or all mucilage is left on the bean during drying. Flavor sits between washed and natural profiles.",
        "categories": ["processing"]
    },
    "Hybrid": {
        "definition": "A cross between two coffee varieties or species, often to combine disease resistance with desirable cup quality.",
        "categories": ["botany"]
    },
    "IMS / VST / Sworksdesign": {
        "definition": "Brands that manufacture precision filter baskets. Known for tighter tolerances and improved extraction consistency.",
        "categories": ["espresso", "equipment"]
    },
    "Immersion Brewing": {
        "definition": "A brewing method where coffee steeps in water before filtration — e.g., French press or cupping.",
        "categories": ["brewing"]
    },
    "Ionizer": {
        "definition": "A component in some grinders that reduces static by neutralizing charged particles, leading to cleaner, clump-free grinds.",
        "categories": ["grinding", "equipment"]
    },
    "IUIUIU Profile": {
        "definition": "A pressure and flow profile with a low-pressure start, pause and a gentle ramp to extraction pressure. Designed for sweetness, clarity and puck integrity.",
        "categories": ["espresso"]
    },
    "Lactic fermentation": {
        "definition": "A fermentation method that encourages lactic acid bacteria, resulting in smoother, creamier cups with elevated sweetness.",
        "categories": ["processing"]
    },
    "Lot": {
        "definition": "A specific batch of coffee, often separated by day, variety or process. Defines traceability and quality tiers.",
        "categories": ["sourcing"]
    },
    "Londinium Profile": {
        "definition": "A spring-lever-style profile: short preinfusion, sharp pressure spike and a slow pressure decline. Emphasizes body and sweetness while softening the finish.",
        "categories": ["espresso"]
    },
    "Light (roast)": {
        "definition": "A roast level where beans are heated just enough to develop flavor while preserving origin characteristics. Light roasts typically have higher acidity, more complex flavors and less body than darker roasts.",
        "categories": ["roasting", "flavor"]
    },
    "Medium (roast)": {
        "definition": "A balanced roast level between light and dark. Medium roasts offer a good balance of origin characteristics and roast flavors, with moderate acidity and body.",
        "categories": ["roasting", "flavor"]
    },
    "Dark (roast)": {
        "definition": "A roast level where beans are heated to higher temperatures, developing more roast flavors and less origin character. Dark roasts typically have lower acidity, more body and flavors like chocolate, caramel or smokiness.",
        "categories": ["roasting", "flavor"]
    },
    "Maillard reaction": {
        "definition": "A chemical reaction between amino acids and sugars during roasting. Responsible for browning and complex flavors like caramel, toast or nuts.",
        "categories": ["roasting", "flavor"]
    },
    "Maragogipe": {
        "definition": "A natural mutation of Typica with very large beans. Sometimes called 'elephant beans'; cup quality varies.",
        "categories": ["botany"]
    },
    "Mechanical Dryer": {
        "definition": "A device that speeds up drying of parchment or natural coffees, often used in humid climates or high-volume mills.",
        "categories": ["processing", "equipment"]
    },
    "Micro-lot": {
        "definition": "A small, traceable batch of coffee — often separated for quality, unique processing or experimental purposes.",
        "categories": ["sourcing"]
    },
    "Monsooned coffee": {
        "definition": "Beans exposed to moist monsoon winds for weeks. Low acidity, heavy body, earthy notes.",
        "categories": ["processing"]
    },
    "Mouthfeel": {
        "definition": "The tactile sensation of coffee in the mouth — includes body, creaminess or astringency.",
        "categories": ["flavor", "evaluation"]
    },
    "Mucilage": {
        "definition": "The sticky, sugar-rich layer surrounding the coffee bean inside the cherry. It plays a key role during fermentation and processing, especially in honey and natural methods.",
        "categories": ["processing"]
    },
    "Natural process": {
        "definition": "Also called dry process. Whole cherries are dried with fruit still intact. Often produces fruity, winey or wild flavors.",
        "categories": ["processing"]
    },
    "Origin": {
        "definition": "The country or region where a coffee is grown. Origin affects flavor through climate, soil, elevation and variety.",
        "categories": ["sourcing", "botany"]
    },
    "Over-extraction": {
        "definition": "When \"too many\" solubles are pulled from the coffee, leading to bitterness, dryness and harsh flavors.",
        "categories": ["brewing", "flavor"]
    },
    "Pacamara": {
        "definition": "A hybrid of Pacas and Maragogipe, known for large beans and unique cup profiles — often fruity, floral and creamy.",
        "categories": ["botany"]
    },
    "Paper Filter": {
        "definition": "A disposable filter used in espresso, pour-over, AeroPress and other methods. It traps fines, reduces clogging and improves clarity. Placement, thickness and material influence flavor and flow.",
        "categories": ["brewing", "equipment", "espresso"]
    },
    "Parchment": {
        "definition": "The protective layer around the bean after processing but before milling. Removed during hulling.",
        "categories": ["processing"]
    },
    "Percolation Brewing": {
        "definition": "A brewing method where water flows through the coffee bed via gravity or pressure — includes pour-over and batch brew.",
        "categories": ["brewing"]
    },
    "Phenol / phenolic": {
        "definition": "A type of off-flavor in coffee, often described as medicinal, smoky or plastic-like. Can result from poor fermentation control, processing flaws or microbial contamination.",
        "categories": ["flavor"]
    },
    "Phenotype": {
        "definition": "The physical expression of genetic traits — including plant shape, resistance and cup characteristics.",
        "categories": ["botany"]
    },
    "Portafilter": {
        "definition": "The handle and basket assembly that locks into the grouphead of an espresso machine.",
        "categories": ["espresso", "equipment"]
    },
    "Post-harvest processing": {
        "definition": "An umbrella term for the steps after harvesting coffee cherries — including fermentation, drying, hulling and sorting — to produce green coffee.",
        "categories": ["processing"]
    },
    "Preinfusion / Softinfusion": {
        "definition": "The act of gently wetting the puck before applying full pressure. Can be passive (via E61 groupheads) or programmable (via digital machines or spring levers). Helps prevent channeling and improve extraction consistency.",
        "categories": ["espresso"]
    },
    "Pressure Profiling": {
        "definition": "Changing the pressure over time during a shot. Used to influence how solubles extract and in what order.",
        "categories": ["espresso"]
    },
    "Processing": {
        "definition": "The method used to remove the fruit from the coffee bean. Includes washed, natural, honey and many experimental techniques.",
        "categories": ["processing"]
    },
    "Profile": {
        "definition": "The programmed or intentional flow and/or pressure curve used during a shot. Shapes extraction dynamics and flavor structure.",
        "categories": ["espresso"]
    },
    "Profiling (Espresso)": {
        "definition": "Modifying pressure or flow during a shot to shape extraction stages. Enables finer control over flavor, body and texture — especially with modded or smart machines.",
        "categories": ["espresso"]
    },
    "Puck": {
        "definition": "The compacted bed of coffee inside the basket. A well-prepped puck resists water evenly and extracts cleanly.",
        "categories": ["espresso"]
    },
    "Puck Prep": {
        "definition": "The set of actions taken between grinding and brewing: distribution, WDT, tamping and accessories like puck screens.",
        "categories": ["espresso"]
    },
    "Puck Screen": {
        "definition": "A thin metal or mesh disc placed on top of the coffee puck during brewing. Helps improve water dispersion and reduce channeling, especially in machines with uneven grouphead flow.",
        "categories": ["espresso", "equipment"]
    },
    "Pulping": {
        "definition": "The mechanical removal of the outer fruit layer (skin) from the coffee cherry, typically the first step in washed or honey processing.",
        "categories": ["processing"]
    },
    "Q-grader": {
        "definition": "A certified coffee taster trained to evaluate coffees using the SCA scoring system. Similar to a sommelier in wine.",
        "categories": ["evaluation"]
    },
    "Quakers": {
        "definition": "Underdeveloped or unripe beans that don't brown properly during roasting. Often visible in the final batch and contribute to off-flavors.",
        "categories": ["roasting", "flavor"]
    },
    "Raised bed": {
        "definition": "See drying bed",
        "categories": ["processing"]
    },
    "Ratio": {
        "definition": "The relationship between dose (coffee in) and yield (liquid out), e.g., 1:2 or 1:3.",
        "categories": ["espresso", "brewing"]
    },
    "Rate of Rise (RoR)": {
        "definition": "The speed at which temperature increases during roasting, measured in °C/min. A critical variable for controlling development and avoiding baked flavors.",
        "categories": ["roasting"]
    },
    "Resting (post-roast)": {
        "definition": "The period after roasting when coffee degasses and stabilizes. Most coffees benefit from resting 3–14 days before brewing. Too fresh can taste sharp or undeveloped; too stale loses aromatics.",
        "categories": ["roasting"]
    },
    "Retention": {
        "definition": "The amount of ground coffee left behind in the grinder. See Grind Retention (Total vs Exchange)",
        "categories": ["grinding"]
    },
    "RDT (Ross Droplet Technique)": {
        "definition": "Spritzing beans with a tiny amount of water before grinding to reduce static and clumping. Improves consistency and reduces mess.",
        "categories": ["grinding"]
    },
    "Robusta": {
        "definition": "Coffea canephora — higher in caffeine and bitterness, more disease-resistant. Less common in specialty but increasingly explored.",
        "categories": ["botany"]
    },
    "Roast development": {
        "definition": "The final phase of roasting after first crack. This stage shapes sweetness, balance and finish. Too little development can taste grassy or sour; too much can mute complexity or create baked notes.",
        "categories": ["roasting"]
    },
    "Roast Curve": {
        "definition": "A temperature-over-time graph used to monitor and adjust roast progression.",
        "categories": ["roasting"]
    },
    "SCA": {
        "definition": "Specialty Coffee Association — sets global standards for quality, cupping and sustainability.",
        "categories": ["evaluation"]
    },
    "Scoring (SCA)": {
        "definition": "The SCA cupping protocol evaluates coffees across categories like aroma, flavor, acidity, body and balance — out of 100 points.",
        "categories": ["evaluation"]
    },
    "Second Crack": {
        "definition": "A louder, sharper crack occurring at higher temperatures. Signals the start of darker roast development; associated with oil migration and a smokier profile.",
        "categories": ["roasting"]
    },
    "Shot": {
        "definition": "A single extraction of espresso, typically yielding 25–60g depending on style and ratio.",
        "categories": ["espresso"]
    },
    "Shot Time": {
        "definition": "The total duration of the espresso extraction, from pump start to end of yield. Typically 25–35 seconds for traditional shots.",
        "categories": ["espresso"]
    },
    "Shower Screen": {
        "definition": "The metal screen inside the grouphead that distributes water over the puck. Cleanliness and design affect flow uniformity.",
        "categories": ["espresso", "equipment"]
    },
    "SL28 / SL34": {
        "definition": "Popular Kenyan varieties known for high quality and vibrant acidity. SL stands for \"Scott Agricultural Laboratories.\"",
        "categories": ["botany"]
    },
    "Solubility": {
        "definition": "How easily compounds in coffee dissolve in water. Influences extraction and perceived strength.",
        "categories": ["brewing"]
    },
    "Spring Lever (Machine)": {
        "definition": "A type of espresso machine that uses a spring-loaded piston to generate pressure. Creates a declining pressure curve naturally.",
        "categories": ["espresso", "equipment"]
    },
    "Static (Electricity)": {
        "definition": "Causes grinds to cling, clump or fly around — often worsened by dry air or fast-spinning burrs.",
        "categories": ["grinding"]
    },
    "Strength": {
        "definition": "How concentrated the espresso is. Influenced by dose and yield. Often measured as TDS (%) in brewed espresso.",
        "categories": ["brewing", "evaluation"]
    },
    "Structure (Cup)": {
        "definition": "Refers to how the flavor elements (acidity, body, sweetness, finish) interact or \"hold together.\"",
        "categories": ["flavor", "evaluation"]
    },
    "Sweetness": {
        "definition": "A perception of sugar-like or fruit-like flavors. A key indicator of ripeness and proper roasting.",
        "categories": ["flavor", "evaluation"]
    },
    "Tamping": {
        "definition": "Compressing the coffee in the basket to create a level, dense puck. Aims to ensure uniform resistance to water flow.",
        "categories": ["espresso", "equipment"]
    },
    "TDS (Total Dissolved Solids)": {
        "definition": "The total concentration of dissolved materials in water or brewed coffee. Higher TDS = stronger, denser espresso. Useful for understanding strength and extraction. See also: Strength",
        "categories": ["brewing", "evaluation"]
    },
    "Terroir": {
        "definition": "The environmental conditions (climate, altitude, soil) that affect the flavor profile of a coffee, much like in wine.",
        "categories": ["sourcing", "botany"]
    },
    "Traceability": {
        "definition": "The ability to track a coffee from farm to cup — important for transparency and quality assurance.",
        "categories": ["sourcing"]
    },
    "Triangulation": {
        "definition": "A cupping technique where tasters identify the odd cup out of three. Tests discrimination.",
        "categories": ["evaluation"]
    },
    "Turbo Shot": {
        "definition": "A fast low-contact-style espresso shot using coarse grind, short contact time and high flow to reduce bitterness and improve clarity. Related to low-contact profiles.",
        "categories": ["espresso"]
    },
    "Turbulence": {
        "definition": "The agitation created naturally during pouring. Affects flow and extraction in percolation methods.",
        "categories": ["brewing"]
    },
    "Turning Point": {
        "definition": "The lowest temperature point after charging a roaster — the moment when heat transfer overtakes thermal loss.",
        "categories": ["roasting"]
    },
    "Typica": {
        "definition": "One of the oldest Arabica varieties — clean, balanced and genetically foundational to many modern cultivars.",
        "categories": ["botany"]
    },
    "Ultra-Low Contact": {
        "definition": "A brewing style using very coarse grinds, low temperature, low pressure and high yield (1:3–1:3.5). Great for light roasts and complex, delicate shots.",
        "categories": ["espresso"]
    },
    "Under-extraction": {
        "definition": "When \"not enough\" solubles are pulled from the coffee. Leads to sour, salty or overwhelming shots.",
        "categories": ["brewing", "flavor"]
    },
    "Underdeveloped": {
        "definition": "A roast defect caused by insufficient development time. Often results in sour, grassy or vegetal flavors.",
        "categories": ["roasting", "flavor"]
    },
    "Water Composition": {
        "definition": "The balance of minerals in your brewing water. Affects extraction rate, flavor clarity and machine longevity.",
        "categories": ["brewing"]
    },
    "Washed process": {
        "definition": "Also called wet process. Mucilage is removed using water and fermentation. Tends to produce clean, bright, high-acid profiles.",
        "categories": ["processing"]
    },
    "WCR": {
        "definition": "A nonprofit organization focused on improving coffee's future through agricultural research. WCR develops disease-resistant, high-quality varieties, supports genetic diversity and helps producers adapt to climate change — all to ensure long-term sustainability and better coffee for everyone.",
        "categories": ["evaluation", "sourcing"]
    },
    "WDT (Weiss Distribution Technique)": {
        "definition": "Stirring the ground coffee in the portafilter with thin needles to break up clumps and improve puck uniformity. Increases extraction consistency.",
        "categories": ["espresso"]
    },
    "Yeast inoculation": {
        "definition": "The use of selected yeast strains during fermentation to guide flavor development. Used to improve consistency, enhance clarity or steer coffee toward specific sensory profiles.",
        "categories": ["processing"]
    },
    "Yield": {
        "definition": "The final weight of espresso in the cup, typically measured in grams. One of the key variables for shot tuning.",
        "categories": ["espresso", "brewing"]
    },
    "Zer0 Profile": {
        "definition": "A multi-phase espresso profile designed to pull different flavor compounds in stages. Slow wetting, pressure pause and strong finish — results in syrupy but clean shots.",
        "categories": ["espresso"]
    }
};