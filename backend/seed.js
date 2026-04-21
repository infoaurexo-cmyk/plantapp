const { db, initializeDatabase, dbRun } = require('./database');

const diseases = [
  {
    name: 'Powdery Mildew',
    description: 'A fungal disease that appears as white or gray powdery spots on leaves and stems.',
    symptoms: 'White or gray powdery coating on leaves, stunted growth, yellowing leaves, distorted new growth',
    organic_remedies: '1. Mix 1 tbsp baking soda + 1 tsp dish soap + 1 quart water, spray weekly. 2. Dilute neem oil (2 tbsp per quart water) and spray on affected areas. 3. Mix equal parts milk and water and spray on leaves. 4. Remove and dispose of heavily infected leaves.',
    prevention_tips: 'Ensure good air circulation between plants. Avoid overhead watering. Water in the morning so leaves dry quickly. Do not over-fertilize with nitrogen.',
    affected_plants: 'roses, squash, cucumber, tomato, pepper, melon, pumpkin, zinnia',
    severity_level: 'Medium'
  },
  {
    name: 'Root Rot',
    description: 'A soil-borne disease caused by overwatering or poor drainage, killing plant roots.',
    symptoms: 'Wilting despite moist soil, yellowing leaves, brown mushy roots, foul smell from soil, plant collapse',
    organic_remedies: '1. Remove plant from soil, trim all brown/mushy roots with sterilized scissors. 2. Let roots air dry for 1 hour. 3. Repot in fresh well-draining soil with perlite added. 4. Drench soil with diluted hydrogen peroxide (1 tsp per quart water) to kill fungus.',
    prevention_tips: 'Always use pots with drainage holes. Allow top inch of soil to dry before watering. Use well-draining potting mix. Never let plants sit in standing water.',
    affected_plants: 'tomato, pepper, basil, succulents, houseplants, orchid, avocado',
    severity_level: 'High'
  },
  {
    name: 'Aphid Infestation',
    description: 'Tiny soft-bodied insects that cluster on new growth and undersides of leaves, sucking plant sap.',
    symptoms: 'Sticky honeydew residue on leaves, curled or distorted new leaves, yellowing, black sooty mold, visible tiny green/black/white insects',
    organic_remedies: '1. Blast plants with strong water spray to knock off aphids. 2. Mix 1 tsp dish soap + 1 quart water, spray directly on aphids. 3. Apply neem oil spray (2 tbsp per quart). 4. Introduce ladybugs or lacewings. 5. Wipe leaves with cotton ball dipped in rubbing alcohol.',
    prevention_tips: 'Inspect new plants before bringing indoors. Avoid excess nitrogen fertilizer. Plant marigolds nearby as a deterrent. Regularly check undersides of leaves.',
    affected_plants: 'roses, tomato, pepper, squash, beans, fruit trees, herbs, houseplants',
    severity_level: 'Medium'
  },
  {
    name: 'Spider Mite Infestation',
    description: 'Tiny arachnids that spin webs on plants and suck cell content from leaves.',
    symptoms: 'Fine webbing on leaves and stems, tiny yellow or white speckles on leaves, bronzed or rusty appearance, leaf drop',
    organic_remedies: '1. Spray plant thoroughly with water to remove mites and webs. 2. Mix 1 tsp dish soap + 1 tsp vegetable oil + 1 quart water, spray every 3 days. 3. Apply neem oil spray weekly. 4. Wipe leaves with damp cloth. 5. Increase humidity around plant.',
    prevention_tips: 'Maintain adequate humidity — mites thrive in dry conditions. Avoid dusty conditions on leaves. Quarantine new plants for 2 weeks. Avoid water stress.',
    affected_plants: 'tomato, pepper, cucumber, beans, orchid, houseplants, strawberry, herbs',
    severity_level: 'Medium'
  },
  {
    name: 'Septoria Leaf Spot',
    description: 'A fungal disease causing circular spots with dark borders, primarily affecting tomatoes.',
    symptoms: 'Small circular spots with dark brown borders and light grey centers, yellowing around spots, premature leaf drop starting from lower leaves',
    organic_remedies: '1. Remove infected leaves immediately and dispose of (do not compost). 2. Spray copper-based fungicide or baking soda solution weekly. 3. Apply neem oil every 7-10 days. 4. Mulch around base to prevent soil splash.',
    prevention_tips: 'Avoid overhead watering. Water at base of plant. Rotate crops every year. Remove plant debris at end of season. Space plants for good airflow.',
    affected_plants: 'tomato, potato, pepper',
    severity_level: 'Medium'
  },
  {
    name: 'Early Blight',
    description: 'A common fungal disease causing dark spots with concentric rings (target pattern) on lower leaves first.',
    symptoms: 'Dark brown spots with concentric rings forming a target pattern, yellowing of surrounding tissue, lesions on stems, fruit rot near stem end',
    organic_remedies: '1. Remove and destroy infected leaves. 2. Spray copper fungicide or 1 tbsp baking soda per quart water weekly. 3. Apply neem oil every 7 days. 4. Stake plants to improve airflow.',
    prevention_tips: 'Mulch soil to prevent splash. Rotate tomato family crops every 3 years. Water at soil level. Choose resistant varieties when possible.',
    affected_plants: 'tomato, potato, eggplant',
    severity_level: 'Medium'
  },
  {
    name: 'Whitefly Infestation',
    description: 'Tiny white flying insects that congregate on undersides of leaves and weaken plants.',
    symptoms: 'Clouds of tiny white insects when plant is disturbed, sticky honeydew on leaves, yellowing and wilting leaves, sooty black mold',
    organic_remedies: '1. Hang yellow sticky traps near plant. 2. Spray neem oil solution (2 tbsp per quart) on undersides of leaves. 3. Use insecticidal soap spray. 4. Introduce parasitic wasps if outdoors. 5. Vacuum adults off leaves in early morning.',
    prevention_tips: 'Inspect plants before purchase. Use reflective mulch outdoors. Avoid over-fertilizing. Keep plants healthy and stress-free.',
    affected_plants: 'tomato, pepper, cucumber, beans, citrus, herbs, houseplants',
    severity_level: 'Medium'
  },
  {
    name: 'Leaf Blight',
    description: 'A bacterial or fungal disease causing rapid browning and death of leaf tissue.',
    symptoms: 'Large brown or tan water-soaked areas on leaves, wilting, rapid spread during wet weather, dark lesions on stems',
    organic_remedies: '1. Prune all affected leaves and stems with sterilized tools. 2. Apply copper-based fungicide spray. 3. Spray diluted hydrogen peroxide (3%) on affected areas. 4. Improve air circulation by pruning.',
    prevention_tips: 'Avoid overhead watering. Ensure good drainage. Sterilize pruning tools between plants. Remove plant debris promptly.',
    affected_plants: 'tomato, pepper, potato, ornamental plants, fruit trees',
    severity_level: 'High'
  },
  {
    name: 'Scale Infestation',
    description: 'Small armored or soft-bodied insects that attach to stems and leaves, sucking plant sap.',
    symptoms: 'Small brown or tan bumps on stems and leaves, sticky honeydew residue, yellowing leaves, sooty mold, weakened growth',
    organic_remedies: '1. Scrape off scale with a soft toothbrush or cotton swab dipped in rubbing alcohol. 2. Apply horticultural oil or neem oil spray. 3. Mix 1 tsp dish soap + 1 tsp rubbing alcohol + 1 quart water and spray. 4. Repeat treatment weekly for 4 weeks.',
    prevention_tips: 'Inspect plants regularly, especially stems. Quarantine new plants. Keep plants healthy — stressed plants are more vulnerable.',
    affected_plants: 'citrus, orchid, ficus, palm, houseplants, fruit trees, roses',
    severity_level: 'Medium'
  },
  {
    name: 'Nutrient Deficiency (Nitrogen)',
    description: 'Lack of nitrogen causes pale, yellowing leaves starting from older/lower leaves.',
    symptoms: 'Uniform yellowing of older leaves starting from tips, pale green color overall, slow growth, small leaves, purple tinge on stems in some plants',
    organic_remedies: '1. Apply compost tea — steep compost in water 24 hours, strain and water plant. 2. Add fish emulsion fertilizer (follow label). 3. Mix coffee grounds into top inch of soil. 4. Apply blood meal or feather meal according to package directions.',
    prevention_tips: 'Amend soil with compost before planting. Feed regularly with balanced organic fertilizer during growing season. Test soil annually.',
    affected_plants: 'all vegetables, fruits, flowers, lawn grass',
    severity_level: 'Low'
  },
  {
    name: 'Nutrient Deficiency (Iron)',
    description: 'Iron deficiency causes yellowing between leaf veins while veins stay green (interveinal chlorosis).',
    symptoms: 'Yellow leaves with green veins (interveinal chlorosis), affects new/young leaves first, stunted growth, pale or whitish new growth',
    organic_remedies: '1. Lower soil pH by adding sulfur or acidifying fertilizer — iron availability drops in alkaline soil. 2. Apply chelated iron fertilizer as soil drench. 3. Spray iron sulfate solution on leaves as quick fix. 4. Add coffee grounds or vinegar-water to acidify soil.',
    prevention_tips: 'Test soil pH — aim for 6.0-6.5 for most plants. Avoid overwatering which compacts soil. Do not over-apply phosphorus fertilizer.',
    affected_plants: 'blueberry, citrus, roses, azalea, gardenia, houseplants, vegetables',
    severity_level: 'Low'
  },
  {
    name: 'Damping Off',
    description: 'A fungal disease that kills seedlings at or near the soil surface, causing them to collapse.',
    symptoms: 'Seedlings that were healthy suddenly wilt and collapse, thin pinched stem at soil line, brown or black discoloration at base of stem',
    organic_remedies: '1. Remove affected seedlings immediately. 2. Water with diluted chamomile tea — natural antifungal. 3. Sprinkle cinnamon on soil surface — natural fungicide. 4. Improve air circulation with a small fan. 5. Allow soil surface to dry between waterings.',
    prevention_tips: 'Always use sterile seed-starting mix. Do not overwater seedlings. Provide good air circulation. Sow seeds at correct depth. Sterilize containers before use.',
    affected_plants: 'all seedlings, tomato, pepper, cucumber, herbs, flowers',
    severity_level: 'High'
  },
  {
    name: 'Mosaic Virus',
    description: 'A viral disease spread by insects causing mottled, mosaic-like patterns on leaves.',
    symptoms: 'Mottled yellow and green mosaic pattern on leaves, distorted or curled leaves, stunted plant growth, reduced fruit yield, wrinkled fruit',
    organic_remedies: '1. No cure — remove and destroy infected plants immediately to prevent spread. 2. Control aphids and other insect vectors with neem oil. 3. Wash hands and tools after handling infected plants. 4. Remove weeds nearby which can harbor virus.',
    prevention_tips: 'Choose virus-resistant plant varieties. Control aphid populations. Remove infected plants promptly. Do not touch healthy plants after handling infected ones. Wash tools with bleach solution.',
    affected_plants: 'tomato, pepper, cucumber, squash, beans, tobacco, ornamentals',
    severity_level: 'High'
  },
  {
    name: 'Fungus Gnats',
    description: 'Small flies whose larvae live in moist soil and damage plant roots.',
    symptoms: 'Tiny black flies hovering around soil, wilting and yellowing despite adequate water, slow growth, larvae visible in soil (tiny white worms)',
    organic_remedies: '1. Allow top 2 inches of soil to dry completely between waterings. 2. Apply a layer of sand on top of soil — larvae cannot thrive. 3. Use sticky yellow traps to catch adults. 4. Water with diluted hydrogen peroxide (1 tsp 3% H2O2 per quart water) to kill larvae. 5. Apply beneficial nematodes to soil.',
    prevention_tips: 'Never overwater. Use well-draining soil with perlite. Allow soil to dry between waterings. Do not leave standing water in saucers.',
    affected_plants: 'all houseplants, herbs, seedlings, vegetables in containers',
    severity_level: 'Low'
  },
  {
    name: 'Bacterial Wilt',
    description: 'A bacterial disease spread by cucumber beetles causing rapid wilting of entire plants.',
    symptoms: 'Sudden wilting of entire plant or individual branches, wilting does not recover overnight, sticky thread-like strands visible when stem is cut, eventual plant death',
    organic_remedies: '1. No cure once infected — remove and destroy plant immediately. 2. Control cucumber beetles with kaolin clay or neem oil spray. 3. Use row covers on young plants to prevent beetle feeding.',
    prevention_tips: 'Control cucumber beetle populations from the start. Use row covers during early growth. Remove infected plants immediately. Choose wilt-resistant varieties.',
    affected_plants: 'cucumber, squash, melon, pumpkin',
    severity_level: 'High'
  }
];

const careTips = [
  // Tomato
  { plant_type: 'tomato', care_category: 'watering', tip: 'Water deeply at the base 2-3 times per week. Avoid wetting leaves. Consistent moisture prevents blossom end rot.', frequency: 'Every 2-3 days' },
  { plant_type: 'tomato', care_category: 'sunlight', tip: 'Requires full sun — at least 6-8 hours of direct sunlight daily for best fruit production.', frequency: 'Daily' },
  { plant_type: 'tomato', care_category: 'fertilizing', tip: 'Feed with balanced fertilizer when transplanting, then switch to low-nitrogen high-phosphorus fertilizer once flowering begins.', frequency: 'Every 2 weeks' },
  { plant_type: 'tomato', care_category: 'pruning', tip: 'Remove suckers (shoots growing between main stem and branches) to improve airflow and direct energy to fruit production.', frequency: 'Weekly' },

  // Pepper
  { plant_type: 'pepper', care_category: 'watering', tip: 'Water when top inch of soil is dry. Peppers are drought-tolerant but consistent watering improves yield.', frequency: 'Every 2-3 days' },
  { plant_type: 'pepper', care_category: 'sunlight', tip: 'Needs 6-8 hours of full sun daily. More sun = more peppers and better flavor.', frequency: 'Daily' },
  { plant_type: 'pepper', care_category: 'fertilizing', tip: 'Use balanced fertilizer at planting. Once flowering, switch to low-nitrogen fertilizer to encourage fruiting over leaf growth.', frequency: 'Every 3 weeks' },
  { plant_type: 'pepper', care_category: 'general', tip: 'Peppers love heat. Use black plastic mulch to warm soil and retain moisture in cooler climates.', frequency: 'Season-long' },

  // Basil
  { plant_type: 'basil', care_category: 'watering', tip: 'Keep soil evenly moist. Water when top half-inch of soil feels dry. Do not let basil dry out completely.', frequency: 'Every 1-2 days' },
  { plant_type: 'basil', care_category: 'sunlight', tip: 'Requires 6-8 hours of sunlight. Place on a south-facing windowsill indoors.', frequency: 'Daily' },
  { plant_type: 'basil', care_category: 'pruning', tip: 'Pinch off flower buds as soon as they appear to keep leaves flavorful and plant bushy. Harvest from the top down.', frequency: 'Weekly' },
  { plant_type: 'basil', care_category: 'general', tip: 'Never let basil get cold — it turns black below 50°F (10°C). Keep away from air conditioning vents.', frequency: 'Ongoing' },

  // Rose
  { plant_type: 'rose', care_category: 'watering', tip: 'Water deeply at the base 2-3 times per week. Avoid wetting foliage to prevent fungal disease. Morning watering is best.', frequency: 'Every 2-3 days' },
  { plant_type: 'rose', care_category: 'sunlight', tip: 'Roses thrive with 6+ hours of direct sun. Morning sun with afternoon shade is ideal in hot climates.', frequency: 'Daily' },
  { plant_type: 'rose', care_category: 'fertilizing', tip: 'Feed with rose-specific fertilizer in early spring and after each bloom cycle. Stop feeding 6 weeks before first frost.', frequency: 'Monthly during growing season' },
  { plant_type: 'rose', care_category: 'pruning', tip: 'Deadhead spent blooms to encourage new flowers. Prune to an outward-facing bud at a 45-degree angle.', frequency: 'Weekly in bloom season' },

  // Succulent
  { plant_type: 'succulent', care_category: 'watering', tip: 'Use the soak-and-dry method — water thoroughly then allow soil to dry completely before watering again. Less is more.', frequency: 'Every 1-2 weeks (less in winter)' },
  { plant_type: 'succulent', care_category: 'sunlight', tip: 'Most succulents need 6 hours of bright light daily. Outdoors is best; indoors place in brightest window.', frequency: 'Daily' },
  { plant_type: 'succulent', care_category: 'soil', tip: 'Use cactus/succulent-specific potting mix or add 50% perlite to regular potting soil for fast drainage.', frequency: 'At planting / repotting' },
  { plant_type: 'succulent', care_category: 'general', tip: 'Never let succulents sit in water. Always use pots with drainage holes. Etiolation (stretching toward light) means insufficient sunlight.', frequency: 'Ongoing' },

  // Cucumber
  { plant_type: 'cucumber', care_category: 'watering', tip: 'Water consistently — cucumbers are mostly water. Provide 1 inch of water per week. Inconsistent watering causes bitter cucumbers.', frequency: 'Every 2 days' },
  { plant_type: 'cucumber', care_category: 'sunlight', tip: 'Needs full sun — minimum 6-8 hours daily for good fruit production.', frequency: 'Daily' },
  { plant_type: 'cucumber', care_category: 'fertilizing', tip: 'Feed with balanced fertilizer at planting. Once vines run, switch to high-potassium fertilizer to support fruiting.', frequency: 'Every 2-3 weeks' },
  { plant_type: 'cucumber', care_category: 'general', tip: 'Train vines up a trellis to save space, improve airflow, and make harvesting easier. Harvest frequently to encourage more production.', frequency: 'Weekly training, daily checking' },

  // Orchid
  { plant_type: 'orchid', care_category: 'watering', tip: 'Water once a week by soaking bark medium for 15 minutes then draining fully. Never let roots sit in water.', frequency: 'Weekly' },
  { plant_type: 'orchid', care_category: 'sunlight', tip: 'Bright indirect light — never direct sun which burns leaves. East-facing window is ideal.', frequency: 'Daily' },
  { plant_type: 'orchid', care_category: 'fertilizing', tip: 'Feed with orchid fertilizer at quarter-strength every watering during growing season. Flush with plain water monthly to prevent salt buildup.', frequency: 'Weekly during growing season' },
  { plant_type: 'orchid', care_category: 'general', tip: 'After blooms drop, cut spike just above a node. Cool nights (55-60°F / 13-15°C) trigger re-blooming.', frequency: 'After bloom cycle' },

  // Herb (general)
  { plant_type: 'herb', care_category: 'watering', tip: 'Most herbs prefer to dry slightly between waterings. Overwatering is the #1 killer of potted herbs.', frequency: 'Every 2-3 days' },
  { plant_type: 'herb', care_category: 'sunlight', tip: 'Mediterranean herbs (rosemary, thyme, oregano) need 6+ hours sun. Mint and parsley tolerate partial shade.', frequency: 'Daily' },
  { plant_type: 'herb', care_category: 'harvesting', tip: 'Harvest frequently to keep plants bushy and productive. Never remove more than one-third of the plant at once.', frequency: 'Weekly' },
  { plant_type: 'herb', care_category: 'general', tip: 'Mint is invasive — always grow in containers. Most herbs go bitter when they bolt (flower), so pinch flowers promptly.', frequency: 'Ongoing' },

  // Tomato (additional)
  { plant_type: 'tomato', care_category: 'staking', tip: 'Stake or cage tomatoes early — before they need it. Use cages for bush varieties, stakes or strings for indeterminate (vining) types.', frequency: 'At planting' },

  // Houseplant (general)
  { plant_type: 'houseplant', care_category: 'watering', tip: 'Check soil moisture before watering — stick finger 1-2 inches into soil. If dry, water thoroughly until it drains from the bottom.', frequency: 'Check weekly' },
  { plant_type: 'houseplant', care_category: 'general', tip: 'Dust leaves with a damp cloth monthly to allow better light absorption and check for pests. Wipe both top and underside of leaves.', frequency: 'Monthly' },
  { plant_type: 'houseplant', care_category: 'repotting', tip: 'Repot when roots circle the bottom of pot or push out of drainage holes. Go up only one pot size at a time.', frequency: 'Every 1-2 years in spring' },

  // Fruit trees
  { plant_type: 'fruit tree', care_category: 'watering', tip: 'Young trees need deep watering weekly. Established trees need deep watering every 2-4 weeks depending on rainfall.', frequency: 'Weekly (young), bi-weekly (established)' },
  { plant_type: 'fruit tree', care_category: 'fertilizing', tip: 'Apply balanced fruit tree fertilizer in early spring before new growth. Avoid late-season nitrogen which promotes frost-vulnerable growth.', frequency: 'Once in early spring' },
  { plant_type: 'fruit tree', care_category: 'pruning', tip: 'Prune during dormancy (late winter) to remove crossing branches and open up the canopy. Aim for a vase or modified central-leader shape.', frequency: 'Annually in late winter' },

  // Strawberry
  { plant_type: 'strawberry', care_category: 'watering', tip: 'Water regularly — 1 inch per week. Keep moisture consistent during fruiting. Use drip irrigation or water at base to prevent fruit rot.', frequency: 'Every 2-3 days' },
  { plant_type: 'strawberry', care_category: 'sunlight', tip: 'Full sun is essential — 8+ hours for maximum berry production and sweetness.', frequency: 'Daily' },
  { plant_type: 'strawberry', care_category: 'general', tip: 'Remove runners (horizontal stems) unless you want new plants. Mulch with straw to keep fruit clean and soil moist.', frequency: 'As runners appear' },

  // Leafy greens (lettuce, spinach, kale)
  { plant_type: 'leafy green', care_category: 'watering', tip: 'Keep soil consistently moist. Drought stress causes bitterness in leaves. Water little and often.', frequency: 'Daily or every other day' },
  { plant_type: 'leafy green', care_category: 'sunlight', tip: 'Most leafy greens prefer partial shade in summer. Full sun in spring and fall. Heat causes bolting and bitterness.', frequency: 'Manage by season' },
  { plant_type: 'leafy green', care_category: 'harvesting', tip: 'Use cut-and-come-again method — harvest outer leaves only, leaving center intact for continued production.', frequency: 'Every few days' },

  // Squash / Zucchini
  { plant_type: 'squash', care_category: 'watering', tip: 'Water deeply once or twice weekly at the base. Avoid wetting leaves which encourages powdery mildew.', frequency: 'Every 3-4 days' },
  { plant_type: 'squash', care_category: 'fertilizing', tip: 'Heavy feeder — amend soil with compost before planting. Side-dress with balanced fertilizer once plants begin vining.', frequency: 'Monthly' },
  { plant_type: 'squash', care_category: 'general', tip: 'Harvest zucchini when small (6-8 inches) for best flavor. Leaving large zucchinis on the plant stops production.', frequency: 'Every 2-3 days during harvest' }
];

const seedDatabase = async () => {
  console.log('🌱 Starting database seed...\n');

  // Seed diseases
  console.log(`📋 Adding ${diseases.length} diseases/pests...`);
  for (const disease of diseases) {
    try {
      await dbRun(
        `INSERT OR IGNORE INTO diseases (name, description, symptoms, organic_remedies, prevention_tips, affected_plants, severity_level)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [disease.name, disease.description, disease.symptoms, disease.organic_remedies, disease.prevention_tips, disease.affected_plants, disease.severity_level]
      );
      console.log(`  ✅ ${disease.name}`);
    } catch (err) {
      console.error(`  ❌ ${disease.name}: ${err.message}`);
    }
  }

  // Seed care tips
  console.log(`\n🌿 Adding ${careTips.length} care tips...`);
  for (const tip of careTips) {
    try {
      await dbRun(
        `INSERT INTO care_tips (plant_type, care_category, tip, frequency) VALUES (?, ?, ?, ?)`,
        [tip.plant_type, tip.care_category, tip.tip, tip.frequency]
      );
      console.log(`  ✅ ${tip.plant_type} — ${tip.care_category}`);
    } catch (err) {
      console.error(`  ❌ ${tip.plant_type} / ${tip.care_category}: ${err.message}`);
    }
  }

  console.log('\n✅ Seed complete!');

  // Print summary
  setTimeout(async () => {
    const { dbAll } = require('./database');
    const dCount = await dbAll('SELECT COUNT(*) as n FROM diseases');
    const cCount = await dbAll('SELECT COUNT(*) as n FROM care_tips');
    console.log(`\n📊 Summary:`);
    console.log(`   Diseases/Pests: ${dCount[0].n}`);
    console.log(`   Care Tips:      ${cCount[0].n}`);
    process.exit(0);
  }, 500);
};

// Wait for DB to be ready
db.on('open', () => {});
initializeDatabase();
setTimeout(seedDatabase, 500);
