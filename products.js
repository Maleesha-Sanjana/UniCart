/**
 * UniCart E-Commerce Platform
 * Product Catalog Data & LocalStorage Seed
 * Exactly 10 Products across 3 Categories ("Electronics", "Clothing", "Food")
 * Currency: Sri Lankan Rupee (LKR)
 * All files in root folder for submission.
 */

const DEFAULT_PRODUCTS = [
  // --- CATEGORY 1: ELECTRONICS (4 products) ---
  {
    id: 1,
    name: "Aura Sound Pro Wireless Noise-Cancelling Headphones",
    category: "Electronics",
    price: 58500.00,
    originalPrice: 69900.00,
    stock: 12,
    rating: 4.8,
    reviewsCount: 128,
    badge: "Best Seller",
    image: "product-1.svg",
    shortDescription: "Flagship over-ear headphones with 40-hour battery life and adaptive hybrid active noise cancellation.",
    fullDescription: "Immerse yourself in concert-grade acoustic fidelity. The Aura Sound Pro features precision-tuned 40mm bio-cellulose drivers, multi-microphone spatial voice capture, ultra-plush memory foam earcups, and dual Bluetooth 5.3 multipoint connectivity.",
    specs: [
      { label: "Battery Life", value: "Up to 40 Hours (ANC on)" },
      { label: "Driver Size", value: "40mm Custom Bio-Cellulose" },
      { label: "Connectivity", value: "Bluetooth 5.3 & 3.5mm Aux" },
      { label: "Weight", value: "248 grams" },
      { label: "Accessibility", value: "Tactile textured buttons & voice prompt status" }
    ]
  },
  {
    id: 2,
    name: "PulseFit Ultra GPS Smartwatch Series 7",
    category: "Electronics",
    price: 45900.00,
    originalPrice: 54000.00,
    stock: 8,
    rating: 4.6,
    reviewsCount: 94,
    badge: "Trending",
    image: "product-2.svg",
    shortDescription: "Ultra-bright AMOLED health watch with continuous ECG, SpO2 tracking, and 50m water resistance.",
    fullDescription: "Stay empowered with real-time biometric tracking. Equipped with a 1.78\" Always-On Retina AMOLED display, dual-frequency GNSS navigation, 110+ athletic workout modes, and emergency SOS fall detection.",
    specs: [
      { label: "Display", value: "1.78\" AMOLED 448x368" },
      { label: "Sensors", value: "Optical Heart Rate, ECG, SpO2, Accelerometer" },
      { label: "Water Rating", value: "5 ATM (50 Meters Swimming)" },
      { label: "Battery", value: "Up to 7 Days Normal Use" },
      { label: "Accessibility", value: "High-contrast font mode & haptic vibration alerts" }
    ]
  },
  {
    id: 3,
    name: "Lumina 4K Ultra-HD Waterproof Action Camera",
    category: "Electronics",
    price: 68000.00,
    originalPrice: 79500.00,
    stock: 4,
    rating: 4.9,
    reviewsCount: 210,
    badge: "Low Stock",
    image: "product-3.svg",
    shortDescription: "Rugged 4K/60fps video camera with dual color screens, EIS 3.0 anti-shake, and 30m dive casing.",
    fullDescription: "Capture every heart-pounding adventure in true cinema quality. Lumina 4K boasts 60fps ultra-HD capture, electronic image stabilization 3.0, 170-degree ultra-wide distortion-corrected lens, and high-fidelity wind-noise reduction audio.",
    specs: [
      { label: "Video Resolution", value: "4K at 60fps / 1080p at 120fps" },
      { label: "Stabilization", value: "HyperSmooth EIS 3.0" },
      { label: "Waterproofing", value: "10m Bare / 30m with Included Housing" },
      { label: "Screens", value: "Rear 2.0\" Touch + Front 1.4\" Selfie Preview" },
      { label: "Accessibility", value: "High-visibility physical record button & audible beeps" }
    ]
  },
  {
    id: 4,
    name: "HyperCharge 65W GaN Fast Dual-Port Charger",
    category: "Electronics",
    price: 12500.00,
    originalPrice: 15200.00,
    stock: 25,
    rating: 4.7,
    reviewsCount: 340,
    badge: "Amazon Choice",
    image: "product-4.svg",
    shortDescription: "Ultra-compact Gallium Nitride wall charger with dual USB-C Power Delivery and USB-A Quick Charge.",
    fullDescription: "Power laptops, tablets, and smartphones at maximum velocity. Powered by next-generation GaN III semiconductor technology, running 40% cooler and 50% smaller than standard OEM bricks with foldaway travel prongs.",
    specs: [
      { label: "Total Power", value: "65W Max Combined Output" },
      { label: "Ports", value: "2x USB-C (PD 3.0 / PPS) + 1x USB-A (QC 3.0)" },
      { label: "Technology", value: "Gallium Nitride (GaN III)" },
      { label: "Safety", value: "Overvoltage, Overheat & Surge Protection" },
      { label: "Accessibility", value: "Braille orientation notch & soft green status LED" }
    ]
  },

  // --- CATEGORY 2: CLOTHING (3 products) ---
  {
    id: 5,
    name: "Merino Wool Thermal Crewneck Sweater",
    category: "Clothing",
    price: 26800.00,
    originalPrice: 32500.00,
    stock: 15,
    rating: 4.7,
    reviewsCount: 88,
    badge: "Eco-Friendly",
    image: "product-5.svg",
    shortDescription: "100% Australian superfine Merino wool knit sweater, naturally temperature-regulating and hypoallergenic.",
    fullDescription: "Experience timeless Scandinavian minimalist elegance. Crafted from sustainably harvested, non-mulesed 19.5-micron Merino wool. Retains warmth when cold, cools when warm, and naturally resists odor and creases.",
    specs: [
      { label: "Material", value: "100% Superfine Merino Wool" },
      { label: "Fit", value: "Modern Tailored Regular Fit" },
      { label: "Care Instructions", value: "Hand Wash or Wool Machine Cycle Cold" },
      { label: "Origin", value: "Ethically Sourced in Australia" },
      { label: "Accessibility", value: "Tagless neck print for sensory sensitivity" }
    ]
  },
  {
    id: 6,
    name: "WeatherShield All-Season Technical Rain Parka",
    category: "Clothing",
    price: 49900.00,
    originalPrice: 58000.00,
    stock: 6,
    rating: 4.8,
    reviewsCount: 62,
    badge: "Premium",
    image: "product-6.svg",
    shortDescription: "10,000mm hydrostatic waterproof hooded parka with thermo-sealed seams and recycled breathable shell.",
    fullDescription: "Defy unpredictable weather in total comfort. Engineered with a 3-layer laminated membrane, articulated storm hood with perimeter drawcord, YKK AquaGuard watertight zippers, and interior magnetic glove pockets.",
    specs: [
      { label: "Waterproof Rating", value: "10,000 mm Hydrostatic Head" },
      { label: "Breathability", value: "8,000 g/m²/24hr" },
      { label: "Shell Material", value: "100% Recycled Technical Polyester" },
      { label: "Pockets", value: "4 Exterior Weatherproof + 2 Internal Security" },
      { label: "Accessibility", value: "Easy-grip ergonomic rubber zipper pulls" }
    ]
  },
  {
    id: 7,
    name: "UrbanFlex Ergonomic Active Stretch Joggers",
    category: "Clothing",
    price: 17900.00,
    originalPrice: 21500.00,
    stock: 19,
    rating: 4.5,
    reviewsCount: 155,
    badge: "Daily Essential",
    image: "product-7.svg",
    shortDescription: "Four-way stretch athletic tapered joggers with elastic waistband and zippered security phone pocket.",
    fullDescription: "Engineered for active movement and casual relaxation. Breathable moisture-wicking technical fabric keeps you dry throughout training, while articulated knee darting ensures unrestricted range of motion.",
    specs: [
      { label: "Fabric Blend", value: "88% Moisture-Wicking Nylon, 12% Spandex" },
      { label: "Waistband", value: "Elastic Rib with Internal/External Drawcord" },
      { label: "Pockets", value: "2 Deep Slash Pockets + 1 Zippered Hip Pocket" },
      { label: "Ankle Hem", value: "Tapered Ribbed Ankle Cuffs" },
      { label: "Accessibility", value: "High-stretch elastic waistband for easy dressing" }
    ]
  },

  // --- CATEGORY 3: FOOD (3 products) ---
  {
    id: 8,
    name: "Artisan Single-Origin Arabica Coffee Beans (1kg)",
    category: "Food",
    price: 8900.00,
    originalPrice: 10500.00,
    stock: 30,
    rating: 4.9,
    reviewsCount: 412,
    badge: "Staff Pick",
    image: "product-8.svg",
    shortDescription: "Direct-trade high-altitude Ethiopian Arabica whole beans with tasting notes of dark chocolate & hazelnut.",
    fullDescription: "Roasted in small batches to preserve delicate aroma oils. Grown at 1,900m above sea level in the Yirgacheffe highlands, our medium-dark roast produces a velvety crema, silky body, and subtle floral finish.",
    specs: [
      { label: "Bean Variety", value: "100% Arabica (Heirloom Varieties)" },
      { label: "Roast Level", value: "Medium-Dark Roast" },
      { label: "Package Size", value: "1.0 kg (2.2 lbs) Nitrogen-Flushed Bag" },
      { label: "Certifications", value: "Fair-Trade & USDA Organic Certified" },
      { label: "Accessibility", value: "Resealable pull-tab tin-tie with one-way degassing valve" }
    ]
  },
  {
    id: 9,
    name: "Wild Mountain Blossom Raw Organic Honey (500g)",
    category: "Food",
    price: 5950.00,
    originalPrice: 7200.00,
    stock: 14,
    rating: 4.8,
    reviewsCount: 179,
    badge: "Organic",
    image: "product-9.svg",
    shortDescription: "Unpasteurized, unfiltered mountain meadow honey packed with natural pollen, enzymes, and antioxidants.",
    fullDescription: "Pure nectar harvested straight from pristine high-alpine meadows. Because our honey is cold-extracted without thermal pasteurization, all live enzymes, floral aromas, and bio-nutrients remain completely intact.",
    specs: [
      { label: "Net Weight", value: "500 grams (17.6 oz)" },
      { label: "Ingredients", value: "100% Pure Raw Wildflower Honey" },
      { label: "Processing", value: "Cold-Extracted & Coarse Filtered Only" },
      { label: "Packaging", value: "BPA-Free Recyclable Glass Jar" },
      { label: "Accessibility", value: "Embossed high-grip ribbed wooden lid" }
    ]
  },
  {
    id: 10,
    name: "Cold-Pressed Extra Virgin Estate Olive Oil (750ml)",
    category: "Food",
    price: 10800.00,
    originalPrice: 13000.00,
    stock: 9,
    rating: 4.7,
    reviewsCount: 95,
    badge: "Gourmet",
    image: "product-10.svg",
    shortDescription: "Single-estate Tuscan olive oil cold-extracted within 6 hours of harvest. Acidity under 0.2%.",
    fullDescription: "The gold standard of Mediterranean culinary excellence. Handpicked Frantoio and Leccino olives cold-pressed in Tuscany, Italy. Rich in polyphenols, featuring vibrant notes of freshly cut grass, artichoke, and a peppery finish.",
    specs: [
      { label: "Volume", value: "750 ml (25.4 fl oz)" },
      { label: "Acidity Level", value: "< 0.2% Free Oleic Acid" },
      { label: "Extraction", value: "Mechanical Cold Extraction (< 24°C)" },
      { label: "Bottle Type", value: "UV-Protective Dark Glass with Retractable Pourer" },
      { label: "Accessibility", value: "Drip-free slow-pour spout mechanism" }
    ]
  }
];

// LocalStorage Keys (v2 for LKR currency)
const STORAGE_KEYS = {
  PRODUCTS: "unicart_products_lkr_v2",
  CART: "unicart_cart_lkr_v2",
  ORDERS: "unicart_orders_lkr_v2",
  SETTINGS: "unicart_settings_v2",
  PROMO: "unicart_applied_promo_lkr_v2"
};

/**
 * Currency Formatter Utility for LKR
 */
function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return 'LKR ' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Initializes and retrieves products from LocalStorage.
 * If not present, populates with DEFAULT_PRODUCTS (exactly 10 products).
 */
function getProducts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length === 10) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Error reading products from localStorage", e);
  }
  // If not stored or corrupted, seed default 10 products
  saveProducts(DEFAULT_PRODUCTS);
  return DEFAULT_PRODUCTS;
}

/**
 * Persists products catalog to LocalStorage
 */
function saveProducts(productsArray) {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(productsArray));
  } catch (e) {
    console.error("Failed to save products to localStorage", e);
  }
}

/**
 * Resets products catalog to original 10 products with default stock
 */
function resetProducts() {
  saveProducts(DEFAULT_PRODUCTS);
  return DEFAULT_PRODUCTS;
}
