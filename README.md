# UniCart - Universal E-Commerce Web Application

**Program:** BSc (Hons) Software Engineering  
**Level:** Year 3  
**Module Task:** Task 1 – Application Development (40%)  
**Group Size:** Three Students (03)  
**Currency:** Sri Lankan Rupee (LKR)  

---

### Student Group Details (Submission Metadata)
| Student Number | Full Name | Contribution / Area |
| :--- | :--- | :--- |
| **Student 1 (Lead)** | `[Student 1 Name]` | Architecture, UI/UX Design System, Universal Design Standards (WCAG AAA) |
| **Student 2** | `[Student 2 Name]` | Catalog Data Model, LocalStorage Engine, Dynamic Filter & Search System |
| **Student 3** | `[Student 3 Name]` | Basket Management, Multi-step Mock Checkout, Payment Validation & Invoicing |

---

## 1. Project Overview & Fulfillment of Specifications

UniCart is a production-grade, highly accessible e-commerce platform designed along similar lines to industry leaders such as **Amazon**, **eBay**, and **Argos**, customized with **LKR (Sri Lankan Rupee)** pricing and **real commercial product photography**. The system has been developed strictly utilizing **HTML5, CSS3, and JavaScript only** without third-party frameworks, libraries, or build steps.

All state transitions, catalog stocks, shopping basket operations, mock checkout orders, and accessibility preferences are managed persistently in the browser's **LocalStorage API**.

### Academic Specification Compliance Checklist:
- [x] **HTML, CSS, JavaScript ONLY:** No React, Next.js, jQuery, or Tailwind CSS used. 100% pure client-side web technologies.
- [x] **LocalStorage Persistence:** Products catalog, inventory counts, shopping basket items, promo codes, past order invoices, and accessibility preferences persist across page reloads.
- [x] **Universal Design Standards with a Purpose:** Comprehensive implementation of the 7 Principles of Universal Design (WCAG AAA high-contrast theme, scalable typography, dyslexia font mode, reduced motion mode, screen reader support with Web Speech API audio synthesis, and keyboard shortcuts).
- [x] **Exactly 10 Products with Different Prices (LKR):** Catalog contains exactly 10 distinct products, each with a unique price in LKR, specifications, stock count, and real studio product photograph.
- [x] **Exactly 3 Categories:** Divided into `Electronics` (4 items), `Clothing` (3 items), and `Food` (3 items).
- [x] **Shopping Basket Operations:** Add products in stock, live quantity increment/decrement (+/-), stock limit bounds enforcement, item removal with undo option, and free delivery progress tracking.
- [x] **Mock Checkout & Payment Process:** 4-step wizard (Shipping details with 1-click Sri Lankan demo autofill, Interactive Card/PayPal/COD payment selection with live credit card visualizer, Order Review, and Printable Confirmation Invoice with unique Order IDs).
- [x] **Strict Directory Constraint (No Subfolders):** All HTML, CSS, JavaScript, real image assets, and documentation are placed directly in the **root folder** without any subfolders or subdirectories, ensuring seamless LMS zip submission and execution.

---

## 2. Product Catalog Breakdown (Exactly 10 Products, 3 Categories - LKR)

All 10 products have unique, non-repeating prices in **Sri Lankan Rupees (LKR)**, initial stock levels, real photographs, and category assignments:

| # | Product Name | Category | Price (LKR) | Orig. Price (LKR) | Initial Stock | Image Asset | Key Feature Highlight |
|---|:---|:---:|:---:|:---:|:---:|:---:|:---|
| **1** | Aura Sound Pro Wireless Noise-Cancelling Headphones | **Electronics** | **LKR 58,500.00** | LKR 69,900.00 | 12 | `product-1.jpg` | 40h Battery, Hybrid ANC, Hi-Res Audio |
| **2** | PulseFit Ultra GPS Smartwatch Series 7 | **Electronics** | **LKR 45,900.00** | LKR 54,000.00 | 8 | `product-2.jpg` | 1.78" AMOLED, ECG & SpO2, 5 ATM Water |
| **3** | Lumina 4K Ultra-HD Waterproof Action Camera | **Electronics** | **LKR 68,000.00** | LKR 79,500.00 | 4 *(Low Stock)* | `product-3.jpg` | 4K/60fps, EIS 3.0, Dual Screens |
| **4** | HyperCharge 65W GaN Fast Dual-Port Charger | **Electronics** | **LKR 12,500.00** | LKR 15,200.00 | 25 | `product-4.jpg` | Gallium Nitride III, Dual USB-C & USB-A |
| **5** | Merino Wool Thermal Crewneck Sweater | **Clothing** | **LKR 26,800.00** | LKR 32,500.00 | 15 | `product-5.jpg` | 100% Superfine Merino Wool, Tagless |
| **6** | WeatherShield All-Season Technical Rain Parka | **Clothing** | **LKR 49,900.00** | LKR 58,000.00 | 6 | `product-6.jpg` | 10,000mm Waterproof, Taped Seams |
| **7** | UrbanFlex Ergonomic Active Stretch Joggers | **Clothing** | **LKR 17,900.00** | LKR 21,500.00 | 19 | `product-7.jpg` | 4-Way Stretch, Hidden Zipper Pockets |
| **8** | Artisan Single-Origin Arabica Coffee Beans (1kg) | **Food** | **LKR 8,900.00** | LKR 10,500.00 | 30 | `product-8.jpg` | Direct Trade Ethiopian, Medium-Dark Roast |
| **9** | Wild Mountain Blossom Raw Organic Honey (500g) | **Food** | **LKR 5,950.00** | LKR 7,200.00 | 14 | `product-9.jpg` | Unpasteurized, Cold-Extracted, Pure |
| **10** | Cold-Pressed Extra Virgin Estate Olive Oil (750ml)| **Food** | **LKR 10,800.00** | LKR 13,000.00 | 9 | `product-10.jpg`| Tuscan Estate, First Cold Press, Acidity <0.2% |

*Notice: Each price is unique (LKR 58,500.00, LKR 45,900.00, LKR 68,000.00, LKR 12,500.00, LKR 26,800.00, LKR 49,900.00, LKR 17,900.00, LKR 8,900.00, LKR 5,950.00, LKR 10,800.00).*

---

## 3. Implementation of the 7 Universal Design Principles

The design of UniCart explicitly adheres to the established Universal Design standards:

1. **Equitable Use:**
   - Universal interface suitable for users with diverse visual and physical abilities.
   - Built-in **High Contrast Mode** surpassing WCAG AAA contrast ratio guidelines (black background, high-visibility yellow `#facc15` and white accents).
   - Seamless compatibility with screen readers and assistive devices.
2. **Flexibility in Use:**
   - Multiple filtering methods: Category selection, dynamic search query with live debounced filtering, price slider (LKR 5,000 - LKR 80,000), and in-stock toggle.
   - Multiple navigation modalities: Mouse, touch-screen gestures, and full keyboard control.
   - Built-in **Text-to-Speech (TTS)**: Listen to product descriptions, price, and stock info with 1 click in Sri Lankan Rupees.
3. **Simple and Intuitive Use:**
   - Standardized e-commerce interaction paradigms familiar to users of Amazon and Argos.
   - 4-step linear checkout progress bar (`Shipping` → `Payment` → `Review` → `Confirmation`).
   - Clear stock indicators with traffic-light color coding (Green = In Stock, Amber = Low Stock, Red = Out of Stock).
4. **Perceptible Information:**
   - Information redundancy: Color is never the sole visual indicator; icons, numeric badges, text, and audible feedback are provided simultaneously.
   - Dynamic `aria-live="polite"` regions inform screen reader users of basket updates and total price changes.
5. **Tolerance for Error:**
   - Quantity bounds checking prevents adding items beyond available physical stock.
   - Item removal provides an immediate **"Undo"** toast notification.
   - Input validation with descriptive error guidance and a **"1-Click Auto-Fill Demo Data"** button (with Sri Lankan address) to eliminate typing errors during evaluation.
6. **Low Physical Effort:**
   - Sticky header provides immediate access to search, basket drawer, and accessibility preferences from anywhere on the page.
   - 1-click quick add-to-basket directly from the catalog.
   - Keyboard shortcuts (`C` for Basket, `/` for Search, `?` for Accessibility, `ESC` for closing overlays).
7. **Size and Space for Approach and Use:**
   - Compliant with touch target guidelines (minimum 44 × 44 pixels for all interactive buttons and inputs).
   - Responsive layouts optimized across mobile phones (375px+), tablets, laptops, and ultra-wide desktops.

---

## 4. LocalStorage Architecture

All persistent data structures are stored under versioned keys in the browser's `localStorage`:

| Key Name | Purpose | Data Type | Example Content |
|:---|:---|:---:|:---|
| `unicart_products_realimg_v3` | Product catalog with live stock levels in LKR | Array of Objects | `[{ id: 1, name: "...", price: 58500, stock: 12, image: "product-1.jpg" }]` |
| `unicart_cart_realimg_v3` | Current shopping basket items | Array of Objects | `[{ productId: 1, quantity: 2 }]` |
| `unicart_orders_realimg_v3` | History of placed mock orders | Array of Objects | `[{ orderId: "UC-2026-92810", total: 58500, ... }]` |
| `unicart_settings_v3` | User accessibility settings | Object | `{ theme: "light", fontSize: "base", dyslexicFont: false }` |
| `unicart_applied_promo_realimg_v3`| Active promotional voucher | Object | `{ code: "UNICART10", discount: 0.10 }` |

---

## 5. File Directory Structure (Single Folder / No Subfolders)

In accordance with LMS submission instructions, **all files reside in a single flat directory**:

```text
UniCart/
├── README.md           # Comprehensive Project Documentation & Academic Details
├── index.html          # Main Application Page & Modal Interfaces
├── style.css           # Design Tokens, Accessibility Styles & Responsive CSS
├── products.js         # 10 Products Catalog & LocalStorage Seed Logic (LKR)
├── app.js              # Application Controller, Basket & Checkout Engine (LKR)
├── logo.svg            # UniCart Vector Brand Logo
├── product-1.jpg       # Real Wireless Headphones Studio Photo (Electronics)
├── product-2.jpg       # Real AMOLED Smartwatch Photo (Electronics)
├── product-3.jpg       # Real 4K Action Camera Photo (Electronics)
├── product-4.jpg       # Real GaN Fast Charger Photo (Electronics)
├── product-5.jpg       # Real Merino Wool Sweater Photo (Clothing)
├── product-6.jpg       # Real Technical Rain Parka Photo (Clothing)
├── product-7.jpg       # Real Active Joggers Pants Photo (Clothing)
├── product-8.jpg       # Real Arabica Coffee Beans Photo (Food)
├── product-9.jpg       # Real Raw Organic Honey Jar Photo (Food)
└── product-10.jpg      # Real Estate Olive Oil Bottle Photo (Food)
```

---

## 6. How to Run & Test the Application

1. **Option A (XAMPP / Local Web Server):**
   - Copy or clone the `UniCart` folder into your Apache htdocs directory:
     `/Applications/XAMPP/xamppfiles/htdocs/UniCart/`
   - Start Apache via the XAMPP Control Panel.
   - Open your browser and navigate to:  
     `http://localhost/UniCart/`

2. **Option B (Direct File Execution):**
   - Simply double-click `index.html` to open it directly in Google Chrome, Mozilla Firefox, Apple Safari, or Microsoft Edge (`file:///Applications/XAMPP/xamppfiles/htdocs/UniCart/index.html`).
   - The entire application will operate with 100% functionality since all resources are self-contained.

3. **Evaluation Quick-Testing Steps:**
   - **Adding to Basket:** Click "Add to Basket" on any product. Notice the badge counter update and toast notification.
   - **Free Delivery:** Add items totaling over `LKR 15,000.00` to observe the free delivery unlock animation.
   - **Discount Code:** Open the basket drawer and enter `UNICART10` (or click the hero promo code card) to apply a 10% discount on LKR totals.
   - **Checkout Wizard:** Click "Proceed to Checkout" in the basket. On Step 1, click **"1-Click Auto-Fill Demo Data"** to automatically populate Sri Lankan shipping information.
   - **Interactive Payment:** On Step 2, observe the real-time Credit Card visualizer updates as details are entered.
   - **Order Confirmation & Invoicing:** On Step 3, confirm the order. Observe the stock reduction, generated invoice in LKR, and receipt printer dialog.
   - **Order History:** Click "My Orders" in the header to view persisted orders in `localStorage`.
   - **Universal Accessibility:** Click "Accessibility" in the header to switch to **High Contrast Theme**, adjust text scale, or enable dyslexic typography.
   - **Resetting Demo Data:** Click "↺ Reset All Demo Data (LKR)" in the footer or settings modal anytime to restore initial conditions.
