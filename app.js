/**
 * UniCart - Universal E-Commerce Application
 * Main Application Logic, State Management & Accessibility Controller
 * Pure Vanilla JavaScript (ES6+), LocalStorage Persistence
 * Currency: Sri Lankan Rupee (LKR)
 * All files in root folder for submission.
 */

// Global State
const State = {
  products: [],
  cart: [],
  appliedPromo: null,
  activeCategory: 'All',
  searchQuery: '',
  maxPrice: 80000,
  inStockOnly: false,
  sortBy: 'featured',
  lastRemovedItem: null,
  settings: {
    theme: 'light',
    fontSize: 'base',
    dyslexicFont: false,
    reducedMotion: false,
    speechEnabled: true
  },
  checkout: {
    currentStep: 1,
    shippingData: null,
    paymentMethod: 'card',
    cardData: null,
    deliverySpeed: 'standard'
  }
};

// Available Promo Codes
const PROMO_CODES = {
  'UNICART10': { discount: 0.10, label: '10% Off Universal Coupon' },
  'WELCOME20': { discount: 0.20, label: '20% Off Welcome Student Discount' }
};

// --- Initialisation ---
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  initAccessibilitySettings();
  initEventListeners();
  renderProducts();
  updateCartUI();
  setupKeyboardShortcuts();
  announceToScreenReader('UniCart online store loaded with prices in LKR. Press question mark for keyboard shortcuts.');
});

/**
 * Loads data from LocalStorage or sets initial defaults
 */
function initStorage() {
  State.products = getProducts();

  try {
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
    State.cart = savedCart ? JSON.parse(savedCart) : [];

    const savedPromo = localStorage.getItem(STORAGE_KEYS.PROMO);
    State.appliedPromo = savedPromo ? JSON.parse(savedPromo) : null;

    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (savedSettings) {
      State.settings = Object.assign(State.settings, JSON.parse(savedSettings));
    }
  } catch (e) {
    console.error('Error loading state from localStorage', e);
  }
}

/**
 * Applies saved accessibility settings (Theme, Font Scale, Dyslexic, Motion)
 */
function initAccessibilitySettings() {
  applyTheme(State.settings.theme);
  applyFontSize(State.settings.fontSize);
  applyDyslexicFont(State.settings.dyslexicFont);
  applyReducedMotion(State.settings.reducedMotion);
}

function saveSettings() {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(State.settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
}

function applyTheme(theme) {
  State.settings.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelectorAll('.btn-theme-opt').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
  saveSettings();
}

function applyFontSize(size) {
  State.settings.fontSize = size;
  let scale = '1';
  if (size === 'sm') scale = '0.9';
  if (size === 'base') scale = '1';
  if (size === 'lg') scale = '1.15';
  if (size === 'xl') scale = '1.3';
  document.documentElement.style.setProperty('--font-scale', scale);
  document.querySelectorAll('.btn-font-size').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.size === size);
  });
  saveSettings();
}

function applyDyslexicFont(enabled) {
  State.settings.dyslexicFont = !!enabled;
  if (State.settings.dyslexicFont) {
    document.documentElement.setAttribute('data-font', 'dyslexic');
  } else {
    document.documentElement.removeAttribute('data-font');
  }
  const checkbox = document.getElementById('chk-dyslexic-font');
  if (checkbox) checkbox.checked = State.settings.dyslexicFont;
  saveSettings();
}

function applyReducedMotion(enabled) {
  State.settings.reducedMotion = !!enabled;
  if (State.settings.reducedMotion) {
    document.documentElement.setAttribute('data-motion', 'reduced');
  } else {
    document.documentElement.removeAttribute('data-motion');
  }
  const checkbox = document.getElementById('chk-reduced-motion');
  if (checkbox) checkbox.checked = State.settings.reducedMotion;
  saveSettings();
}

/**
 * Text-to-Speech Accessibility Function (Universal Design Principle 4)
 */
function speakText(text) {
  if (!('speechSynthesis' in window) || !State.settings.speechEnabled) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
}

function announceToScreenReader(message) {
  const liveRegion = document.getElementById('sr-announcements');
  if (liveRegion) {
    liveRegion.textContent = message;
  }
}

// --- Catalog Rendering & Filtering ---

function getFilteredProducts() {
  return State.products.filter(p => {
    // Category match
    const categoryMatch = (State.activeCategory === 'All') || (p.category.toLowerCase() === State.activeCategory.toLowerCase());
    
    // Search query match
    const q = State.searchQuery.trim().toLowerCase();
    const queryMatch = !q || (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.badge.toLowerCase().includes(q)
    );

    // Price range match
    const priceMatch = p.price <= State.maxPrice;

    // Stock match
    const stockMatch = !State.inStockOnly || p.stock > 0;

    return categoryMatch && queryMatch && priceMatch && stockMatch;
  }).sort((a, b) => {
    switch (State.sortBy) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'rating-desc': return b.rating - a.rating;
      case 'name-asc': return a.name.localeCompare(b.name);
      default: return a.id - b.id; // 'featured'
    }
  });
}

function renderProducts() {
  const container = document.getElementById('products-grid-container');
  const countLabel = document.getElementById('results-count-label');
  if (!container) return;

  const filtered = getFilteredProducts();

  if (countLabel) {
    countLabel.textContent = `Showing ${filtered.length} of ${State.products.length} products`;
  }

  // Update Category Badge counts in Subnav
  updateCategoryCounts();

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="catalog-empty" role="status">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <h3>No Products Found</h3>
        <p>No products match your selected filters. Try broadening your criteria or reset filters.</p>
        <button class="btn-primary" onclick="resetAllFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => {
    const isOutOfStock = p.stock <= 0;
    const isLowStock = p.stock > 0 && p.stock <= 5;
    const stockClass = isOutOfStock ? 'out-of-stock' : (isLowStock ? 'low-stock' : 'in-stock');
    const stockText = isOutOfStock ? 'Out of Stock' : (isLowStock ? `Low Stock: Only ${p.stock} left!` : `In Stock: ${p.stock} available`);
    const badgeClass = `badge-${p.badge.toLowerCase().replace(/[^a-z]/g, '')}`;
    const savings = (p.originalPrice - p.price);
    const cartItem = State.cart.find(item => item.productId === p.id);
    const inCartQty = cartItem ? cartItem.quantity : 0;
    const remainingStock = p.stock - inCartQty;

    return `
      <article class="product-card" id="product-card-${p.id}" data-id="${p.id}">
        <div class="card-badges">
          <span class="badge ${badgeClass}">${p.badge}</span>
        </div>

        <div class="product-image-box">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          <button class="quick-view-btn" onclick="openQuickView(${p.id})" aria-label="Quick View ${p.name}">
            Quick View
          </button>
        </div>

        <div class="product-meta">
          <span class="category-tag">${p.category}</span>
          <div class="rating-box" aria-label="Rating: ${p.rating} out of 5 stars from ${p.reviewsCount} reviews">
            <span class="rating-stars">★</span>
            <span>${p.rating} (${p.reviewsCount})</span>
          </div>
        </div>

        <h3 class="product-title">${p.name}</h3>
        <p class="product-desc">${p.shortDescription}</p>

        <div class="product-pricing">
          <span class="current-price">${formatCurrency(p.price)}</span>
          <span class="original-price">${formatCurrency(p.originalPrice)}</span>
          <span class="savings-tag">Save ${formatCurrency(savings)}</span>
        </div>

        <div class="stock-indicator ${stockClass}" aria-live="polite">
          <div class="stock-text">
            <span class="stock-dot"></span>
            <span>${stockText}</span>
          </div>
          <div class="stock-bar">
            <div class="stock-bar-fill" style="width: ${Math.min(100, (p.stock / 25) * 100)}%"></div>
          </div>
        </div>

        <div class="card-actions">
          <button 
            class="btn-add-cart" 
            id="btn-add-${p.id}" 
            onclick="addToCart(${p.id})" 
            ${remainingStock <= 0 ? 'disabled' : ''}
            aria-label="Add ${p.name} to Basket">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            <span>${remainingStock <= 0 ? 'Out of Stock' : (inCartQty > 0 ? `Add More (${inCartQty} in cart)` : 'Add to Basket')}</span>
          </button>
          
          <button 
            class="btn-tts-listen" 
            onclick="readProductAloud(${p.id})" 
            title="Listen to description"
            aria-label="Read description aloud for ${p.name}">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
          </button>
        </div>
      </article>
    `;
  }).join('');
}

function updateCategoryCounts() {
  const counts = {
    All: State.products.length,
    Electronics: State.products.filter(p => p.category === 'Electronics').length,
    Clothing: State.products.filter(p => p.category === 'Clothing').length,
    Food: State.products.filter(p => p.category === 'Food').length
  };

  document.querySelectorAll('[data-category-target]').forEach(btn => {
    const cat = btn.getAttribute('data-category-target');
    const badge = btn.querySelector('.count-tag');
    if (badge && counts[cat] !== undefined) {
      badge.textContent = counts[cat];
    }
  });
}

function readProductAloud(id) {
  const product = State.products.find(p => p.id === id);
  if (!product) return;
  const speech = `${product.name}. Category: ${product.category}. Price: ${product.price.toLocaleString()} Sri Lankan Rupees. ${product.stock > 0 ? `In stock: ${product.stock} units available.` : 'Currently out of stock.'} Description: ${product.shortDescription}`;
  speakText(speech);
  showToast(`Reading: ${product.name}`, 'info');
}

// --- Shopping Basket Logic ---

function addToCart(productId, quantity = 1) {
  const product = State.products.find(p => p.id === productId);
  if (!product) return;

  const existingIndex = State.cart.findIndex(item => item.productId === productId);
  const currentInCart = existingIndex > -1 ? State.cart[existingIndex].quantity : 0;

  if (currentInCart + quantity > product.stock) {
    showToast(`Sorry, only ${product.stock} units of ${product.name} are available in stock.`, 'danger');
    speakText(`Maximum stock reached for ${product.name}`);
    return;
  }

  if (existingIndex > -1) {
    State.cart[existingIndex].quantity += quantity;
  } else {
    State.cart.push({ productId, quantity });
  }

  saveCart();
  updateCartUI();
  renderProducts();

  // Visual button feedback
  const btn = document.getElementById(`btn-add-${productId}`);
  if (btn) {
    btn.classList.add('added-success');
    btn.innerHTML = `<span>✓ Added to Basket</span>`;
    setTimeout(() => {
      renderProducts();
    }, 1200);
  }

  showToast(`Added "${product.name}" to your basket!`, 'success');
  announceToScreenReader(`${product.name} added to basket. Basket total is now ${formatCurrency(calculateCartTotals().total)}`);
}

function updateCartQuantity(productId, delta) {
  const itemIndex = State.cart.findIndex(i => i.productId === productId);
  if (itemIndex === -1) return;

  const product = State.products.find(p => p.id === productId);
  if (!product) return;

  const newQty = State.cart[itemIndex].quantity + delta;

  if (newQty <= 0) {
    removeFromCart(productId);
    return;
  }

  if (newQty > product.stock) {
    showToast(`Cannot add more than ${product.stock} units in stock.`, 'warning');
    return;
  }

  State.cart[itemIndex].quantity = newQty;
  saveCart();
  updateCartUI();
  renderProducts();
}

function removeFromCart(productId) {
  const itemIndex = State.cart.findIndex(i => i.productId === productId);
  if (itemIndex === -1) return;

  const removedItem = State.cart[itemIndex];
  const product = State.products.find(p => p.id === productId);

  State.lastRemovedItem = { ...removedItem };
  State.cart.splice(itemIndex, 1);

  saveCart();
  updateCartUI();
  renderProducts();

  const productName = product ? product.name : 'Item';
  showToast(`Removed "${productName}" from basket.`, 'danger', true);
  announceToScreenReader(`${productName} removed from basket.`);
}

function undoLastRemoval() {
  if (!State.lastRemovedItem) return;
  State.cart.push(State.lastRemovedItem);
  State.lastRemovedItem = null;
  saveCart();
  updateCartUI();
  renderProducts();
  showToast('Item restored to basket!', 'success');
}

function clearCart(confirmFirst = true) {
  if (State.cart.length === 0) return;
  if (confirmFirst && !confirm('Are you sure you want to remove all items from your basket?')) {
    return;
  }
  State.cart = [];
  State.appliedPromo = null;
  localStorage.removeItem(STORAGE_KEYS.PROMO);
  saveCart();
  updateCartUI();
  renderProducts();
  showToast('Basket has been cleared.', 'info');
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(State.cart));
  } catch (e) {
    console.error('Failed to save cart to localStorage', e);
  }
}

function calculateCartTotals() {
  let subtotal = 0;
  let itemCount = 0;

  State.cart.forEach(item => {
    const product = State.products.find(p => p.id === item.productId);
    if (product) {
      subtotal += product.price * item.quantity;
      itemCount += item.quantity;
    }
  });

  // Free shipping threshold = LKR 15,000.00
  const freeShippingThreshold = 15000.00;
  const isFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
  const shipping = isFreeShipping ? 0 : 750.00;

  // Promo code discount
  let discountAmount = 0;
  if (State.appliedPromo && State.appliedPromo.discount) {
    discountAmount = subtotal * State.appliedPromo.discount;
  }

  // Estimated Tax / Service: 5%
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * 0.05;

  const total = taxableAmount + shipping + tax;

  return {
    itemCount,
    subtotal,
    discountAmount,
    shipping,
    tax,
    total,
    freeShippingThreshold,
    neededForFreeShipping: Math.max(0, freeShippingThreshold - subtotal)
  };
}

function updateCartUI() {
  const totals = calculateCartTotals();

  // Header badges & subtotal
  const badge = document.getElementById('basket-badge-count');
  const subtotalLabel = document.getElementById('basket-header-subtotal');
  if (badge) badge.textContent = totals.itemCount;
  if (subtotalLabel) subtotalLabel.textContent = formatCurrency(totals.total);

  // Basket Drawer content
  const drawerList = document.getElementById('basket-items-container');
  const emptyView = document.getElementById('basket-empty-view');
  const drawerFooter = document.getElementById('basket-drawer-footer');
  const drawerCountHeader = document.getElementById('drawer-item-count-title');

  if (drawerCountHeader) {
    drawerCountHeader.textContent = `Shopping Basket (${totals.itemCount} items)`;
  }

  // Free Shipping Meter (in LKR)
  const shippingText = document.getElementById('shipping-meter-status');
  const shippingProgressBar = document.getElementById('shipping-progress-fill');
  if (shippingText && shippingProgressBar) {
    if (totals.subtotal === 0) {
      shippingText.innerHTML = `Add <strong>${formatCurrency(15000)}</strong> to unlock FREE Delivery!`;
      shippingProgressBar.style.width = '0%';
    } else if (totals.neededForFreeShipping > 0) {
      const pct = Math.min(100, (totals.subtotal / totals.freeShippingThreshold) * 100);
      shippingText.innerHTML = `Add <strong>${formatCurrency(totals.neededForFreeShipping)}</strong> more for <strong>FREE Delivery</strong>`;
      shippingProgressBar.style.width = `${pct}%`;
    } else {
      shippingText.innerHTML = `🎉 <strong>Congratulations!</strong> You unlocked FREE Delivery!`;
      shippingProgressBar.style.width = '100%';
    }
  }

  if (totals.itemCount === 0) {
    if (drawerList) drawerList.innerHTML = '';
    if (emptyView) emptyView.style.display = 'block';
    if (drawerFooter) drawerFooter.style.display = 'none';
    return;
  }

  if (emptyView) emptyView.style.display = 'none';
  if (drawerFooter) drawerFooter.style.display = 'block';

  // Render Basket items
  if (drawerList) {
    drawerList.innerHTML = State.cart.map(item => {
      const product = State.products.find(p => p.id === item.productId);
      if (!product) return '';
      const lineTotal = product.price * item.quantity;
      const isMaxStock = item.quantity >= product.stock;

      return `
        <div class="basket-item">
          <img src="${product.image}" alt="${product.name}" class="basket-item-img">
          <div class="basket-item-info">
            <h4>${product.name}</h4>
            <div class="basket-item-unit-price">${formatCurrency(product.price)} each</div>
            <div class="quantity-stepper">
              <button 
                class="stepper-btn" 
                onclick="updateCartQuantity(${product.id}, -1)" 
                aria-label="Decrease quantity of ${product.name}">−</button>
              <span class="stepper-qty" aria-label="Quantity">${item.quantity}</span>
              <button 
                class="stepper-btn" 
                onclick="updateCartQuantity(${product.id}, 1)" 
                ${isMaxStock ? 'disabled' : ''} 
                aria-label="Increase quantity of ${product.name}">+</button>
            </div>
          </div>
          <div class="basket-item-actions">
            <span class="basket-item-total">${formatCurrency(lineTotal)}</span>
            <button 
              class="btn-remove-item" 
              onclick="removeFromCart(${product.id})" 
              aria-label="Remove ${product.name} from basket">Remove</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Update Summary numbers in LKR
  document.getElementById('drawer-subtotal-val').textContent = formatCurrency(totals.subtotal);
  document.getElementById('drawer-shipping-val').textContent = totals.shipping === 0 ? 'FREE' : formatCurrency(totals.shipping);
  document.getElementById('drawer-tax-val').textContent = formatCurrency(totals.tax);
  document.getElementById('drawer-grandtotal-val').textContent = formatCurrency(totals.total);

  // Discount display
  const discountRow = document.getElementById('drawer-discount-row');
  if (discountRow) {
    if (totals.discountAmount > 0) {
      discountRow.style.display = 'flex';
      document.getElementById('drawer-discount-val').textContent = `-${formatCurrency(totals.discountAmount)}`;
    } else {
      discountRow.style.display = 'none';
    }
  }
}

// Promo Code Application
function applyPromoCode(inputCode) {
  const code = (inputCode || document.getElementById('promo-input-field').value || '').trim().toUpperCase();
  if (!code) return;

  if (PROMO_CODES[code]) {
    State.appliedPromo = { code, ...PROMO_CODES[code] };
    try {
      localStorage.setItem(STORAGE_KEYS.PROMO, JSON.stringify(State.appliedPromo));
    } catch (e) {}
    updateCartUI();
    showToast(`Promo "${code}" applied: ${PROMO_CODES[code].label}!`, 'success');
  } else {
    showToast('Invalid promo code. Try "UNICART10" for 10% off.', 'danger');
  }
}

// --- Quick View Modal ---

function openQuickView(productId) {
  const product = State.products.find(p => p.id === productId);
  if (!product) return;

  const modalBody = document.getElementById('quick-view-modal-content');
  if (!modalBody) return;

  const savings = (product.originalPrice - product.price);
  const isOutOfStock = product.stock <= 0;

  modalBody.innerHTML = `
    <div class="quick-view-grid">
      <div class="quick-view-img-box">
        <img src="${product.image}" alt="${product.name}" style="max-height: 280px; width: 100%; object-fit: cover; border-radius: var(--radius-md);">
      </div>
      <div>
        <div class="product-meta">
          <span class="category-tag">${product.category}</span>
          <span class="badge badge-${product.badge.toLowerCase().replace(/[^a-z]/g, '')}">${product.badge}</span>
        </div>
        <h2 style="font-size: var(--font-lg); font-weight: 800; margin-bottom: 8px;">${product.name}</h2>
        <div class="rating-box" style="margin-bottom: 12px;">
          <span class="rating-stars">★★★★★</span>
          <span>${product.rating} (${product.reviewsCount} verified reviews)</span>
        </div>
        <div class="product-pricing" style="margin-bottom: 14px;">
          <span class="current-price" style="font-size: var(--font-2xl);">${formatCurrency(product.price)}</span>
          <span class="original-price">${formatCurrency(product.originalPrice)}</span>
          <span class="savings-tag">Save ${formatCurrency(savings)}</span>
        </div>
        <p style="font-size: var(--font-sm); color: var(--text-secondary); margin-bottom: 16px; line-height: 1.6;">
          ${product.fullDescription}
        </p>

        <h4 style="font-size: var(--font-xs); font-weight: 800; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">Technical Specifications</h4>
        <table class="quick-view-specs-table">
          <tbody>
            ${product.specs.map(s => `<tr><th>${s.label}</th><td>${s.value}</td></tr>`).join('')}
          </tbody>
        </table>

        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button 
            class="btn-primary" 
            style="flex: 1;" 
            onclick="addToCart(${product.id}); closeModal('quick-view-modal');"
            ${isOutOfStock ? 'disabled' : ''}>
            ${isOutOfStock ? 'Out of Stock' : 'Add to Basket'}
          </button>
          <button 
            class="btn-secondary" 
            onclick="readProductAloud(${product.id})" 
            title="Read description aloud">
            🔊 Read Aloud
          </button>
        </div>
      </div>
    </div>
  `;

  openModal('quick-view-modal');
}

// --- Mock Checkout Process (4 Steps) ---

function startCheckout() {
  if (State.cart.length === 0) {
    showToast('Your basket is empty. Add products before checking out.', 'warning');
    return;
  }
  closeDrawer('basket-drawer');
  setCheckoutStep(1);
  openModal('checkout-modal');
}

function setCheckoutStep(stepNumber) {
  State.checkout.currentStep = stepNumber;

  for (let i = 1; i <= 4; i++) {
    const stepEl = document.getElementById(`checkout-step-${i}`);
    if (!stepEl) continue;
    stepEl.classList.remove('active', 'completed');
    if (i === stepNumber) {
      stepEl.classList.add('active');
    } else if (i < stepNumber) {
      stepEl.classList.add('completed');
    }
  }

  for (let i = 1; i <= 4; i++) {
    const pane = document.getElementById(`checkout-pane-step-${i}`);
    if (pane) pane.style.display = i === stepNumber ? 'block' : 'none';
  }

  if (stepNumber === 3) {
    renderCheckoutReview();
  }
}

function autofillDemoCustomer() {
  document.getElementById('cust-fullname').value = 'Kavindu Perera';
  document.getElementById('cust-email').value = 'kavindu.perera@students.ac.lk';
  document.getElementById('cust-phone').value = '+94 77 123 4567';
  document.getElementById('cust-address').value = 'No. 42, Galle Road, Bambalapitiya';
  document.getElementById('cust-city').value = 'Colombo 04';
  document.getElementById('cust-postal').value = '00400';
  showToast('Demo Sri Lankan shipping info auto-filled!', 'success');
}

function handleStep1ShippingSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('cust-fullname').value.trim();
  const email = document.getElementById('cust-email').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  const address = document.getElementById('cust-address').value.trim();
  const city = document.getElementById('cust-city').value.trim();
  const postal = document.getElementById('cust-postal').value.trim();

  if (!name || !email || !address || !city || !postal) {
    showToast('Please fill out all required shipping fields.', 'danger');
    return false;
  }

  State.checkout.shippingData = { name, email, phone, address, city, postal };
  setCheckoutStep(2);
  return false;
}

function selectPaymentMethod(method) {
  State.checkout.paymentMethod = method;
  document.querySelectorAll('.payment-method-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.method === method);
  });

  const cardDetails = document.getElementById('card-payment-fields');
  const altDetails = document.getElementById('alt-payment-message');
  if (method === 'card') {
    cardDetails.style.display = 'block';
    altDetails.style.display = 'none';
  } else {
    cardDetails.style.display = 'none';
    altDetails.style.display = 'block';
    altDetails.textContent = method === 'paypal' 
      ? 'You will be redirected to PayPal sandbox mock authorization on final order confirmation.' 
      : 'You can pay in cash or via portable terminal upon arrival of order in Sri Lanka.';
  }
}

function formatCardNumber(input) {
  let val = input.value.replace(/\D/g, '').substring(0, 16);
  let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
  input.value = formatted;

  const preview = document.getElementById('card-preview-number-display');
  if (preview) {
    preview.textContent = formatted || '•••• •••• •••• ••••';
  }
}

function formatCardExpiry(input) {
  let val = input.value.replace(/\D/g, '').substring(0, 4);
  if (val.length >= 3) {
    val = val.substring(0, 2) + '/' + val.substring(2);
  }
  input.value = val;

  const preview = document.getElementById('card-preview-expiry-display');
  if (preview) {
    preview.textContent = val || 'MM/YY';
  }
}

function updateCardHolderPreview(input) {
  const preview = document.getElementById('card-preview-holder-display');
  if (preview) {
    preview.textContent = input.value.trim() || 'FULL NAME';
  }
}

function handleStep2PaymentSubmit(event) {
  event.preventDefault();

  if (State.checkout.paymentMethod === 'card') {
    const cardNum = document.getElementById('card-number').value.replace(/\s/g, '');
    const cardName = document.getElementById('card-name').value.trim();
    const cardExp = document.getElementById('card-expiry').value.trim();
    const cardCvv = document.getElementById('card-cvv').value.trim();

    if (cardNum.length < 15 || !cardName || cardExp.length < 5 || cardCvv.length < 3) {
      showToast('Please enter valid credit card details.', 'danger');
      return false;
    }

    State.checkout.cardData = {
      maskedNumber: `•••• •••• •••• ${cardNum.slice(-4)}`,
      name: cardName,
      expiry: cardExp
    };
  }

  setCheckoutStep(3);
  return false;
}

function renderCheckoutReview() {
  const container = document.getElementById('checkout-review-summary');
  if (!container) return;

  const totals = calculateCartTotals();
  const s = State.checkout.shippingData || {};

  container.innerHTML = `
    <div style="background: var(--bg-subtle); padding: 16px; border-radius: var(--radius-md); margin-bottom: 16px;">
      <h4 style="font-size: var(--font-sm); font-weight: 800; margin-bottom: 8px;">Delivery Destination</h4>
      <p style="font-size: var(--font-xs); color: var(--text-secondary); line-height: 1.5;">
        <strong>${s.name}</strong><br>
        ${s.address}, ${s.city}, ${s.postal}<br>
        Email: ${s.email} | Phone: ${s.phone || 'N/A'}
      </p>
    </div>

    <div style="background: var(--bg-subtle); padding: 16px; border-radius: var(--radius-md); margin-bottom: 16px;">
      <h4 style="font-size: var(--font-sm); font-weight: 800; margin-bottom: 8px;">Payment Method</h4>
      <p style="font-size: var(--font-xs); color: var(--text-secondary);">
        ${State.checkout.paymentMethod === 'card' 
          ? `💳 Card: ${State.checkout.cardData ? State.checkout.cardData.maskedNumber : 'Ending in 4242'}`
          : (State.checkout.paymentMethod === 'paypal' ? '🅿️ Mock PayPal Account' : '💵 Cash / Pay on Delivery')}
      </p>
    </div>

    <h4 style="font-size: var(--font-sm); font-weight: 800; margin-bottom: 8px;">Order Items (${totals.itemCount})</h4>
    <div style="max-height: 160px; overflow-y: auto; margin-bottom: 16px; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 8px;">
      ${State.cart.map(item => {
        const product = State.products.find(p => p.id === item.productId);
        if (!product) return '';
        return `
          <div style="display: flex; justify-content: space-between; font-size: var(--font-xs); padding: 6px 0; border-bottom: 1px solid var(--border-light);">
            <span>${product.name} × ${item.quantity}</span>
            <span style="font-weight: 700;">${formatCurrency(product.price * item.quantity)}</span>
          </div>
        `;
      }).join('')}
    </div>

    <div style="background: var(--bg-surface); border: 1.5px solid var(--primary); border-radius: var(--radius-md); padding: 14px;">
      <div style="display: flex; justify-content: space-between; font-size: var(--font-sm); margin-bottom: 4px;">
        <span>Items Subtotal:</span><span>${formatCurrency(totals.subtotal)}</span>
      </div>
      ${totals.discountAmount > 0 ? `
        <div style="display: flex; justify-content: space-between; font-size: var(--font-sm); color: var(--success); margin-bottom: 4px;">
          <span>Promo Discount (${State.appliedPromo.code}):</span><span>-${formatCurrency(totals.discountAmount)}</span>
        </div>` : ''}
      <div style="display: flex; justify-content: space-between; font-size: var(--font-sm); margin-bottom: 4px;">
        <span>Estimated Delivery:</span><span>${totals.shipping === 0 ? 'FREE' : formatCurrency(totals.shipping)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: var(--font-sm); margin-bottom: 8px;">
        <span>Estimated Tax (5%):</span><span>${formatCurrency(totals.tax)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: var(--font-lg); font-weight: 800; border-top: 1px solid var(--border-light); padding-top: 8px;">
        <span>Final Total:</span><span style="color: var(--primary);">${formatCurrency(totals.total)}</span>
      </div>
    </div>
  `;
}

function placeFinalOrder() {
  const termsCheckbox = document.getElementById('chk-terms-agree');
  if (termsCheckbox && !termsCheckbox.checked) {
    showToast('Please accept the order terms and universal accessibility agreement.', 'warning');
    return;
  }

  const totals = calculateCartTotals();
  const orderId = `UC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const orderDate = new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

  // 1. Deduct Inventory Stock in LocalStorage
  State.cart.forEach(cartItem => {
    const prod = State.products.find(p => p.id === cartItem.productId);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - cartItem.quantity);
    }
  });
  saveProducts(State.products);

  // 2. Prepare Order Object
  const orderRecord = {
    orderId,
    orderDate,
    items: State.cart.map(item => {
      const p = State.products.find(prod => prod.id === item.productId);
      return {
        id: item.productId,
        name: p ? p.name : 'Unknown Product',
        price: p ? p.price : 0,
        quantity: item.quantity,
        total: p ? p.price * item.quantity : 0
      };
    }),
    shippingData: State.checkout.shippingData,
    paymentMethod: State.checkout.paymentMethod,
    maskedCard: State.checkout.cardData ? State.checkout.cardData.maskedNumber : null,
    totals: { ...totals }
  };

  // 3. Save to Past Orders in LocalStorage
  saveOrderToHistory(orderRecord);

  // 4. Render Step 4 Confirmation & Invoice
  renderOrderConfirmation(orderRecord);

  // 5. Clear Basket
  clearCart(false);

  // 6. Transition Step
  setCheckoutStep(4);
  speakText(`Order confirmed! Your order reference is ${orderId}. Total paid is ${totals.total.toLocaleString()} Sri Lankan Rupees. Thank you for shopping with UniCart.`);
  showToast(`Order ${orderId} placed successfully!`, 'success');
}

function saveOrderToHistory(order) {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const orders = stored ? JSON.parse(stored) : [];
    orders.unshift(order);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save order history', e);
  }
}

function renderOrderConfirmation(order) {
  const container = document.getElementById('checkout-confirmation-container');
  if (!container) return;

  container.innerHTML = `
    <div class="order-success-view">
      <div class="success-badge-circle" aria-hidden="true">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
      </div>
      <h3>Payment &amp; Order Confirmed!</h3>
      <p style="font-size: var(--font-sm); color: var(--text-secondary); margin-bottom: 14px;">
        A confirmation email has been dispatched to <strong>${order.shippingData.email}</strong>.
      </p>

      <div class="order-ref-box">
        Order Reference: <code>${order.orderId}</code>
      </div>

      <div class="invoice-preview-card" id="printable-receipt">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--border-medium); padding-bottom: 12px; margin-bottom: 14px;">
          <div>
            <h3 style="font-size: var(--font-lg); font-weight: 900; color: var(--primary);">UniCart Universal Store</h3>
            <span style="font-size: 11px; color: var(--text-muted);">BSc(Hons) Software Engineering Project (Sri Lanka)</span>
          </div>
          <div style="text-align: right; font-size: var(--font-xs);">
            <strong>Invoice #: ${order.orderId}</strong><br>
            <span>Date: ${order.orderDate}</span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: var(--font-xs); margin-bottom: 16px;">
          <div>
            <strong>Billed &amp; Shipped To:</strong><br>
            ${order.shippingData.name}<br>
            ${order.shippingData.address}<br>
            ${order.shippingData.city}, ${order.shippingData.postal}<br>
            Phone: ${order.shippingData.phone || 'N/A'}
          </div>
          <div>
            <strong>Payment Method:</strong><br>
            ${order.paymentMethod === 'card' ? `Credit Card (${order.maskedCard || '•••• 4242'})` : order.paymentMethod.toUpperCase()}<br>
            <strong>Status:</strong> <span style="color: var(--success); font-weight: 700;">PAID &amp; CONFIRMED</span><br>
            <strong>Estimated Dispatch:</strong> Next Business Day
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: var(--font-xs); margin-bottom: 16px;">
          <thead>
            <tr style="background: var(--bg-surface); border-bottom: 1px solid var(--border-medium);">
              <th style="text-align: left; padding: 6px;">Item Description</th>
              <th style="text-align: center; padding: 6px;">Qty</th>
              <th style="text-align: right; padding: 6px;">Unit Price (LKR)</th>
              <th style="text-align: right; padding: 6px;">Amount (LKR)</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr style="border-bottom: 1px solid var(--border-light);">
                <td style="padding: 6px;">${item.name}</td>
                <td style="text-align: center; padding: 6px;">${item.quantity}</td>
                <td style="text-align: right; padding: 6px;">${formatCurrency(item.price)}</td>
                <td style="text-align: right; padding: 6px; font-weight: 700;">${formatCurrency(item.total)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="text-align: right; font-size: var(--font-xs); line-height: 1.6;">
          <div>Subtotal: <strong>${formatCurrency(order.totals.subtotal)}</strong></div>
          ${order.totals.discountAmount > 0 ? `<div>Discount: <strong style="color: var(--success);">- ${formatCurrency(order.totals.discountAmount)}</strong></div>` : ''}
          <div>Shipping: <strong>${order.totals.shipping === 0 ? 'FREE' : formatCurrency(order.totals.shipping)}</strong></div>
          <div>Tax (5%): <strong>${formatCurrency(order.totals.tax)}</strong></div>
          <div style="font-size: var(--font-base); font-weight: 900; margin-top: 6px; border-top: 1px solid var(--border-medium); padding-top: 6px;">
            Total Paid: <span style="color: var(--primary);">${formatCurrency(order.totals.total)}</span>
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
        <button class="btn-primary" onclick="window.print()">
          🖨️ Print / Save Receipt
        </button>
        <button class="btn-secondary" onclick="closeModal('checkout-modal'); openOrdersModal();">
          📜 View Past Orders
        </button>
        <button class="btn-secondary" onclick="closeModal('checkout-modal');">
          🛍️ Continue Shopping
        </button>
      </div>
    </div>
  `;
}

// --- Past Orders History Modal ---

function openOrdersModal() {
  const container = document.getElementById('orders-history-list');
  if (!container) return;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const orders = stored ? JSON.parse(stored) : [];

    if (orders.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <svg style="width: 48px; height: 48px; color: var(--text-muted); margin: 0 auto 12px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          <h4>No Prior Orders Found</h4>
          <p style="font-size: var(--font-xs); color: var(--text-muted); margin-top: 4px;">Any mock purchases completed in this browser session are persisted here in LocalStorage.</p>
        </div>
      `;
    } else {
      container.innerHTML = orders.map((o, idx) => `
        <div style="background: var(--bg-subtle); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 14px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <strong style="color: var(--primary); font-size: var(--font-sm);">${o.orderId}</strong>
            <span style="font-size: 11px; background: var(--success-bg); color: var(--success); padding: 2px 8px; border-radius: var(--radius-full); font-weight: 700;">Paid</span>
          </div>
          <div style="font-size: var(--font-xs); color: var(--text-secondary); margin-bottom: 8px;">
            Placed on ${o.orderDate} • ${o.items.length} items
          </div>
          <div style="font-size: var(--font-xs); color: var(--text-muted); margin-bottom: 8px;">
            ${o.items.map(i => `${i.name} (×${i.quantity})`).join(', ')}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 8px;">
            <span style="font-size: var(--font-xs); font-weight: 700;">Total: ${formatCurrency(o.totals.total)}</span>
            <button class="btn-secondary" style="padding: 4px 10px; font-size: 11px;" onclick="renderOrderConfirmationFromHistory(${idx})">
              View Receipt
            </button>
          </div>
        </div>
      `).join('');
    }
  } catch (e) {
    console.error(e);
  }

  openModal('orders-modal');
}

function renderOrderConfirmationFromHistory(index) {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const orders = stored ? JSON.parse(stored) : [];
    if (orders[index]) {
      closeModal('orders-modal');
      renderOrderConfirmation(orders[index]);
      setCheckoutStep(4);
      openModal('checkout-modal');
    }
  } catch (e) {}
}

function clearOrdersHistory() {
  if (!confirm('Clear all stored order history from localStorage?')) return;
  localStorage.removeItem(STORAGE_KEYS.ORDERS);
  openOrdersModal();
  showToast('Order history cleared.', 'info');
}

// --- Reset All Demo Data (Stock, Cart, Settings) ---

function resetAllDemoData() {
  if (!confirm('Reset catalog stock to original 10 items in LKR, empty shopping basket, and reset demo data?')) {
    return;
  }
  State.products = resetProducts();
  State.cart = [];
  State.appliedPromo = null;
  localStorage.removeItem(STORAGE_KEYS.CART);
  localStorage.removeItem(STORAGE_KEYS.PROMO);
  localStorage.removeItem(STORAGE_KEYS.ORDERS);

  renderProducts();
  updateCartUI();
  showToast('All demo data and inventory successfully reset to LKR!', 'success');
}

function resetAllFilters() {
  State.activeCategory = 'All';
  State.searchQuery = '';
  State.maxPrice = 80000;
  State.inStockOnly = false;
  State.sortBy = 'featured';

  // Update DOM controls
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';

  const catSelect = document.getElementById('search-category-select');
  if (catSelect) catSelect.value = 'All';

  const priceSlider = document.getElementById('price-range-slider');
  const priceDisplay = document.getElementById('price-val-display');
  if (priceSlider) priceSlider.value = 80000;
  if (priceDisplay) priceDisplay.textContent = formatCurrency(80000);

  const chkStock = document.getElementById('chk-instock-only');
  if (chkStock) chkStock.checked = false;

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.value = 'featured';

  document.querySelectorAll('.subnav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.categoryTarget === 'All');
  });

  renderProducts();
  showToast('Filters reset to default.', 'info');
}

// --- Modal & Drawer Helpers ---

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  const backdrop = document.getElementById('modal-backdrop');
  if (modal && backdrop) {
    backdrop.classList.add('active');
    modal.classList.add('active');
    modal.focus();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  const backdrop = document.getElementById('modal-backdrop');
  if (modal) modal.classList.remove('active');
  const anyModalActive = document.querySelector('.modal-window.active, .basket-drawer.active');
  if (!anyModalActive && backdrop) {
    backdrop.classList.remove('active');
  }
}

function openDrawer(drawerId) {
  const drawer = document.getElementById(drawerId);
  const backdrop = document.getElementById('modal-backdrop');
  if (drawer && backdrop) {
    backdrop.classList.add('active');
    drawer.classList.add('active');
  }
}

function closeDrawer(drawerId) {
  const drawer = document.getElementById(drawerId);
  const backdrop = document.getElementById('modal-backdrop');
  if (drawer) drawer.classList.remove('active');
  const anyModalActive = document.querySelector('.modal-window.active');
  if (!anyModalActive && backdrop) {
    backdrop.classList.remove('active');
  }
}

function closeAllModalsAndDrawers() {
  document.querySelectorAll('.modal-window.active').forEach(m => m.classList.remove('active'));
  document.querySelectorAll('.basket-drawer.active').forEach(d => d.classList.remove('active'));
  const backdrop = document.getElementById('modal-backdrop');
  if (backdrop) backdrop.classList.remove('active');
}

// --- Toast System ---

let toastTimeout;
function showToast(message, type = 'info', showUndo = false) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');

  toast.innerHTML = `
    <span>${message}</span>
    ${showUndo ? `<button class="toast-undo-btn" onclick="undoLastRemoval(); this.parentElement.remove();">Undo</button>` : ''}
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('active'));

  setTimeout(() => {
    toast.classList.remove('active');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// --- Event Listeners Wiring ---

function initEventListeners() {
  // Backdrop click closes modals & drawers
  const backdrop = document.getElementById('modal-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', closeAllModalsAndDrawers);
  }

  // Basket Drawer Trigger Buttons
  document.querySelectorAll('.btn-open-basket').forEach(btn => {
    btn.addEventListener('click', () => openDrawer('basket-drawer'));
  });

  // Search Input live typing with debouncing
  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear-btn');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      State.searchQuery = e.target.value;
      if (clearBtn) clearBtn.classList.toggle('active', e.target.value.length > 0);
      renderProducts();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      State.searchQuery = '';
      clearBtn.classList.remove('active');
      renderProducts();
      searchInput.focus();
    });
  }

  // Category select in search form
  const searchCategorySelect = document.getElementById('search-category-select');
  if (searchCategorySelect) {
    searchCategorySelect.addEventListener('change', (e) => {
      State.activeCategory = e.target.value;
      document.querySelectorAll('.subnav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.categoryTarget === e.target.value);
      });
      renderProducts();
    });
  }

  // Subnav Category Pills
  document.querySelectorAll('.subnav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category-target');
      State.activeCategory = cat;
      document.querySelectorAll('.subnav-btn').forEach(b => b.classList.toggle('active', b === btn));
      if (searchCategorySelect) searchCategorySelect.value = cat;
      renderProducts();
    });
  });

  // Price range slider (in LKR: min 5000, max 80000, step 1000)
  const priceSlider = document.getElementById('price-range-slider');
  const priceDisplay = document.getElementById('price-val-display');
  if (priceSlider) {
    priceSlider.addEventListener('input', (e) => {
      State.maxPrice = parseFloat(e.target.value);
      if (priceDisplay) priceDisplay.textContent = formatCurrency(State.maxPrice);
      renderProducts();
    });
  }

  // In Stock Checkbox
  const chkInStock = document.getElementById('chk-instock-only');
  if (chkInStock) {
    chkInStock.addEventListener('change', (e) => {
      State.inStockOnly = e.target.checked;
      renderProducts();
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      State.sortBy = e.target.value;
      renderProducts();
    });
  }

  // Accessibility Controls inside Settings Modal
  document.querySelectorAll('.btn-theme-opt').forEach(btn => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
  });

  document.querySelectorAll('.btn-font-size').forEach(btn => {
    btn.addEventListener('click', () => applyFontSize(btn.dataset.size));
  });

  const chkDyslexic = document.getElementById('chk-dyslexic-font');
  if (chkDyslexic) {
    chkDyslexic.addEventListener('change', (e) => applyDyslexicFont(e.target.checked));
  }

  const chkMotion = document.getElementById('chk-reduced-motion');
  if (chkMotion) {
    chkMotion.addEventListener('change', (e) => applyReducedMotion(e.target.checked));
  }

  const chkSpeech = document.getElementById('chk-speech-toggle');
  if (chkSpeech) {
    chkSpeech.checked = State.settings.speechEnabled;
    chkSpeech.addEventListener('change', (e) => {
      State.settings.speechEnabled = e.target.checked;
      saveSettings();
    });
  }
}

// --- Keyboard Navigation & Accessibility Shortcuts ---

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    const isEditing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);

    if (e.key === 'Escape') {
      closeAllModalsAndDrawers();
      return;
    }

    if (isEditing) return;

    if (e.key === '?' || (e.shiftKey && e.key === '/')) {
      e.preventDefault();
      openModal('a11y-modal');
    } else if (e.key.toLowerCase() === 'c') {
      e.preventDefault();
      const drawer = document.getElementById('basket-drawer');
      if (drawer && drawer.classList.contains('active')) {
        closeDrawer('basket-drawer');
      } else {
        openDrawer('basket-drawer');
      }
    } else if (e.key === '/' || e.key.toLowerCase() === 's') {
      e.preventDefault();
      const searchInput = document.getElementById('search-input');
      if (searchInput) searchInput.focus();
    }
  });
}

// --- Browser LocalStorage Live Inspector ---

function openStorageInspector(activeTab = 'cart') {
  const container = document.getElementById('storage-inspector-tabs');
  const codeBox = document.getElementById('storage-inspector-content');
  if (!container || !codeBox) return;

  const tabs = [
    { id: 'cart', label: '🛒 Shopping Basket', key: STORAGE_KEYS.CART },
    { id: 'products', label: '📦 Products Catalog & Stock', key: STORAGE_KEYS.PRODUCTS },
    { id: 'orders', label: '📜 Order History Invoices', key: STORAGE_KEYS.ORDERS },
    { id: 'settings', label: '♿ User Settings', key: STORAGE_KEYS.SETTINGS }
  ];

  container.innerHTML = tabs.map(t => {
    const isCurrent = t.id === activeTab;
    return `
      <button 
        type="button"
        class="btn-secondary" 
        style="font-size: 11px; padding: 6px 12px; border-radius: var(--radius-md); ${isCurrent ? 'background: var(--primary); color: #ffffff; border-color: var(--primary); font-weight: 700;' : ''}" 
        onclick="openStorageInspector('${t.id}')">
        ${t.label}
      </button>
    `;
  }).join('');

  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];
  const rawData = localStorage.getItem(currentTab.key);
  try {
    const formatted = rawData ? JSON.stringify(JSON.parse(rawData), null, 2) : 'null // (Key is empty or not yet seeded)';
    codeBox.textContent = `// JavaScript API: window.localStorage.getItem("${currentTab.key}")\n\n${formatted}`;
  } catch (e) {
    codeBox.textContent = rawData || 'No data';
  }

  openModal('storage-modal');
}

function refreshStorageInspector() {
  openStorageInspector('cart');
  showToast('LocalStorage live data inspector refreshed!', 'info');
}
