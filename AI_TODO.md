# AI TODO — Phase-Wise Task Plan

> Source of truth for what to build, in order. Pair with [PROJECT_REQUIREMENTS.md](PROJECT_REQUIREMENTS.md) and [CLAUDE.md](CLAUDE.md).
> Mark tasks `[x]` when done. Each task should be small enough for one focused session.

---

## Phase 0 — Pre-flight

- [ ] Confirm backend stack with user (Node.js Express vs NestJS vs Python FastAPI)
- [ ] Confirm fulfillment model (own pharmacy vs marketplace)
- [ ] Confirm initial geographic scope (single pincode pilot vs multi-city)
- [ ] Confirm hosting target (AWS Mumbai vs Cloudflare Pages + AWS API)
- [ ] Pick repo layout (monorepo with workspaces vs separate frontend/backend repos)
- [ ] Get Razorpay test credentials, MSG91 test credentials, S3 bucket access
- [ ] Get a sample medicine catalog CSV (≥ 500 SKUs) for indexing

---

## Phase 1 — Foundation (M1, weeks 1–4)

### 1.1 Project Scaffold

- [ ] `npm create vite@latest` — React + JavaScript template (NOT TypeScript)
- [ ] Install runtime deps: `react-router-dom zustand axios sonner react-hook-form yup @hookform/resolvers tailwindcss postcss autoprefixer lucide-react date-fns clsx browser-image-compression framer-motion`
- [ ] Install dev deps: `eslint eslint-plugin-react eslint-plugin-react-hooks prettier vitest @testing-library/react @testing-library/jest-dom jsdom`
- [ ] Configure Vite alias `@/` → `src/`
- [ ] Initialize Tailwind, set up `tailwind.config.js` with mobile-first breakpoints and custom color palette (light theme only)
- [ ] Set up ESLint + Prettier configs; add `.editorconfig`
- [ ] Create folder structure per [CLAUDE.md §3](CLAUDE.md)
- [ ] Add `.env.example` with `VITE_API_BASE`, `VITE_RAZORPAY_KEY`, `VITE_GOOGLE_MAPS_KEY`
- [ ] Add scripts: `dev`, `build`, `preview`, `lint`, `lint:fix`, `format`, `test`

### 1.2 Core Infrastructure

- [ ] Create `src/api/client.js` — Axios instance with request/response interceptors (auth header, 401 refresh, 5xx Sonner toast)
- [ ] Create `src/store/useAuthStore.js` — minimal: `user`, `accessToken`, `login()`, `logout()`, `hydrate()`
- [ ] Create `src/store/useUIStore.js` — `pincode`, `setPincode()`, persisted
- [ ] Create `src/store/useCartStore.js` — items, qty actions, `applyCoupon()`, persisted (guest cart only)
- [ ] Create `src/components/Toaster.jsx` wrapping Sonner with project defaults
- [ ] Create `src/routes/router.jsx` with `createBrowserRouter` and lazy-loaded routes
- [ ] Create `src/routes/ProtectedRoute.jsx`
- [ ] Build `App.jsx` and `main.jsx` with Toaster + RouterProvider + ErrorBoundary

### 1.2A Motion Foundation (Framer Motion)

- [ ] Create `src/motion/transitions.js` — exported tokens: `springSoft`, `springSnappy`, `easeOut`, `easeIn`, durations (fast 150 / base 250 / slow 400)
- [ ] Create `src/motion/variants.js` — exported variants: `fadeUp`, `fadeIn`, `scaleIn`, `slideUp`, `staggerContainer`, `pageTransition`
- [ ] Create `src/components/MotionConfigProvider.jsx` — wraps `<LazyMotion features={domAnimation}>` and global reduced-motion handling
- [ ] Create `src/components/PageTransition.jsx` — `AnimatePresence` wrapper applied to outlet in `App.jsx`
- [ ] Create `src/components/Button.jsx` — premium button with hover/tap motion, three variants (primary/secondary/ghost), all states
- [ ] Create `src/components/Card.jsx` — `motion.div` with shadow lift on hover/tap
- [ ] Create `src/components/BottomSheet.jsx` (mobile) — drag-to-dismiss, snap points, velocity-aware close
- [ ] Create `src/components/Modal.jsx` (desktop) — backdrop fade + scale-in
- [ ] Create `src/components/Skeleton.jsx` — shimmer that respects reduced motion
- [ ] Document motion tokens and variants in a quick reference comment at the top of `variants.js`

### 1.3 Layout & Shell

- [ ] Header component — logo, search bar (mobile-first: full-width on mobile, inline on desktop)
- [ ] Mobile bottom nav (Home, Search, Cart, Orders, Account) — hidden `md:` and up
- [ ] Desktop top nav — visible from `md:`
- [ ] Footer with pharmacy license, GSTIN, support links
- [ ] Loading skeleton primitives (`Skeleton.jsx`)
- [ ] Error boundary fallback UI

### 1.4 Auth (Module 1)

- [ ] `/auth/login` page — phone input, "Send OTP" CTA
- [ ] OTP entry screen — 6-digit boxes, resend countdown, attempt counter
- [ ] `authApi.js` — `requestOtp`, `verifyOtp`, `refresh`, `logout`
- [ ] Wire `useAuthStore` actions to `authApi`
- [ ] Hydrate auth state from refresh token on app boot
- [ ] Logout from current device + "logout all devices" UI in account
- [ ] Sonner feedback: OTP sent, login success, login failed, OTP expired

### 1.5 Profile & Addresses (Module 1 cont'd)

- [ ] `/account` page — name, DOB, gender form
- [ ] Address list + add/edit/delete address (modal/drawer)
- [ ] Pincode auto-detect button (browser Geolocation → reverse geocode)
- [ ] Family members CRUD (max 5)
- [ ] Account deletion request flow (DPDP)

### 1.6 Catalog & Search (Module 2)

- [ ] Backend: catalog ingestion script (CSV → Postgres → Meilisearch index)
- [ ] `catalogApi.js` — `search(q, filters, sort, page)`, `getCategories()`, `getMedicine(id)`, `getAlternatives(id)`
- [ ] Home page (`/`) — categories grid, trending searches, hero promo slot
- [ ] Search page (`/search`) — input with debounce 200 ms, results list, filters drawer (mobile) / sidebar (desktop)
- [ ] Sort dropdown (relevance, price asc/desc, discount %, popularity)
- [ ] `useCatalogStore` — recent searches (last 10)
- [ ] Empty state ("No results — try uploading a prescription")

### 1.7 Product Detail Page (Module 3)

- [ ] `/medicine/:id` route — image gallery (single image OK for v1), name, brand, salt, manufacturer
- [ ] Price block — MRP strikethrough, selling price, discount %
- [ ] "Requires prescription" badge for Schedule H/H1/X
- [ ] Cheaper alternatives carousel (tap → PDP)
- [ ] Composition / Uses / Side effects / Storage / FAQ accordion
- [ ] In-stock + delivery ETA based on `useUIStore.pincode`
- [ ] Sticky bottom Add-to-Cart CTA on mobile; inline on desktop
- [ ] Add to wishlist button

---

## Phase 2 — Transact (M2, weeks 5–8)

### 2.1 Cart (Module 5)

- [ ] `/cart` page — list, qty steppers, remove, "save for later"
- [ ] `cartApi.js` — server cart for logged-in users; merge guest cart on login
- [ ] Re-validate stock + price on cart load
- [ ] Block checkout if Rx-required item has no prescription attached, with clear CTA
- [ ] Price breakdown block (subtotal, discount, coupon, delivery, tax, total)
- [ ] Coupon input with apply/remove
- [ ] Free delivery threshold indicator
- [ ] Sonner feedback per [CLAUDE.md §7](CLAUDE.md)

### 2.2 Prescription Upload (Module 4)

- [ ] `/prescriptions` page — list + upload CTA
- [ ] Upload modal — file input (`accept="image/*,application/pdf" capture="environment"` for mobile)
- [ ] Client-side compression with `browser-image-compression`
- [ ] Upload progress + Sonner promise toast
- [ ] Reuse existing prescription on cart page (within 6 months)
- [ ] Status badges (Pending, Under Review, Approved, Rejected, Clarification Needed)
- [ ] Rejection reason display

### 2.3 Checkout & Payments (Module 6)

- [ ] `/checkout` page — address selector, delivery option, prescription review
- [ ] `/checkout/payment` step — payment method selector
- [ ] Razorpay Web Checkout integration (load script lazily, open on Pay click)
- [ ] COD eligibility check (pincode + order value < 5000)
- [ ] Idempotency-Key generation for order POST
- [ ] Handle payment success → order confirmation page
- [ ] Handle payment failure → cart preserved, retry CTA, Sonner error toast
- [ ] `paymentsApi.js` — `initiate`, `verify`

### 2.4 Order Management (Module 7)

- [ ] `ordersApi.js` — `list`, `get`, `cancel`, `requestReturn`, `invoice`
- [ ] `/orders` page — list with filters (date range, status), pagination
- [ ] `/orders/:id` page — items, totals, address, payment, timeline
- [ ] Order timeline component (status pills with timestamps)
- [ ] Cancel order CTA (only before Packed)
- [ ] Download invoice (PDF) button
- [ ] Share order via WhatsApp / native share

### 2.5 Pharmacist Console (admin scope)

- [ ] `/admin` route group, role-gated via `useAuthStore.user.role`
- [ ] Rx queue page — FIFO list, filter, search by user/order
- [ ] Rx review modal — image viewer, approve/reject/request-clarification
- [ ] Rejection reason dropdown + free text
- [ ] Audit log entry per action

### 2.6 Notifications

- [ ] Web Push subscription flow (VAPID keys, service worker registration)
- [ ] Notification preferences screen in `/account`
- [ ] Server triggers for: order placed, payment outcome, Rx outcome, packed, shipped, OFD, delivered, refund initiated/completed
- [ ] In-app notification center (`/notifications` or dropdown)

---

## Phase 3 — Fulfill (M3, weeks 9–11)

### 3.1 Real-Time Tracking (Module 8)

- [ ] `/orders/:id/track` page
- [ ] Polling every 30 s OR WebSocket connection (decide based on backend)
- [ ] Status timeline + ETA
- [ ] Delivery partner card (name, masked phone, photo)
- [ ] Live map (feature-flagged, off by default in v1)

### 3.2 Delivery Partner PWA

- [ ] Separate route group `/partner/*` with simplified UI
- [ ] Login (separate role)
- [ ] Order pickup list
- [ ] Status update actions (Packed → Picked → OFD → Delivered)
- [ ] Delivery OTP entry on handover
- [ ] POD capture (photo or signature)
- [ ] PWA manifest + service worker for offline-tolerant operation

### 3.3 Returns & Refunds

- [ ] Return request form on order detail (within 7 days, photo upload)
- [ ] Backend: refund initiation via Razorpay refund API
- [ ] Refund status display
- [ ] Restrictions for Rx items (no return after seal broken)

### 3.4 Invoices

- [ ] Backend: GST-compliant PDF generation (HSN codes, GSTIN)
- [ ] Frontend: download invoice from order detail

---

## Phase 4 — Retain (M4, weeks 12–14)

### 4.1 Reorder & Subscription (Module 10)

- [ ] "Order again" CTA on `/orders/:id` and order list
- [ ] `/subscriptions` dashboard
- [ ] Create subscription flow from PDP or order
- [ ] Edit qty / frequency / pause / skip / cancel
- [ ] `subscriptionsApi.js`
- [ ] Backend cron: create orders N days before due date
- [ ] Notify user 7 days before saved-card expiry / mandate end

### 4.2 Refill Reminders

- [ ] Compute refill date from last order qty + dosage info
- [ ] Schedule reminder at refill_date − 3 days
- [ ] Multi-channel send (push, SMS, email)

### 4.3 Reviews & Ratings (Module 11)

- [ ] Review form on order detail (post-delivery only)
- [ ] Yup schema for rating + text (10–500 chars)
- [ ] PDP reviews section — average, distribution, paginated list
- [ ] Helpful vote action
- [ ] Sort by recent / helpful
- [ ] Backend moderation queue + profanity flag
- [ ] Auto-flag medical claim keywords

### 4.4 Wishlist (Module 12)

- [ ] `useWishlistStore`
- [ ] `wishlistApi.js`
- [ ] Heart toggle on PDP and product cards
- [ ] `/wishlist` page — list, stock status, price drop badge, quick add to cart
- [ ] Price drop alert (opt-in)

### 4.5 Smart Suggestions (Module 13)

- [ ] "Save Rs X with generic" card on PDP and cart
- [ ] Frequently bought together (top 5)
- [ ] Personalized recommendations on home (history-based)
- [ ] Cold-start: trending + best sellers by category

### 4.6 Help & Support (Module 15)

- [ ] `/help` page with searchable FAQ
- [ ] Embed Freshchat / Intercom widget
- [ ] "Report an issue" form on order detail with photo upload
- [ ] WhatsApp deep link
- [ ] Phone support (click-to-call) during business hours

---

## Phase 5 — Polish & Launch (M5, weeks 15–16)

### 5.1 Performance Pass

- [ ] Lighthouse audit on top 5 routes — target Performance ≥ 90 mobile
- [ ] Bundle analyzer — initial chunk < 250 KB gzipped
- [ ] Lazy-load non-critical libraries (Razorpay, image cropper, charts)
- [ ] Verify Core Web Vitals: LCP < 2.5 s, CLS < 0.1, INP < 200 ms
- [ ] Real device test on a low-end Android (Snapdragon 4xx) over 4G

### 5.2 Accessibility Pass

- [ ] Run axe DevTools on every route, fix all critical/serious issues
- [ ] Manual keyboard-only walkthrough of search → checkout
- [ ] Screen reader pass with NVDA on key flows
- [ ] Verify focus rings on all interactive elements
- [ ] Verify color contrast ≥ 4.5:1

### 5.3 Security Review

- [ ] Run `npm audit` — fix high/critical
- [ ] OWASP top 10 self-checklist
- [ ] Verify CSP headers, HTTPS, secure cookie flags
- [ ] Pen-test focus areas: auth, payments, Rx upload, admin role gate
- [ ] Confirm no PII in logs, no secrets in repo
- [ ] Confirm DPDP consent flow + data export + account deletion work end-to-end

### 5.4 Compliance Verification

- [ ] Pharmacist license info displayed in footer
- [ ] GST invoice contains GSTIN, HSN codes, place of supply
- [ ] Schedule H/H1/X drugs have Rx requirement enforced
- [ ] Rx retention policy implemented (2-year minimum, immutable storage)
- [ ] Audit log for admin/pharmacist actions verified

### 5.5 Beta & Launch

- [ ] Closed beta — 100 users in 1 pincode, 2 weeks
- [ ] Collect feedback, triage P0/P1 issues
- [ ] Public launch in 5 pincodes
- [ ] Post-launch monitoring dashboard (orders/min, error rate, Rx SLA)
- [ ] On-call rotation set up (Sentry alerts → PagerDuty/Opsgenie)

---

## Cross-Cutting (do continuously, not a phase)

- [ ] Write unit tests for utils and store actions as you build them
- [ ] Write component tests for forms, validators, and price math
- [ ] Add Playwright E2E for the critical flow (search → cart → Rx → checkout → order) by end of M2
- [ ] Keep the changelog updated for each merged milestone
- [ ] Update [PROJECT_REQUIREMENTS.md](PROJECT_REQUIREMENTS.md) and [CLAUDE.md](CLAUDE.md) when scope or rules change
- [ ] Run lint + tests before every commit; CI blocks merges on failure

---

## Definition of Done (per task)

A task is `[x]` only when all are true:

1. Code merged to `main` (or feature branch reviewed and approved if branching)
2. Lint passes, tests pass, build succeeds
3. Feature manually verified on mobile viewport (375 px) AND desktop (1280 px) in Chrome
4. No console errors or warnings in dev or production build
5. No new dependency added without team approval
6. No emoji, no dark theme variants, no `.ts`/`.tsx` files introduced
7. Sonner feedback exists for all user-visible actions in the task
8. Accessibility: keyboard reachable, focus visible, semantic HTML
9. **Premium UI** — soft shadows, refined corners, 8 px spacing scale; flat/cheap output is rejected
10. **Motion** — appropriate Framer Motion micro-interaction added (button tap, list stagger, page transition, etc.); `useReducedMotion()` fallback verified
