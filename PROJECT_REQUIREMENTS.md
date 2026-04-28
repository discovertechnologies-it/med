# Medicine eCommerce App — Detailed Project Requirements

> Source modules: see [Readme.md](Readme.md)
> Status: **Locked v1** — implementation may begin. Changes require a written amendment.
> Target market: India

---

## 1. Project Overview

### 1.1 Vision

A **mobile-first responsive web** medicine eCommerce platform — designed for small viewports first, scaling up to tablet and desktop — that lets users search by salt/composition (not just brand), upload prescriptions, get cheaper generic alternatives, and reorder/refill chronic medication on schedule.

> **Mobile-first ≠ mobile app.** This is a single web application accessed via a browser on any device. We design and build for mobile screens first (most Indian pharmacy users are on phones), then progressively enhance for larger screens. There is no native iOS/Android app in scope.

### 1.2 Goals

- Make prescription medicines orderable in <2 minutes from search → checkout
- Surface generic alternatives to help users save 30–80% on chronic meds
- Hit 99% prescription approval SLA under 30 minutes during pharmacist hours
- Re-engage users via refill reminders and subscription auto-orders

### 1.3 Non-Goals (v1)

- Tele-consultation / doctor booking
- Lab tests / diagnostics
- Insurance claims integration
- B2B / wholesale pharmacy supply

### 1.4 Success Metrics

| Metric                            | Target (6 months post-launch) |
| --------------------------------- | ----------------------------- |
| Daily active users                | 5,000                         |
| Order conversion rate             | ≥ 4%                          |
| Prescription approval median time | ≤ 15 min                      |
| Repeat order rate (90-day)        | ≥ 35%                         |
| Generic substitution acceptance   | ≥ 25%                         |
| App crash-free sessions           | ≥ 99.5%                       |

---

## 2. Tech Stack

### 2.1 Frontend (Mobile-first web SPA, JSX, no TypeScript)

| Concern               | Choice                          | Notes                                                              |
| --------------------- | ------------------------------- | ------------------------------------------------------------------ |
| Framework             | **React 18 (JSX)**              | Plain `.jsx` files, no TS                                          |
| Build tool            | **Vite**                        | Fast dev server, simple config; alternative: CRA (not recommended) |
| Routing               | **React Router v6**             | Client-side routing for SPA                                        |
| State management      | **Zustand**                     | Slices per domain (auth, cart, catalog, orders, ui)                |
| HTTP client           | **Axios**                       | Single shared instance with interceptors for auth + error handling |
| Toast / notifications | **Sonner**                      | Order placed, errors, prescription approved/rejected feedback      |
| Forms & validation    | React Hook Form + Yup           | Schema validation without TS                                       |
| Styling               | Tailwind CSS                    | Utility-first; pairs well with shadcn-style components             |
| UI primitives         | Radix UI / Headless UI          | Accessible primitives (modal, dropdown, dialog)                    |
| Animation             | **Framer Motion**               | Page transitions, micro-interactions, gestures, layout animations  |
| Scroll & gestures     | `@use-gesture/react` (optional) | For complex pan/swipe/drag — Framer's built-ins cover most cases   |
| Icons                 | lucide-react                    | Consistent icon set, animated where useful via Framer              |
| Image handling        | browser-image-compression       | Compress prescription uploads client-side before sending           |
| Date utilities        | date-fns                        | Lightweight, tree-shakable                                         |
| Linting               | ESLint + Prettier               | `eslint-plugin-react`, `eslint-plugin-react-hooks`                 |
| Testing               | Vitest + React Testing Library  | Unit + component tests                                             |
| E2E                   | Playwright                      | Critical flows: search → checkout → order                          |

> **No TypeScript.** All component files are `.jsx`. Use **JSDoc** comments for type hints on complex props/utilities, and PropTypes optionally on shared components.

### 2.2 Backend & Infrastructure

| Layer         | Choice                                                                  | Rationale                                              |
| ------------- | ----------------------------------------------------------------------- | ------------------------------------------------------ |
| API           | Node.js (Express or NestJS)                                             | Pairs well with JS frontend; OpenAPI via swagger-jsdoc |
| DB            | PostgreSQL (primary) + Redis (cache/queue)                              | ACID for orders, Redis for cart/session/rate-limit     |
| Search        | Meilisearch or Typesense                                                | Typo-tolerant, fast autocomplete (key UX requirement)  |
| File Storage  | S3-compatible (AWS S3 / Cloudflare R2)                                  | Prescription images                                    |
| Payments      | Razorpay (UPI/Card) + COD flow                                          | Best India coverage; webhooks for reconciliation       |
| Notifications | MSG91 (SMS) + SES (email) + Web Push (VAPID)                            | Web push instead of FCM mobile                         |
| Maps / Geo    | Google Maps Platform / Mapbox                                           | Address picker, ETA, serviceability                    |
| Observability | Sentry + OpenTelemetry → Grafana Cloud                                  | Errors + traces + metrics                              |
| CI/CD         | GitHub Actions                                                          | Build + deploy web and API                             |
| Hosting       | AWS (ap-south-1, Mumbai) — frontend on Cloudflare Pages / S3+CloudFront | Data residency for DPDP compliance                     |

### 2.3 Project Structure (web)

```
src/
  api/               // axios instance + endpoint modules (authApi.js, catalogApi.js…)
  store/             // zustand slices (useAuthStore.js, useCartStore.js…)
  pages/             // route-level components (Home.jsx, Search.jsx, Cart.jsx…)
  components/        // shared UI (Button.jsx, ProductCard.jsx…)
  features/          // domain folders (auth/, cart/, prescriptions/…)
  hooks/             // custom hooks (useDebounce.js, usePincode.js…)
  utils/             // pure helpers (formatPrice.js, validators.js…)
  routes/            // router config + ProtectedRoute.jsx
  styles/            // tailwind.css, globals.css
  App.jsx
  main.jsx
```

> **Open decision:** monorepo (frontend + backend in one repo with workspaces) vs separate repos. Recommend monorepo for tighter API/UI iteration.

---

## 3. User Roles

| Role             | Capabilities                                                                       |
| ---------------- | ---------------------------------------------------------------------------------- |
| Guest            | Browse, search, view product details                                               |
| Customer         | All guest + cart, checkout, order, prescriptions, reviews, wishlist, subscriptions |
| Pharmacist       | Verify prescriptions, approve/reject orders containing Rx items                    |
| Delivery Partner | Web/PWA — pick up, update status, capture POD                                      |
| Catalog Manager  | Add/edit medicines, manage stock, pricing, alternatives mapping                    |
| Customer Support | View any order, raise refunds, chat with users                                     |
| Admin            | All of the above + user management, reports, configuration                         |

---

## 4. Functional Requirements (per module)

### 4.1 Account & Authentication

- **FR-1.1** Sign up with mobile number + OTP (primary). Email optional.
- **FR-1.2** OTP via MSG91 with rate limit: max 3 OTPs per number per 10 min, 10 per day.
- **FR-1.3** OTP length 6 digits, 5-min validity, 3 retries, then block 30 min.
- **FR-1.4** Profile: name, DOB (compute age), gender (M/F/Other/Prefer not to say), optional blood group, optional emergency contact.
- **FR-1.5** Multiple saved addresses (label, line1, line2, landmark, city, state, pincode, lat/lng). Default address flag.
- **FR-1.6** Prescription locker: list, upload, view, soft-delete (retain 7 years per pharmacy regulations).
- **FR-1.7** Manage family members (Add up to 5 dependents — name, age, relation; orders can be tagged to them).
- **FR-1.8** Logout from current device + "logout all devices".
- **FR-1.9** Account deletion request flow (DPDP Act compliance) — soft delete + 30-day grace + anonymize order history.

### 4.2 Medicine Search & Discovery

- **FR-2.1** Search bar with debounced autocomplete (200 ms), typo tolerance (edit distance ≤ 2).
- **FR-2.2** Search index fields: brand name, salt/composition, manufacturer, category, common misspellings, hindi/regional aliases.
- **FR-2.3** Filters: price range (slider), brand vs generic toggle, prescription required (yes/no/either), availability, manufacturer, pack size.
- **FR-2.4** Sort: relevance (default), price low→high, high→low, discount %, popularity.
- **FR-2.5** Categories with icons: Tablets, Syrups, Capsules, Injections, Devices, Wellness, Personal Care, Ayurveda.
- **FR-2.6** Recent searches (last 10, per user).
- **FR-2.7** Trending searches (global, refreshed daily).
- **FR-2.8** Search by salt MUST return all brands/generics with that composition, ranked by price-per-unit.
- **FR-2.9** Empty state: "No results — try uploading a prescription instead."

### 4.3 Medicine Details Page

- **FR-3.1** Display: brand name, generic/salt name, manufacturer, pack size, MRP, selling price, discount %, in-stock status with delivery ETA for pincode.
- **FR-3.2** Sections: Composition, Uses, How it works, Side effects, Precautions, Storage, FAQs.
- **FR-3.3** "Requires Prescription" badge for Schedule H/H1/X drugs (sourced from catalog flag).
- **FR-3.4** Cheaper alternatives section: list ≥3 generics with same salt, sorted by price-per-unit, showing % savings.
- **FR-3.5** Frequently bought together (collaborative filtering, fallback to manual mapping).
- **FR-3.6** Manufacturer info, country of origin, expiry policy ("min 3 months expiry guaranteed").
- **FR-3.7** Reviews summary (rating, count, top review).
- **FR-3.8** Share button (deep link).
- **FR-3.9** Add to cart / Add to wishlist actions, sticky bottom CTA on mobile-width viewports.

### 4.4 Prescription Upload & Management

- **FR-4.1** Upload via file picker (drag-and-drop on desktop, camera capture on mobile browsers via `<input capture>`).
- **FR-4.2** Max 5 images per prescription, 10 MB each, JPEG/PNG/PDF only.
- **FR-4.3** Client-side compression with `browser-image-compression` (target ≤1 MB) before upload; server stores original + thumbnail.
- **FR-4.4** Optional metadata: doctor name, clinic, prescription date, patient name (defaults to user).
- **FR-4.5** Prescription status: `Pending` → `Under Review` → `Approved` / `Rejected (with reason)` / `Clarification Needed`.
- **FR-4.6** Pharmacist queue: FIFO with priority bumps for orders > ₹500 or marked urgent.
- **FR-4.7** Pharmacist actions: approve, reject (with reason from dropdown + free text), request clarification (chat with user).
- **FR-4.8** Auto-expire pending prescriptions after 30 days.
- **FR-4.9** Reuse: user can attach an existing prescription to a new order (within 6 months of issue date).
- **FR-4.10** Prescription metadata never displayed to non-pharmacist roles in plaintext (PII).

### 4.5 Cart Management

- **FR-5.1** Cart persists across sessions (server-side for logged-in, local for guest, merge on login).
- **FR-5.2** Add/remove items, qty 1–10 (configurable per medicine).
- **FR-5.3** Validation on cart load: stock check, price refresh, prescription requirement re-check.
- **FR-5.4** If any item is Rx-required and no prescription attached → block checkout with CTA "Upload prescription".
- **FR-5.5** Price breakdown: subtotal, discount, coupon, delivery fee, GST/tax, packaging, total.
- **FR-5.6** Show estimated delivery date for current pincode.
- **FR-5.7** "Save for later" moves item to wishlist.
- **FR-5.8** Free delivery threshold display ("Add ₹X more for free delivery").

### 4.6 Checkout & Payments

- **FR-6.1** Address selection (default pre-selected, "Use current location", "Add new").
- **FR-6.2** Delivery options: Standard (24–48h), Express (≤2h, where available), Pickup at partner pharmacy (if available).
- **FR-6.3** Coupon entry with validation (one coupon per order, server-validated).
- **FR-6.4** Payment methods:
  - UPI (intent + collect flow via Razorpay)
  - Credit/Debit card (Razorpay)
  - Net banking
  - Wallets (Paytm, PhonePe via Razorpay)
  - COD (only if pincode allows + order < ₹5000)
- **FR-6.5** Idempotent order creation — `Idempotency-Key` header to prevent double charge on retry.
- **FR-6.6** Payment webhook reconciliation — verify on `payment.captured`, mark order `Confirmed` only after.
- **FR-6.7** Failed payment → cart preserved, retry option, hold inventory for 15 min.
- **FR-6.8** Tax invoice generated post-confirmation (GST-compliant PDF).

### 4.7 Order Management

- **FR-7.1** Order states: `Created` → `Payment Pending` → `Confirmed` → `Prescription Review` → `Packed` → `Shipped` → `Out for Delivery` → `Delivered` / `Cancelled` / `Returned` / `Refunded`.
- **FR-7.2** State transitions logged with timestamp + actor (user/pharmacist/system/delivery).
- **FR-7.3** Cancellation allowed before `Packed`. After `Shipped`, only return flow.
- **FR-7.4** Return window: 7 days post-delivery, only for damaged/wrong items (not for Rx meds once seal broken — regulatory).
- **FR-7.5** Order history with filters (date range, status), pagination.
- **FR-7.6** Invoice download (PDF), share via WhatsApp/email.
- **FR-7.7** Order timeline visualization with current step highlighted.

### 4.8 Real-Time Tracking

- **FR-8.1** Status updates via in-app polling/WebSocket + optional Web Push (VAPID) at every state transition.
- **FR-8.2** Live ETA based on delivery partner location (when available).
- **FR-8.3** Delivery partner card: name, phone (masked via call-mask service), photo.
- **FR-8.4** Map view showing delivery route (optional, behind feature flag in v1; embedded Google/Mapbox).
- **FR-8.5** Delivery OTP for handover (Rx orders mandatory).
- **FR-8.6** Proof of delivery: signature or photo capture by delivery partner.

### 4.9 Notifications & Alerts

- **FR-9.1** Channels: in-app toasts (Sonner), Web Push (VAPID, opt-in), SMS (transactional, MSG91), Email (SES), WhatsApp Business (optional v2).
- **FR-9.2** Triggers: order placed, payment success/fail, prescription approved/rejected, packed, shipped, OFD, delivered, refund initiated, refund completed, refill due.
- **FR-9.3** **In-app feedback (Sonner toasts)** for synchronous actions: add to cart, login success/fail, OTP sent, coupon applied/invalid, address saved, payment in progress, validation errors. Toast positions: top-right desktop, bottom mobile.
- **FR-9.4** User notification preferences screen (per-channel toggles by category).
- **FR-9.5** Quiet hours respected (no non-critical SMS/push 10pm–7am IST).
- **FR-9.6** Refill reminders: schedule based on last order qty + dosage info, sent 3 days before estimated stockout.

### 4.10 Reorder & Subscription

- **FR-10.1** "Order again" — one-click from order history; revalidates stock/price/prescription.
- **FR-10.2** Subscription frequencies: weekly, biweekly, monthly, every N months.
- **FR-10.3** Auto-create order N days before due date, pause/skip/cancel anytime.
- **FR-10.4** Prescription auto-attach (uses latest valid one for that medicine).
- **FR-10.5** Subscription dashboard: list, next delivery date, edit qty/frequency, payment method on file.
- **FR-10.6** If saved card expires or UPI mandate ends → notify user 7 days prior.

### 4.11 Reviews & Ratings

- **FR-11.1** 1–5 star rating + optional text review (10–500 chars).
- **FR-11.2** Only verified buyers can review (must have delivered order for that SKU).
- **FR-11.3** Moderation queue (auto-flag profanity + manual review).
- **FR-11.4** Display: average rating, distribution histogram, paginated reviews, helpful votes, sort by recent/helpful.
- **FR-11.5** No medical claims allowed in reviews — auto-flag keywords ("cured my", "diagnosed with", etc.).

### 4.12 Wishlist

- **FR-12.1** Save/unsave from any product card or detail page.
- **FR-12.2** List view with stock status, price-drop badge, quick add to cart.
- **FR-12.3** Price drop alert notification (opt-in).

### 4.13 Smart Suggestions

- **FR-13.1** Cheaper generic alternatives card on PDP and in cart ("Save ₹X by switching").
- **FR-13.2** Frequently bought together — top 5 SKUs.
- **FR-13.3** Personalized recommendations on home screen (based on order history, viewed items, category affinity).
- **FR-13.4** Cold start: show trending + best-sellers by category.

### 4.14 Location & Availability

- **FR-14.1** Detect location via browser Geolocation API (with permission) or manual pincode entry.
- **FR-14.2** Serviceability check: pincode allowlist + distance from nearest fulfillment hub.
- **FR-14.3** Per-pincode delivery ETA shown on PDP, cart, checkout.
- **FR-14.4** Out-of-serviceable-area: show "Notify when available" CTA.

### 4.15 Help & Support

- **FR-15.1** FAQ — searchable, categorized (Orders, Payments, Returns, Prescriptions, Account).
- **FR-15.2** In-app chat widget (third-party: Freshchat/Intercom embed) — handover to human agents during business hours.
- **FR-15.3** "Report an issue" from any order with photo upload.
- **FR-15.4** WhatsApp support deep link.
- **FR-15.5** Call support during 9am–9pm IST.

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Search response p95 < 300 ms
- PDP load p95 < 1.5 s on 4G
- Add-to-cart action < 200 ms
- First Contentful Paint < 1.8 s, Largest Contentful Paint < 2.5 s, CLS < 0.1, INP < 200 ms (Core Web Vitals "Good")
- JS bundle (initial route) < 250 KB gzipped; lazy-load route chunks via `React.lazy`
- API throughput: 500 req/sec sustained, 2000 burst

### 5.2 Availability

- 99.5% monthly uptime for customer-facing APIs
- Catalog read available even if write services degrade (cache-first)
- Graceful degradation: if search down, show category browse

### 5.3 Security

- All traffic TLS 1.3
- Passwords (if any): bcrypt cost 12 (OTP-only flow preferred)
- JWT access tokens (15 min) + refresh tokens (30 days, rotated)
- Sensitive PII (Rx images, address, DOB) encrypted at rest (AES-256, KMS)
- Rate limiting on auth, OTP, payment endpoints
- OWASP top 10 mitigation: input validation (Yup on client, server-side validators on API), parameterized queries (no raw SQL with concat), CSP headers, no `dangerouslySetInnerHTML`, sanitize HTML in product descriptions/reviews (DOMPurify)
- Axios interceptor attaches access token, refreshes on 401, redirects to login on refresh fail; never store tokens in `localStorage` for sensitive contexts — prefer `httpOnly` cookies for refresh, in-memory for access
- API keys/secrets via AWS Secrets Manager — never in repo
- Audit log for all admin/pharmacist actions (immutable)

### 5.4 Compliance

- **DPDP Act 2023** — explicit consent for data processing, withdrawal flow, data export, account deletion
- **Drugs and Cosmetics Act + Schedule H/H1/X** — prescription verification before dispensing, retain Rx for 2 years (H1), audit trail
- **GST** — tax invoice with HSN codes, GSTIN of pharmacy
- **Pharmacy Council registration** — display pharmacist name/license in app footer
- Cookie/tracking consent on web

### 5.5 Mobile-First Responsive Design

- Design and build for the **smallest viewport (320 px) first**, then progressively enhance for larger screens. CSS uses `min-width` media queries only — never `max-width`.
- Tailwind config: default styles target mobile; `sm:`, `md:`, `lg:`, `xl:` prefixes layer on tablet/desktop refinements.
- **Breakpoints:** mobile 320–639, large mobile 640–767, tablet 768–1023, desktop 1024–1279, wide 1280+.
- **Layout patterns:**
  - Single-column mobile, multi-column from `md:` upward.
  - Bottom nav bar / sticky CTAs on mobile; replaced by top nav + sidebar on desktop.
  - Mobile uses full-screen drawers/sheets for filters, address picker, cart; desktop uses inline panels or modals.
  - Forms: stacked labels and full-width inputs on mobile; two-column with side labels on desktop where it improves density.
- **Touch ergonomics:** primary actions reachable in the lower 60% of the viewport (thumb zone) on mobile.
- Tap targets ≥ 44×44 px; ≥ 8 px spacing between adjacent targets.
- **Performance budget tuned for mobile:** target 4G (≤ 1.6 Mbps, 150 ms RTT) and mid-tier Android Chrome — not desktop fiber.
- Images served via responsive `srcset` + `sizes` (mobile gets smaller variants, saves bandwidth).
- Test on real devices: at minimum a low-end Android (e.g. Redmi 9, Snapdragon 4xx) before each release.
- Avoid hover-only interactions — every hover state must have a tap/focus equivalent.
- iOS Safari quirks must be tested: viewport units, `100vh` keyboard issue, sticky positioning, input zoom on focus (use `font-size: 16px` minimum on inputs).
- **Optional PWA:** manifest + service worker so users can "Add to Home Screen" — gives an app-like launcher without being a native app.

### 5.6 Accessibility

- WCAG 2.1 AA
- Screen reader labels (NVDA, JAWS, VoiceOver) on all interactive elements; semantic HTML, proper `aria-*` attributes
- Keyboard-only navigation must complete the full happy path (search → checkout)
- Min touch target 44×44 px on mobile breakpoints
- Color contrast ≥ 4.5:1 for body text
- Sonner toasts must use `role="status"` (default) and respect `prefers-reduced-motion`
- Multi-language support (v2): Hindi + English (i18n keys from day 1 via `react-i18next`)

### 5.6A Premium UI & Motion (Framer Motion)

The product must feel premium, calm, and trustworthy — this is health, not gaming. Motion supports comprehension and feedback; it never decorates.

#### Visual language

- **Light theme only.** No dark mode in v1. No `prefers-color-scheme` listeners.
- **Strict 60-30-10 split:** 60% surface neutral, 30% text/structural neutral, 10% primary + accent.
- **No gradients anywhere** — solid fills only.

##### Locked color tokens

These are the v1 palette. Do not invent new shades — extend `tailwind.config.js` `theme.extend.colors` only with these names.

| Token              | Hex       | Usage                                                          |
| ------------------ | --------- | -------------------------------------------------------------- |
| `bg.page`          | `#FAFAF8` | Page background (warm off-white)                               |
| `bg.surface`       | `#FFFFFF` | Card / sheet / input background                                |
| `bg.muted`         | `#F4F4F2` | Section backgrounds, image placeholders, skeleton base         |
| `bg.image`         | `#F7F7F8` | Product photo background (never pure white)                    |
| `border.subtle`    | `#E8E8E4` | Hairlines, dividers, input border (default)                    |
| `border.strong`    | `#D4D4CF` | Input border on hover/focus-within outer                       |
| `text.primary`     | `#0F1B1A` | Body text, headings (deep teal-tinted near-black)              |
| `text.secondary`   | `#5A615F` | Secondary copy, metadata                                       |
| `text.tertiary`    | `#9CA29F` | Disabled, placeholder, timestamps                              |
| `primary.default`  | `#0F766E` | Primary actions, links, brand surface (deep medical teal)      |
| `primary.hover`    | `#0B5C56` | Primary hover state                                            |
| `primary.muted`    | `#E6F2F0` | Primary surface tint (pills, badges, selected backgrounds)     |
| `accent.default`   | `#E1623D` | Savings highlights, discount badges, "Save ₹X" tags (warm coral)|
| `accent.muted`     | `#FBE9E2` | Accent surface tint                                            |
| `success.default`  | `#157F46` | Success state, in-stock, prescription approved                 |
| `success.muted`    | `#E2F2EA` | Success badge backgrounds                                      |
| `warning.default`  | `#B7791F` | Pending, prescription under review                             |
| `warning.muted`    | `#FBF1DC` | Warning badge backgrounds                                      |
| `danger.default`   | `#B42318` | Errors, rejections, out-of-stock, danger CTAs                  |
| `danger.muted`     | `#FBE9E7` | Error toast / inline backgrounds                               |

> All foreground/background pairings above pass WCAG AA contrast (4.5:1 for body, 3:1 for large/UI).

##### Typography

- **Single family: Inter** (variable font, weights 400 / 500 / 600 / 700). Loaded self-hosted from `/fonts/` (no Google Fonts hotlink — DPDP/EU privacy hygiene).
- Fallback stack: `'Inter var', 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`.
- Numerics use `font-feature-settings: 'tnum' 1, 'cv11' 1` for tabular figures (prices, OTPs, order IDs).
- Type scale (mobile → desktop):

  | Role     | Mobile        | Desktop (`md:` and up) | Weight | Line-height |
  | -------- | ------------- | ---------------------- | ------ | ----------- |
  | Display  | 28 / 1.15     | 36 / 1.1               | 700    | tight       |
  | H1       | 24 / 1.2      | 28 / 1.2               | 700    | tight       |
  | H2       | 20 / 1.25     | 22 / 1.25              | 600    | tight       |
  | H3       | 18 / 1.3      | 18 / 1.3               | 600    | tight       |
  | Body L   | 16 / 1.6      | 16 / 1.6               | 400    | generous    |
  | Body     | 14 / 1.55     | 14 / 1.55              | 400    | generous    |
  | Caption  | 12 / 1.5      | 12 / 1.5               | 500    | generous    |
  | Label    | 13 / 1.2 uppercase tracked | same | 600    | tight       |

- **All inputs use 16 px** to prevent iOS zoom on focus — even though Body is 14 px.

##### Spacing scale

8 px base, never invent values. Use Tailwind classes only (`p-1` 4, `p-2` 8, `p-3` 12, `p-4` 16, `p-6` 24, `p-8` 32, `p-12` 48, `p-16` 64). Arbitrary values (`p-[17px]`) are banned outside truly dynamic positioning.

##### Corner radii

| Element                          | Class           | Pixels |
| -------------------------------- | --------------- | ------ |
| Inputs, small chips              | `rounded-lg`    | 8      |
| Cards, list items                | `rounded-xl`    | 12     |
| Hero blocks, large sheets        | `rounded-2xl`   | 16     |
| Bottom sheet (top corners only)  | `rounded-t-3xl` | 24     |
| Pills, avatars, primary CTAs     | `rounded-full`  | 9999   |

No square corners (`rounded-none` is banned).

##### Shadows

Tinted with the text color, never pure black. Two presets:

```js
// tailwind.config.js theme.extend.boxShadow
'card': '0 1px 2px rgba(15, 27, 26, 0.04), 0 4px 12px rgba(15, 27, 26, 0.06)',
'pop':  '0 2px 4px rgba(15, 27, 26, 0.05), 0 12px 28px rgba(15, 27, 26, 0.10)',
'focus':'0 0 0 2px #FAFAF8, 0 0 0 4px #0F766E', // for focus-visible rings
```

##### Iconography & illustration

- **Icons:** `lucide-react` only. Stroke `1.5`, size `20` for inline UI, `24` for primary nav. No filled icon sets, no FontAwesome, no Heroicons.
- **Illustrations:** thin-line, two-tone (primary `#0F766E` + neutral `#5A615F` on transparent). Stored as SVG in `src/assets/illustrations/`. Used only for empty states and onboarding. No 3D renders, no isometric, no cartoon.
- **Imagery:** product photos on `bg.image` (`#F7F7F8`). Aspect ratio fixed at 1:1 for cards, 4:3 for PDP hero. No background removal artifacts.

##### Density

- List items: ≥ 16 px vertical padding, ≥ 16 px horizontal.
- Section vertical rhythm: 32 px gap between sections on mobile, 48 px on desktop.
- Hairlines (`border.subtle`) instead of heavy dividers.

#### Motion principles

1. **Purposeful** — every animation answers a question (where did this come from? what changed? what's loading?).
2. **Fast** — 150–250 ms for micro-interactions, 300–400 ms for layout/page transitions, max 600 ms. Never make the user wait for animation.
3. **Spring physics, not linear easing** — Framer Motion `spring` with `stiffness: 300, damping: 30` as default; ease-out (`[0.22, 1, 0.36, 1]`) for non-spring cases.
4. **Respectful** — `useReducedMotion()` gate on every non-essential animation. When reduced motion is on, fall back to opacity-only or instant transitions.
5. **GPU-friendly** — animate only `transform` and `opacity`. Never animate `width`, `height`, `top`, `left` directly — use `layout` prop or scale/translate instead.
6. **Never block input** — animations must not delay clickability of revealed elements; primary actions remain clickable mid-transition.
7. **One source of truth** — motion variants and durations live in `src/motion/` as named tokens (e.g. `fadeUp`, `springSoft`, `staggerChildren`). Components consume tokens, do not hardcode.

#### Required animation patterns

| Surface / interaction                         | Behavior                                                                                         |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Page transitions                              | `AnimatePresence` with route key — fade + 8 px Y translate, 250 ms ease-out                      |
| List rendering (search results, cart, orders) | Staggered fade-up, 30–50 ms per item, max 8 items animated; rest just fade                       |
| Card hover (desktop) / tap (mobile)           | Scale `1 → 1.02`, soft shadow lift, 150 ms                                                       |
| Button press                                  | Scale `1 → 0.97` on `whileTap`, spring back                                                      |
| Add-to-cart                                   | Pill flies from CTA toward cart icon (fixed-position layout animation) + cart icon pulses        |
| Cart icon badge                               | Number changes via `<motion.span key={count}>` for count-up effect                               |
| Modal / drawer open                           | Backdrop fades, sheet slides in from bottom on mobile (drag-to-dismiss), fades+scales on desktop |
| Bottom sheet (mobile)                         | Drag handle, snap points (collapsed/expanded), velocity-aware close                              |
| Skeleton → content                            | Cross-fade 200 ms, no pop-in                                                                     |
| Image load                                    | `motion.img` with `initial={{ opacity: 0 }} animate={{ opacity: 1 }}` once `onLoad` fires        |
| Form errors                                   | Field shake (3 cycles, 5 px), red border fade-in, error text slide-down                          |
| OTP entry                                     | Each digit box scales briefly when filled; success state turns green with check-icon morph       |
| Order timeline                                | Steps illuminate sequentially; current step has subtle pulse                                     |
| Tab/segment change                            | Underline/pill slides between options with `layoutId`                                            |
| Accordion (PDP sections)                      | Height auto via `layout` prop; chevron rotates 180°                                              |
| Dropdown/menu                                 | Origin-aware scale-in (top-right or top-left depending on anchor)                                |
| Toast (Sonner)                                | Already premium by default; do not override                                                      |
| Pull-to-refresh (mobile)                      | Spinner reveal with rubber-band physics                                                          |
| Filter chip toggle                            | Background color crossfade + scale `0.95 → 1` bounce                                             |
| Search results "no results"                   | Illustration fades in with subtle float loop (3 s y-translate ±4 px)                             |

#### Don'ts

- No bouncy spring on every element — primary CTAs use restrained motion.
- No infinite background animations except for skeleton shimmer and the one "no results" illustration float.
- No parallax effects.
- No animations that delay critical content (search results must render fast even if stagger is in progress).
- No carousels that auto-advance.
- No emojis in animated elements.
- No glitch / matrix / neon effects.

#### Verification

- Each new component lists its motion behavior in PR description.
- Lighthouse Performance must stay ≥ 90 on mobile despite animations.
- Test with `prefers-reduced-motion: reduce` enabled — site must remain fully usable.
- Test on a 90 Hz mid-tier Android device — no jank during page transitions.

### 5.7 Observability

- Structured JSON logs with `traceId`, `userId` (hashed), `orderId`
- Metrics: order funnel, payment success rate, Rx approval time, search latency, error rates
- Alerting: PagerDuty/Opsgenie for SEV-1 (payment failure spike, API 5xx > 1%, DB connection saturation)
- Dashboards: business KPIs + system health

### 5.8 Scalability

- Stateless API services behind ALB, autoscale on CPU + RPS
- DB: read replicas for catalog, partitioned orders table after 10M rows
- CDN (Cloudfront) for static assets and product images
- Background jobs (BullMQ/Celery) for heavy tasks: Rx OCR, image processing, refill reminders

---

## 6. Data Model (Core Entities)

```
User
  id, mobile (E.164), email?, name, dob, gender, blood_group?, created_at, kyc_status
  → has many: Address, Prescription, Order, Subscription, FamilyMember

Address
  id, user_id, label, line1, line2, landmark, city, state, pincode, lat, lng, is_default

FamilyMember
  id, user_id, name, age, relation, gender

Medicine (Catalog)
  id, brand_name, generic_name, salt_composition, manufacturer_id, pack_size,
  mrp, selling_price, hsn_code, gst_rate, schedule (H/H1/X/OTC), category_id,
  requires_prescription, is_active, expiry_buffer_days, search_aliases[]

Stock
  medicine_id, hub_id, qty_available, qty_reserved, updated_at

Prescription
  id, user_id, image_urls[], doctor_name?, clinic?, issue_date?, status,
  rejection_reason?, reviewed_by (pharmacist_id)?, reviewed_at?, expires_at

Cart
  id, user_id (or session_id), items[{medicine_id, qty, price_snapshot}], updated_at

Order
  id, user_id, address_snapshot, items[{medicine_id, qty, unit_price, discount}],
  subtotal, discount, coupon_code?, delivery_fee, tax, total,
  payment_method, payment_status, order_status, prescription_ids[],
  delivery_partner_id?, expected_delivery_at, placed_at, family_member_id?

OrderEvent
  id, order_id, event_type, actor_type, actor_id, payload_json, created_at

Payment
  id, order_id, gateway, gateway_order_id, gateway_payment_id, amount,
  status, method, captured_at, refunded_amount

Subscription
  id, user_id, medicine_id, qty, frequency, next_run_at, status, payment_method_id

Review
  id, user_id, medicine_id, order_id, rating, text, status (pending/approved/rejected),
  helpful_count

Coupon
  code, discount_type (flat/pct), value, min_order, max_discount, valid_from, valid_to,
  usage_limit, per_user_limit, applicable_categories[]

Notification
  id, user_id, channel, template_id, payload, status, sent_at
```

---

## 6A. Frontend Architecture Detail

### 6A.1 Zustand Stores (Slices)

| Store                  | Responsibility                                                                    |
| ---------------------- | --------------------------------------------------------------------------------- |
| `useAuthStore`         | `user`, `accessToken`, `isAuthenticated`, `login()`, `logout()`, `hydrate()`      |
| `useCartStore`         | `items[]`, `addItem()`, `removeItem()`, `updateQty()`, `applyCoupon()`, `clear()` |
| `useCatalogStore`      | `recentSearches`, `lastViewed`, `categoryCache` (short-TTL)                       |
| `useOrderStore`        | `orders[]`, `currentOrder`, `fetchOrders()`, `cancelOrder()`                      |
| `usePrescriptionStore` | `prescriptions[]`, `uploadProgress`, `upload()`, `attach()`                       |
| `useUIStore`           | `pincode`, `addressDrawerOpen`, `theme`, `prefs`                                  |
| `useWishlistStore`     | `items[]`, `toggle()`                                                             |

- **Persistence:** use `persist` middleware for `useCartStore` (guest cart in `localStorage`), `useUIStore` (pincode, theme), `useAuthStore` (only refresh token if not using httpOnly cookie).
- **Devtools:** `devtools` middleware enabled in dev only.
- **Selector pattern:** components subscribe via narrow selectors `useCartStore(s => s.items.length)` to avoid re-renders.

### 6A.2 Axios Setup

```js
// src/api/client.js
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 15000,
  withCredentials: true, // for httpOnly refresh cookie
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    if (error.response?.status === 401) {
      // refresh flow, retry once, else logout
    }
    if (error.response?.status >= 500) {
      toast.error("Something went wrong. Please try again.");
    }
    return Promise.reject(error);
  },
);
```

- Per-domain modules: `authApi.js`, `catalogApi.js`, `cartApi.js`, `ordersApi.js`, `rxApi.js`, `paymentsApi.js`.
- Each function returns the unwrapped `data` field, never the raw response.
- Cancellation via `AbortController` for search-as-you-type.
- Idempotency: order POST passes a UUID `Idempotency-Key` header (regenerated only after success).

### 6A.3 Sonner Conventions

| Action                  | Variant | Message example                               |
| ----------------------- | ------- | --------------------------------------------- |
| Add to cart             | success | "Added Dolo 650 to cart"                      |
| Remove from cart        | default | "Removed from cart" + Undo action             |
| OTP sent                | default | "OTP sent to +91 98xxx xxx21"                 |
| Login success           | success | "Welcome back, Vaibhav"                       |
| Validation error (form) | error   | inline FIRST, toast only on submit failures   |
| Network error (>= 500)  | error   | "Something went wrong. Please try again."     |
| Coupon applied          | success | "FLAT100 applied — you saved ₹100"            |
| Prescription uploaded   | success | "Prescription uploaded — under review"        |
| Prescription rejected   | error   | "Prescription rejected. See reason."          |
| Order placed            | success | "Order #A1B2 placed"                          |
| Payment failed          | error   | "Payment failed. Cart preserved — try again." |

- Mount `<Toaster richColors closeButton position="top-right" />` once in `App.jsx`.
- Promise-based toasts for long ops: `toast.promise(api.uploadRx(file), { loading, success, error })`.
- Never block UI for toast — they are advisory; errors must also surface inline where relevant.

### 6A.4 Routes (React Router)

```
/                          Home
/search                    Search results
/category/:slug            Category browse
/medicine/:id              PDP
/cart                      Cart
/checkout                  Checkout (protected)
/checkout/payment          Payment step
/orders                    Order history (protected)
/orders/:id                Order detail (protected)
/orders/:id/track          Tracking (protected)
/prescriptions             Rx locker (protected)
/account                   Profile, addresses, family (protected)
/subscriptions             Subscription dashboard (protected)
/wishlist                  Wishlist (protected)
/help                      FAQ + chat
/auth/login                Phone + OTP
/admin/*                   Pharmacist console (role-gated)
*                          404
```

`<ProtectedRoute>` reads `useAuthStore` and redirects unauthenticated users to `/auth/login?next=...`.

---

## 7. API Surface (Indicative)

```
Auth
  POST   /auth/otp/request           { mobile }
  POST   /auth/otp/verify            { mobile, otp } → { access, refresh }
  POST   /auth/refresh               { refresh } → { access }
  POST   /auth/logout

Profile
  GET    /me
  PATCH  /me
  GET    /me/addresses
  POST   /me/addresses
  PATCH  /me/addresses/:id
  DELETE /me/addresses/:id
  GET    /me/family
  POST   /me/family

Catalog
  GET    /search?q=&filters=&sort=&page=
  GET    /categories
  GET    /medicines/:id
  GET    /medicines/:id/alternatives

Cart
  GET    /cart
  POST   /cart/items                 { medicine_id, qty }
  PATCH  /cart/items/:id             { qty }
  DELETE /cart/items/:id
  POST   /cart/coupon                { code }

Prescriptions
  POST   /prescriptions              (multipart upload)
  GET    /prescriptions
  GET    /prescriptions/:id
  DELETE /prescriptions/:id

Checkout & Orders
  POST   /checkout/quote             { address_id, delivery_option }
  POST   /orders                     { ...order payload, idempotency_key }
  GET    /orders
  GET    /orders/:id
  POST   /orders/:id/cancel
  POST   /orders/:id/return-request
  GET    /orders/:id/invoice

Payments
  POST   /payments/initiate          { order_id, method }
  POST   /payments/webhook           (gateway → server)

Subscriptions
  GET    /subscriptions
  POST   /subscriptions
  PATCH  /subscriptions/:id          (pause/resume/skip/edit)
  DELETE /subscriptions/:id

Reviews & Wishlist
  POST   /reviews
  GET    /medicines/:id/reviews
  GET    /wishlist
  POST   /wishlist                   { medicine_id }
  DELETE /wishlist/:medicine_id

Notifications
  GET    /notifications
  PATCH  /notifications/preferences

Pharmacist (Admin)
  GET    /admin/rx-queue
  POST   /admin/prescriptions/:id/approve
  POST   /admin/prescriptions/:id/reject
```

All responses follow envelope `{ data, meta, error }`. Errors use RFC 7807 Problem+JSON.

---

## 8. Key User Flows

### 8.1 Happy Path Order

1. User opens app → home shows trending + last ordered
2. Searches "metformin 500" → results show brand + 3 cheaper generics
3. Selects generic → PDP shows ₹X savings vs brand
4. Add to cart → cart shows Rx required banner
5. Click "Upload prescription" → file picker (or camera on mobile browser) → submit → Sonner toast "Prescription uploaded — under review" → Pending status
6. Proceed to checkout (allowed; will block actual ship until Rx approved)
7. Select address, delivery, UPI payment → Razorpay intent → success
8. Order Confirmed → goes to Rx queue
9. Pharmacist approves within SLA → order moves to Packed
10. Shipped → OFD → Delivered with OTP
11. Refill reminder fires 27 days later

### 8.2 Rx Rejection Path

- Pharmacist rejects with reason "Prescription expired (>6 months)"
- User notified via Web Push + SMS + in-app Sonner toast on next visit; order moves to `Cancelled`
- Refund auto-initiated within 24h, completed in 5–7 business days
- User prompted to upload new prescription

### 8.3 COD Path

- Same as 8.1 but skip step 7 payment; on delivery, partner collects cash and marks `Delivered + Paid` in their app

---

## 9. Phasing / Milestones

### M1 — Foundation (Weeks 1–4)

- Repo setup (Vite + React JSX scaffold), CI/CD, environments (dev/staging/prod)
- Axios client + interceptors, Zustand store skeleton (auth, ui), Sonner provider, router shell, Tailwind base
- Auth (OTP), profile, addresses
- Catalog ingestion pipeline + search index
- Basic browse + PDP

### M2 — Transact (Weeks 5–8)

- Cart store (Zustand), checkout, Razorpay web checkout integration, COD
- Order placement + state machine
- Pharmacist console v1 (Rx review)
- Notifications (Web Push + SMS) and Sonner feedback for order events

### M3 — Fulfill (Weeks 9–11)

- Delivery partner PWA (separate route group, same React codebase)
- Real-time tracking (polling or WebSocket, no map yet)
- Returns, cancellations, refunds
- Invoice generation

### M4 — Retain (Weeks 12–14)

- Reorder, subscriptions, refill reminders
- Wishlist, reviews, smart suggestions v1
- Help center, embedded chat widget

### M5 — Polish & Launch (Weeks 15–16)

- Performance pass (Lighthouse, bundle audit), accessibility audit (axe), security review
- Closed beta (100 users, 1 pincode)
- Launch in 5 pincodes

> Total: ~4 months for v1, assuming team of 3 (2 frontend, 1 backend) + 1 designer + 0.5 PM. Solo timeline ≈ 7–9 months.

---

## 10. Locked Decisions

All previously open questions are resolved for v1. Reopening any of these requires a written amendment.

| # | Decision | Locked answer | Rationale |
|---|---|---|---|
| 1 | Fulfillment model | **Own pharmacy, single hub** for v1 | Lower regulatory complexity, simpler inventory, faster to launch |
| 2 | Prescription OCR | **No — manual pharmacist review only** in v1 | Adds 2–3 weeks; manual review is the legal default anyway |
| 3 | Geographic rollout | **Single city pilot** (target: Bangalore, 5 pincodes) | Tight feedback loop, manageable delivery ops |
| 4 | PWA / installable web | **Yes — manifest + service worker from M1** | Low cost, gives app-like Add-to-Home-Screen launcher |
| 5 | WhatsApp commerce | **Out of scope for v1** | Revisit in v2 once core flow is stable |
| 6 | Tele-consult tie-in | **Out of scope** | Outside vision; do not partner in v1 |
| 7 | Brand vs marketplace | **Single brand** (own pharmacy) | One seller per SKU, no seller-management UI |
| 8 | Backend language | **Node.js + Express** (JavaScript, JSDoc, no TS) | Stack uniformity, simpler than NestJS for solo/small team |
| 9 | Repo layout | **Monorepo** with npm workspaces (`apps/web`, `apps/api`, `packages/shared`) | Tighter API/UI iteration, shared validators |
| 10 | Search engine | **Meilisearch** | Lighter than Typesense for our catalog size; great typo tolerance |
| 11 | Web Push | **Yes from M1** (VAPID, opt-in after first order) | Order updates without SMS cost |
| 12 | Map view in tracking | **Deferred — feature flag off in v1** | Status updates sufficient; map adds map vendor cost |
| 13 | Image cropping | **Defer — server-side compression only in v1** | User can re-take photo; cropping UI is v2 polish |
| 14 | Multi-language (Hindi) | **i18n keys from day 1, Hindi strings in v2** | Avoid retrofit cost; ship English-only labels in v1 |
| 15 | Cashfree fallback | **Defer — Razorpay only in v1** | One gateway means one set of webhooks/reconciliation in v1 |

---

## 11. Risks

| Risk                                      | Impact                       | Mitigation                                                           |
| ----------------------------------------- | ---------------------------- | -------------------------------------------------------------------- |
| Pharmacist bottleneck on Rx review        | High — orders stall          | SLA dashboard, autoscale pharmacist roster, async clarification chat |
| Regulatory change on online Rx            | High — could halt operations | Legal advisor on retainer, modular Rx flow                           |
| Catalog data quality (wrong salt mapping) | High — wrong drug delivered  | Multi-step verification pipeline, pharmacist sign-off on new SKUs    |
| Payment failure during peak               | Medium                       | Multi-gateway fallback (Razorpay primary, Cashfree backup)           |
| Cold start search relevance               | Medium                       | Curated featured products + category-led navigation initially        |
| Inventory desync with physical pharmacy   | High — overselling           | Reserve-on-cart with TTL, periodic reconciliation job                |

---

## 12. Glossary

- **Salt / Composition** — the active pharmaceutical ingredient (e.g., Paracetamol 500mg)
- **Schedule H / H1 / X** — Indian drug categories requiring prescription, with H1 needing audit trail
- **Generic** — a drug with the same composition as a branded version, typically cheaper
- **OTP** — One-Time Password
- **PDP** — Product Detail Page
- **OFD** — Out For Delivery
- **POD** — Proof of Delivery
- **SKU** — Stock Keeping Unit (a specific product variant)
- **Hub** — fulfillment center / warehouse pharmacy
- **DPDP** — Digital Personal Data Protection Act 2023 (India)
