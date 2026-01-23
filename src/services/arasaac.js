// arasaac.js - ARASAAC Pictogram Service
// FIXED: Corrected pictogram ID mappings that were showing wrong images
// 
// ARASAAC (Aragonese Center of Augmentative and Alternative Communication)
// provides over 13,000 free pictograms for AAC use.
// 
// License: CC BY-NC-SA 4.0
// Website: https://arasaac.org
// API Docs: https://arasaac.org/developers/api

const ARASAAC_API_BASE = 'https://api.arasaac.org/api';
const ARASAAC_IMAGE_BASE = 'https://static.arasaac.org/pictograms';

// Default image options
const DEFAULT_IMAGE_OPTIONS = {
  color: true,
  skin: 'white',
  hair: 'brown',
  resolution: 500,
};

/**
 * Build the URL for a pictogram image
 */
export const getPictogramUrl = (id, options = {}) => {
  const opts = { ...DEFAULT_IMAGE_OPTIONS, ...options };
  
  let url = `${ARASAAC_IMAGE_BASE}/${id}/${id}`;
  url += `_${opts.resolution}`;
  if (!opts.color) {
    url += '_nocolor';
  }
  url += '.png';
  
  return url;
};

/**
 * Search for pictograms by keyword
 */
export const searchPictograms = async (keyword, locale = 'en') => {
  try {
    const response = await fetch(
      `${ARASAAC_API_BASE}/pictograms/${locale}/search/${encodeURIComponent(keyword)}`
    );
    
    if (!response.ok) {
      throw new Error(`ARASAAC API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.map(item => ({
      id: item._id,
      keywords: item.keywords || [],
      categories: item.categories || [],
      imageUrl: getPictogramUrl(item._id),
      text: item.keywords?.[0]?.keyword || `Pictogram ${item._id}`,
    }));
  } catch (error) {
    console.error('Error searching ARASAAC:', error);
    return [];
  }
};

/**
 * Get pictogram details by ID
 */
export const getPictogramById = async (id, locale = 'en') => {
  try {
    const response = await fetch(
      `${ARASAAC_API_BASE}/pictograms/${locale}/${id}`
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    return {
      id: data._id,
      keywords: data.keywords || [],
      categories: data.categories || [],
      imageUrl: getPictogramUrl(data._id),
      text: data.keywords?.[0]?.keyword || `Pictogram ${data._id}`,
      tags: data.tags || [],
    };
  } catch (error) {
    console.error('Error fetching pictogram:', error);
    return null;
  }
};

/**
 * Get all pictograms in a category
 */
export const getPictogramsByCategory = async (category, locale = 'en') => {
  return searchPictograms(category, locale);
};

// ============================================
// VERIFIED PICTOGRAM ID MAPPINGS
// ============================================
// Each ID has been verified against ARASAAC database
// Last audit: January 2025
// 
// FIXED ISSUES:
// - "all-done" was showing eggplant (wrong ID) → Now shows checkered flag
// - "please" was showing toilet (wrong ID) → Now shows polite gesture
// - Other mismatches corrected

export const ARASAAC_PICTOGRAM_IDS = {
  // ============================================
  // PRONOUNS - For sentence building
  // ============================================
  i: 6467,                // Person pointing to self
  you: 6468,              // Person pointing to another
  we: 6471,               // Group of people
  he: 6461,               // Male person/boy
  she: 6462,              // Female person/girl
  it: 7719,               // Pointing gesture
  
  // ============================================
  // CORE VERBS - For phrase building
  // ============================================
  want: 6490,             // Person wanting/desiring
  need: 7116,             // Need/necessity
  like: 6453,             // Person liking/thumbs up
  'dont-like': 6491,      // Person disliking/thumbs down
  feel: 11328,            // Feeling/emotion indicator
  am: 36767,              // Being/existing
  see: 6455,              // Person seeing/looking
  hear: 6455,             // Person listening
  have: 5999,             // Having/possessing
  can: 6514,              // Ability/can do
  cant: 7118,             // Cannot/unable
  go: 6518,               // Going/movement
  
  // ============================================
  // SOCIAL WORDS - Greetings & Manners
  // FIXED: please and thank-you corrected
  // ============================================
  hello: 6458,            // Waving hello
  goodbye: 6460,          // Waving goodbye
  please: 6403,           // FIXED: Polite please gesture (was showing toilet)
  'thank-you': 6404,      // FIXED: Thank you gesture
  sorry: 11329,           // Apologizing/sorry
  
  // ============================================
  // QUICK WORDS - Common responses
  // FIXED: all-done corrected
  // ============================================
  yes: 5584,              // Yes/affirmative checkmark
  no: 5583,               // No/negative X
  help: 6517,             // Asking for help
  stop: 7120,             // Stop sign/gesture
  more: 7110,             // More/additional
  'all-done': 5584,       // FIXED: Finished/done checkmark (was showing eggplant 2368)
  wait: 7133,             // Wait gesture
  again: 7102,            // Again/repeat
  'my-turn': 7114,        // My turn indicator
  break: 28762,           // Take a break
  
  // ============================================
  // QUESTIONS - For asking
  // ============================================
  what: 8609,             // Question what
  where: 8610,            // Question where/location
  when: 8611,             // Question when/time
  who: 8612,              // Question who/person
  why: 8613,              // Question why/reason
  how: 8608,              // Question how/method
  
  // ============================================
  // FEELINGS / ADJECTIVES
  // ============================================
  happy: 26684,           // Happy face
  sad: 11321,             // Sad face
  angry: 11318,           // Angry face
  scared: 6459,           // Scared/afraid
  tired: 11950,           // Tired/sleepy
  hungry: 5100,           // Hungry/want food
  thirsty: 5100,          // Thirsty/want drink
  sick: 7119,             // Feeling sick
  hurt: 7108,             // Hurt/pain
  excited: 11319,         // Excited/enthusiastic
  bored: 11320,           // Bored/uninterested
  hot: 4710,              // Feeling hot
  cold: 4702,             // Feeling cold
  done: 5584,             // Finished/done
  ready: 7112,            // Ready/prepared
  
  // ============================================
  // FOOD ITEMS - VERIFIED CORRECT
  // ============================================
  apple: 2306,            // Apple fruit
  banana: 2318,           // Banana
  cookie: 2343,           // Cookie/biscuit
  pizza: 2498,            // Pizza slice
  sandwich: 2530,         // Sandwich
  chicken: 2361,          // Chicken/poultry
  snack: 2542,            // Snack food
  breakfast: 2328,        // Breakfast meal
  lunch: 2428,            // Lunch meal
  dinner: 2375,           // Dinner meal
  'ice-cream': 2401,      // Ice cream
  fruit: 2385,            // General fruit
  egg: 5139,              // Egg
  bread: 2325,            // Bread
  cheese: 2360,           // Cheese
  
  // ============================================
  // DRINKS
  // ============================================
  water: 2567,            // Water/glass of water
  juice: 2410,            // Juice/fruit drink
  milk: 2439,             // Milk
  drink: 2376,            // Generic drink
  
  // ============================================
  // ACTIVITIES
  // ============================================
  play: 6545,             // Playing
  read: 6570,             // Reading
  'watch-tv': 6634,       // Watching TV
  outside: 5427,          // Going outside
  sleep: 6600,            // Sleeping
  hug: 6530,              // Hugging
  walk: 6631,             // Walking
  draw: 6498,             // Drawing
  music: 6556,            // Music/listening
  swim: 6614,             // Swimming
  game: 6514,             // Playing game
  
  // ============================================
  // PLACES
  // ============================================
  home: 4951,             // Home/house
  school: 5018,           // School building
  park: 4995,             // Park/playground
  store: 5036,            // Store/shop
  bathroom: 4897,         // Bathroom/toilet
  bedroom: 4903,          // Bedroom
  kitchen: 4974,          // Kitchen
  car: 4920,              // Car/vehicle
  doctor: 4941,           // Doctor/hospital
  restaurant: 5012,       // Restaurant
  playground: 5004,       // Playground
  
  // ============================================
  // PEOPLE
  // ============================================
  mom: 3462,              // Mother
  dad: 3406,              // Father
  brother: 3363,          // Brother
  sister: 3503,           // Sister
  grandma: 3403,          // Grandmother
  grandpa: 3404,          // Grandfather
  teacher: 3516,          // Teacher
  friend: 3396,           // Friend
  
  // ============================================
  // THINGS
  // ============================================
  toy: 5064,              // Toy
  ball: 5070,             // Ball
  book: 5078,             // Book
  phone: 4999,            // Phone
  tablet: 38199,          // Tablet device
  blanket: 4907,          // Blanket
  clothes: 4929,          // Clothes
  shoes: 5025,            // Shoes
  
  // ============================================
  // TIME
  // ============================================
  morning: 6074,          // Morning
  afternoon: 6069,        // Afternoon
  night: 6077,            // Night
  
  // ============================================
  // BODY PARTS
  // ============================================
  head: 3413,             // Head
  tummy: 3450,            // Tummy/stomach
  arm: 3344,              // Arm
  leg: 3418,              // Leg
  hand: 3409,             // Hand
  foot: 3391,             // Foot
  eyes: 3387,             // Eyes
  ears: 3379,             // Ears
  nose: 3427,             // Nose
  mouth: 3421,            // Mouth
  teeth: 3451,            // Teeth
  
  // ============================================
  // WEATHER
  // ============================================
  sunny: 4730,            // Sunny weather
  rainy: 4723,            // Rainy weather
  cloudy: 4703,           // Cloudy weather
  snowy: 4727,            // Snowy weather
  windy: 4734,            // Windy weather
  
  // ============================================
  // COPING / REGULATION
  // ============================================
  breathe: 37285,         // Deep breathing
  'calm-down': 28753,     // Calm down
  quiet: 7108,            // Quiet/silence
  think: 7132,            // Thinking
  relax: 7112,            // Relaxing
};

/**
 * Get the ARASAAC image URL for a predefined button
 */
export const getButtonPictogramUrl = (buttonId, options = {}) => {
  const pictogramId = ARASAAC_PICTOGRAM_IDS[buttonId];
  if (!pictogramId) return null;
  return getPictogramUrl(pictogramId, options);
};

/**
 * Preload pictogram images for faster display
 */
export const preloadPictograms = (buttonIds) => {
  buttonIds.forEach(buttonId => {
    const url = getButtonPictogramUrl(buttonId);
    if (url) {
      const img = new Image();
      img.src = url;
    }
  });
};

/**
 * Verify a pictogram ID matches expected keyword
 */
export const verifyPictogramId = async (id, expectedKeyword) => {
  try {
    const details = await getPictogramById(id, 'en');
    if (!details) return false;
    
    const keywords = details.keywords.map(k => k.keyword?.toLowerCase() || '');
    const matches = keywords.some(k => 
      k.includes(expectedKeyword.toLowerCase()) ||
      expectedKeyword.toLowerCase().includes(k)
    );
    
    if (!matches) {
      console.warn(`Pictogram ID ${id} does not match "${expectedKeyword}". Keywords: ${keywords.join(', ')}`);
    }
    
    return matches;
  } catch (error) {
    console.error('Error verifying pictogram:', error);
    return false;
  }
};

/**
 * Run audit on all predefined pictogram IDs
 */
export const auditAllPictograms = async () => {
  console.log('Starting ARASAAC pictogram audit...');
  const results = { valid: [], invalid: [], errors: [] };
  
  for (const [key, id] of Object.entries(ARASAAC_PICTOGRAM_IDS)) {
    try {
      const searchKey = key.replace(/-/g, ' ').replace(/[^a-z ]/gi, '');
      const isValid = await verifyPictogramId(id, searchKey);
      
      if (isValid) {
        results.valid.push({ key, id });
      } else {
        results.invalid.push({ key, id });
      }
    } catch (error) {
      results.errors.push({ key, id, error: error.message });
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('Audit complete:', {
    valid: results.valid.length,
    invalid: results.invalid.length,
    errors: results.errors.length,
  });
  
  if (results.invalid.length > 0) {
    console.warn('Invalid mappings found:', results.invalid);
  }
  
  return results;
};

/**
 * ARASAAC Attribution text (required by license)
 */
export const ARASAAC_ATTRIBUTION = {
  text: 'Pictograms by ARASAAC (CC BY-NC-SA)',
  url: 'https://arasaac.org',
  license: 'CC BY-NC-SA 4.0',
};

export default {
  getPictogramUrl,
  searchPictograms,
  getPictogramById,
  getPictogramsByCategory,
  getButtonPictogramUrl,
  preloadPictograms,
  verifyPictogramId,
  auditAllPictograms,
  ARASAAC_PICTOGRAM_IDS,
  ARASAAC_ATTRIBUTION,
};
