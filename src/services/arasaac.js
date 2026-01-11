/**
 * ARASAAC Pictogram Service
 * 
 * ARASAAC (Aragonese Center of Augmentative and Alternative Communication)
 * provides over 13,000 free pictograms for AAC use.
 * 
 * License: CC BY-NC-SA 4.0
 * Website: https://arasaac.org
 * API Docs: https://arasaac.org/developers/api
 * 
 * Usage:
 * - Free for non-commercial use
 * - Attribution required: "Pictograms by ARASAAC (http://www.arasaac.org)"
 * - Share alike: derivatives must use same license
 */

const ARASAAC_API_BASE = 'https://api.arasaac.org/api';
const ARASAAC_IMAGE_BASE = 'https://static.arasaac.org/pictograms';

// Default image options
const DEFAULT_IMAGE_OPTIONS = {
  color: true,        // Color pictograms (vs black & white)
  skin: 'white',      // Skin color: white, black, assian, mulatto, aztec
  hair: 'brown',      // Hair color: blonde, brown, darkBrown, gray, darkGray, red, black
  resolution: 500,    // Image size in pixels (300, 500, 2500)
};

/**
 * Build the URL for a pictogram image
 * @param {number} id - ARASAAC pictogram ID
 * @param {object} options - Image options
 * @returns {string} Image URL
 */
export const getPictogramUrl = (id, options = {}) => {
  const opts = { ...DEFAULT_IMAGE_OPTIONS, ...options };
  
  let url = `${ARASAAC_IMAGE_BASE}/${id}/${id}`;
  
  // Add resolution
  url += `_${opts.resolution}`;
  
  // Add color option
  if (!opts.color) {
    url += '_nocolor';
  }
  
  // Add skin color (for pictograms with people)
  // url += `_skin-${opts.skin}`;
  
  // Add file extension
  url += '.png';
  
  return url;
};

/**
 * Search for pictograms by keyword
 * @param {string} keyword - Search term
 * @param {string} locale - Language code (en, es, fr, de, it, pt, etc.)
 * @returns {Promise<Array>} Array of pictogram results
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
    
    // Transform to simpler format
    return data.map(item => ({
      id: item._id,
      keywords: item.keywords || [],
      categories: item.categories || [],
      imageUrl: getPictogramUrl(item._id),
      // Get the primary keyword for this locale
      text: item.keywords?.[0]?.keyword || `Pictogram ${item._id}`,
    }));
  } catch (error) {
    console.error('Error searching ARASAAC:', error);
    return [];
  }
};

/**
 * Get pictogram details by ID
 * @param {number} id - ARASAAC pictogram ID
 * @param {string} locale - Language code
 * @returns {Promise<object|null>} Pictogram details or null
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
 * @param {string} category - Category name
 * @param {string} locale - Language code
 * @returns {Promise<Array>} Array of pictograms
 */
export const getPictogramsByCategory = async (category, locale = 'en') => {
  // ARASAAC doesn't have a direct category endpoint, so we search
  return searchPictograms(category, locale);
};

/**
 * Pre-defined pictogram mappings for common AAC buttons
 * These are curated ARASAAC IDs that work well for each concept
 */
export const ARASAAC_PICTOGRAM_IDS = {
  // Basic Needs
  yes: 26990,
  no: 5765,
  help: 6521,
  more: 25349,
  stop: 37432,
  wait: 35533,
  bathroom: 28873,
  tired: 11950,
  hurt: 8381,
  'all-done': 2660,
  drink: 32355,
  hungry: 9488,
  
  // Feelings
  happy: 26684,
  sad: 11321,
  angry: 11318,
  scared: 6459,
  excited: 11319,
  calm: 28753,
  frustrated: 11323,
  bored: 11320,
  sick: 9495,
  love: 26790,
  proud: 11327,
  silly: 11330,
  
  // Food & Drink
  water: 2262,
  juice: 5227,
  milk: 5640,
  apple: 2360,
  banana: 2439,
  cookie: 4977,
  pizza: 8043,
  chicken: 37174,
  sandwich: 3765,
  snack: 3691,
  breakfast: 31688,
  'ice-cream': 5004,
  
  // Actions
  play: 15762,
  go: 6515,
  read: 6452,
  watch: 36760,
  outside: 36751,
  sleep: 5006,
  hug: 6458,
  sit: 10139,
  walk: 3019,
  listen: 6455,
  draw: 3262,
  swim: 3024,
  
  // Places
  home: 2327,
  school: 2334,
  park: 7295,
  store: 7371,
  car: 2510,
  bedroom: 5001,
  kitchen: 7288,
  'bathroom-place': 28873,
  doctor: 8295,
  restaurant: 7369,
  playground: 11587,
  grandma: 8298,
  
  // People
  mom: 8299,
  dad: 8297,
  brother: 2291,
  sister: 2293,
  'grandma-person': 8298,
  grandpa: 8300,
  teacher: 2340,
  friend: 6460,
  baby: 2428,
  'doctor-person': 8295,
  pet: 2445,
  me: 37280,
  
  // Things
  toy: 2467,
  ball: 2430,
  book: 31337,
  phone: 6634,
  tablet: 27551,
  blanket: 5003,
  clothes: 3169,
  shoes: 3191,
  backpack: 3199,
  crayons: 3260,
  blocks: 3202,
  puzzle: 2464,
  
  // Questions
  what: 5795,
  where: 5798,
  when: 5797,
  who: 5799,
  why: 5800,
  how: 5793,
  'can-i': 6517,
  'whats-next': 37770,
  'how-long': 11969,
  again: 37393,
  'dont-understand': 37494,
  'whats-that': 5795,
};

/**
 * Get the ARASAAC image URL for a predefined button
 * @param {string} buttonId - The button ID (e.g., 'yes', 'no', 'help')
 * @param {object} options - Image options
 * @returns {string|null} Image URL or null if not found
 */
export const getButtonPictogramUrl = (buttonId, options = {}) => {
  const pictogramId = ARASAAC_PICTOGRAM_IDS[buttonId];
  if (!pictogramId) return null;
  return getPictogramUrl(pictogramId, options);
};

/**
 * Preload pictogram images for faster display
 * @param {Array<string>} buttonIds - Array of button IDs to preload
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
 * ARASAAC Attribution component (required by license)
 */
export const ArasaacAttribution = () => {
  return (
    <div className="text-xs text-gray-500 text-center mt-4">
      <a 
        href="https://arasaac.org" 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:underline"
      >
        Pictograms by ARASAAC (CC BY-NC-SA)
      </a>
    </div>
  );
};

export default {
  getPictogramUrl,
  searchPictograms,
  getPictogramById,
  getPictogramsByCategory,
  getButtonPictogramUrl,
  preloadPictograms,
  ARASAAC_PICTOGRAM_IDS,
};
