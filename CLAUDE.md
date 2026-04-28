# AI Rules for Medicine eCommerce Project

> Loaded automatically by Claude Code. Treat these as hard rules. Read [PROJECT_REQUIREMENTS.md](PROJECT_REQUIREMENTS.md) before starting any non-trivial task.
>
> **Status: Locked v1.** Stack, palette, typography, spacing, motion tokens are all fixed. Do not propose alternatives unless explicitly asked. If a task seems to require deviation, stop and ask.

---

## 1. Hard Constraints (never violate)

1. **No TypeScript.** All source files are `.jsx` or `.js`. Never introduce `.ts`/`.tsx`. Use JSDoc for type hints when complex. PropTypes are optional and only on shared library components — do not add them to every component.
2. **No emojis.** Anywhere — UI, code comments, commit messages, doc files, toast text, button labels, log lines. Use words or icons from `lucide-react` for visual cues.
3. **No dark theme.** Light theme only. Do not add `dark:` Tailwind variants, theme toggles, `prefers-color-scheme` listeners, or theme switches in stores.
4. **Mobile-first only.** All CSS uses `min-width` breakpoints (`sm:`, `md:`, `lg:`). Never use `max-width` queries or desktop-first ordering.
5. **No native mobile app code.** This is a browser web app. Reject suggestions to add React Native, Capacitor, or Expo. PWA (manifest + service worker) is allowed.
6. **Framer Motion is the only animation library.** No GSAP, AOS, react-spring, anime.js, or Lottie unless explicitly approved. All animation tokens live in `src/motion/`.
7. **Premium UI is non-negotiable.** Every component: soft shadows, rounded corners (xl/2xl), 8 px spacing scale, generous whitespace, refined typography, intentional motion. No flat/square/cheap-looking output. See §7A and §7B.
7a. **No gradients.** Solid fills only — no `bg-gradient-*` Tailwind utilities, no `linear-gradient()`/`radial-gradient()` in CSS, no gradient text, no gradient borders. Depth comes from shadows, layering, and contrast.
8. **Respect reduced motion.** Every non-trivial animation must check `useReducedMotion()` and fall back gracefully. Accessibility is not optional.
9. **No prescription content rendered as raw HTML.** All Rx images go through the central upload pipeline; metadata is server-validated.
10. **No tokens in `localStorage` for production.** Refresh token in httpOnly cookie, access token in memory (Zustand non-persisted slice).

---

## 2. Stack — Use Exactly These

| Concern | Tool | Notes |
|---|---|---|
| Framework | React 18 (JSX) | Functional components + hooks only. No class components. |
| Build | Vite | `npm run dev`, `npm run build` |
| Routing | React Router v6 | Data routers preferred (`createBrowserRouter`) |
| State | Zustand | One store per domain. No Redux, no Context for global state. |
| HTTP | Axios | Single shared instance from `src/api/client.js`. Never `fetch()` directly. |
| Toasts | Sonner | The ONLY toast library. No `react-toastify`, no `react-hot-toast`. |
| Forms | React Hook Form + Yup | Yup schemas in `src/validators/`. |
| Styling | Tailwind CSS | Utility-first. Avoid inline `style={{}}` except for dynamic values. |
| **Animation** | **Framer Motion** | **The ONLY animation lib. No GSAP, no AOS, no react-spring, no Lottie unless asked.** |
| Icons | lucide-react | No other icon libraries. |
| Dates | date-fns | No moment.js, no dayjs. |

If a task seems to need something outside this list, stop and ask.

---

## 3. File & Folder Conventions

```
src/
  api/         axios client + per-domain modules (authApi.js, cartApi.js)
  store/       zustand stores (useAuthStore.js, useCartStore.js)
  pages/       route-level components (Home.jsx, Cart.jsx)
  components/  shared UI primitives (Button.jsx, Input.jsx, ProductCard.jsx)
  features/    domain-grouped components (features/cart/CartLineItem.jsx)
  hooks/       custom hooks (useDebounce.js, usePincode.js)
  utils/       pure helpers (formatPrice.js, validators.js)
  validators/  yup schemas (loginSchema.js, addressSchema.js)
  routes/      router config + ProtectedRoute.jsx
  styles/      tailwind.css, globals.css
  motion/      Framer Motion variants + tokens (variants.js, transitions.js)
  config/      constants, env wrapper
  App.jsx
  main.jsx
```

- **Naming:** components `PascalCase.jsx`, hooks `useThing.js`, stores `useThingStore.js`, utils `camelCase.js`.
- **One component per file** for top-level page components. Small subcomponents may share a file if used only locally.
- **No barrel `index.js` files** unless they cut import noise meaningfully.
- **Imports:** absolute imports from `src/` via Vite alias `@/`. Group order: react → libs → `@/...` → relative → styles.

---

## 4. React Patterns

- Functional components only. Hooks only. No HOCs unless wrapping a third-party lib.
- Keep components < 200 lines. Split when over.
- Effects (`useEffect`) are a last resort. Prefer derived values, event handlers, or store actions.
- `useMemo`/`useCallback` only when there's a measured render problem — not preemptively.
- Do not pass refs through more than one level. Use `forwardRef` only for shared primitives.
- Lists need stable `key`s — never use array index for dynamic lists.
- Always wrap router with `<ErrorBoundary>` per major route group.
- Lazy-load route chunks: `const Cart = lazy(() => import('@/pages/Cart'))`.

---

## 5. Zustand Patterns

- One store per domain. Co-locate state + actions in the same store.
- Subscribe with **narrow selectors** to avoid re-renders:

  ```js
  // good
  const itemCount = useCartStore((s) => s.items.length);

  // bad (re-renders on any cart change)
  const cart = useCartStore();
  ```

- Use `shallow` from `zustand/shallow` when selecting multiple values.
- Persistence: `persist` middleware ONLY for `useCartStore` (guest cart), `useUIStore` (pincode, prefs). Do not persist auth tokens, prescriptions, or order data.
- Devtools: `devtools` middleware in dev only — `import.meta.env.DEV` guard.
- Reset on logout: each store exposes a `reset()` action; `useAuthStore.logout()` calls `reset()` on every other store.
- Never mutate state directly outside `set()`.

---

## 6. Axios Patterns

- Always import from `@/api/client.js` — never instantiate elsewhere.
- Per-domain modules return unwrapped `data`:

  ```js
  // src/api/cartApi.js
  import { api } from './client';
  export const getCart = () => api.get('/cart').then(r => r.data);
  export const addItem = (medicineId, qty) =>
    api.post('/cart/items', { medicine_id: medicineId, qty }).then(r => r.data);
  ```

- Components/stores call API modules — they never see Axios directly.
- Search-as-you-type uses `AbortController` and cancels prior requests.
- Order placement passes `Idempotency-Key` (UUID); regenerate only on success.
- Errors: 401 triggers refresh-and-retry once via the response interceptor; >= 500 surfaces a Sonner toast; 4xx is the caller's responsibility.
- Never log full request/response bodies (PII). Log status, URL, requestId only.

---

## 7. Sonner Patterns

- `<Toaster richColors closeButton position="top-right" />` mounted once in `App.jsx` (top-right desktop, the library auto-adapts).
- Use the variants from §6A.3 of [PROJECT_REQUIREMENTS.md](PROJECT_REQUIREMENTS.md). Stay consistent with copy.
- For long async ops: `toast.promise(promise, { loading, success, error })`.
- Toasts are advisory. Form errors must ALSO appear inline near the field — never rely on toast alone for validation.
- Never stack > 3 toasts. Sonner handles dedup; respect that.
- Toast copy: short, sentence case, no emojis, no exclamation marks unless genuinely celebratory ("Order placed").

---

## 7A. Premium UI Standards

Every screen ships at premium quality or it does not ship. Reference: §5.6A of [PROJECT_REQUIREMENTS.md](PROJECT_REQUIREMENTS.md) for the full **locked design system** (colors, type scale, spacing, radii, shadows).

- **Tokens are locked.** Never invent new colors, font sizes, radii, or shadow values. Use only the tokens defined in `tailwind.config.js` (mapped from §5.6A of the requirements).
- **Visual baseline:** soft tinted shadows (`shadow-card` resting, `shadow-pop` elevated), `rounded-xl`/`2xl` corners, 8 px spacing scale, restrained 60-30-10 color split, **Inter** as the only font.
- **Locked palette:** primary `#0F766E` (deep teal), accent `#E1623D` (warm coral) used sparingly. See PROJECT_REQUIREMENTS §5.6A for the full color token table.
- **No square-corner cards, no harsh black shadows, no flat single-color buttons without depth.**
- **No emojis, no dark theme, no gradients, no neon/glitch/parallax effects.**
- Imagery: products on `bg.image` (`#F7F7F8`), never pure white. Aspect ratios fixed (1:1 cards, 4:3 PDP hero).
- Empty states: thin-line two-tone illustration + reassuring sentence + clear next action.
- Loading: skeletons that mirror the eventual layout. No spinners as primary loading except inline button loading.
- Inputs: 16 px font minimum (iOS zoom prevention), `border.subtle` resting → `border.strong` on hover → `shadow-focus` ring on focus-visible. Error state border switches to `danger.default` and shakes briefly (Framer).
- Buttons: 3 variants — primary (`bg-primary-default text-white`), secondary (outlined `border-border-strong`), ghost (text `text-primary-default`). All five states (rest / hover / active / focus-visible / disabled / loading). **No gradient fills.**

## 7B. Animation Rules — Framer Motion

- **Library:** Framer Motion only. Always `import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'`.
- **Tokens:** durations and easings live in `src/motion/transitions.js` and variants in `src/motion/variants.js`. Components import from there — never hardcode magic numbers.

  ```js
  // src/motion/transitions.js
  export const springSoft = { type: 'spring', stiffness: 300, damping: 30 };
  export const easeOut = { duration: 0.25, ease: [0.22, 1, 0.36, 1] };
  ```

- **Reduced motion:** every non-trivial animation reads `useReducedMotion()` and falls back to a fade-only or instant transition.
- **GPU-only properties:** animate `transform` (`x`, `y`, `scale`, `rotate`) and `opacity`. Never animate `width`/`height`/`top`/`left`. For size changes, use `layout` prop and let Framer FLIP it.
- **Page transitions:** wrap router outlet in `<AnimatePresence mode="wait">`; route components have `initial`/`animate`/`exit` variants. Default: fade + 8 px Y, 250 ms ease-out.
- **Lists:** parent gets `staggerChildren: 0.04`; items get the `fadeUp` variant. Cap visible animations at 8 items — beyond that, render without stagger.
- **Buttons:** `whileTap={{ scale: 0.97 }}`, `whileHover={{ scale: 1.02 }}` (desktop only via `useMediaQuery` or hover-capable check).
- **Cart fly-to:** add-to-cart triggers a layout animation (fixed-position pill) toward the cart icon; cart badge animates count change with key remount.
- **Modals/drawers:** mobile drawers are bottom sheets with drag-to-dismiss (`drag="y"`, `dragConstraints={{ top: 0 }}`, `onDragEnd` checks velocity). Desktop modals fade + scale `0.96 → 1`.
- **Tabs / segment controls:** moving indicator uses `layoutId` for smooth transition between active states.
- **Accordions:** `<motion.div layout>` wrapping content; chevron `animate={{ rotate: open ? 180 : 0 }}`.
- **Forms:** error shake on invalid submit (`x: [0, -5, 5, -5, 0]` over 200 ms). Inline error text slides down with `height: 'auto'` on a wrapper using `layout`.
- **OTP:** each filled digit scales briefly (`scale: [1, 1.1, 1]`).
- **Order timeline:** steps illuminate sequentially using `transition={{ delay: i * 0.08 }}`. Current step has a slow subtle pulse.
- **No infinite animations** except: skeleton shimmer, "no results" illustration float (±4 px y, 3 s loop), order timeline current-step pulse.
- **Performance:**
  - Wrap heavy lists in `LazyMotion` with `domAnimation` features only (smaller bundle).
  - For very long lists, virtualize first, then animate only visible items.
  - Never animate during search-as-you-type result rendering — show results, then stagger if user hasn't typed in 300 ms.
- **Don't decorate:** if removing an animation does not hurt comprehension, remove it. Calm beats flashy.
- **PR checklist for any new component:** state name, duration, easing, reduced-motion fallback, and which interaction triggers it.

- Default classes target mobile (320 px). Add `sm: md: lg:` only when the desktop layout actually differs.
- **Never write `max-width` media queries** — neither in Tailwind config nor in raw CSS.
- Use semantic spacing: `p-4` mobile, `md:p-6` tablet, `lg:p-8` desktop. Avoid arbitrary values like `p-[17px]` unless truly needed.
- Container: `max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8`.
- Bottom nav / sticky CTA on mobile → hidden on `md:` and replaced by top nav.
- Inputs use `text-base` (16 px) minimum to prevent iOS zoom on focus.
- Touch targets: `h-11 min-w-[44px]` for any tappable element.
- Do not use `dark:` variants. Do not import `next-themes` or similar.
- Color tokens: define in `tailwind.config.js` `theme.extend.colors` — never inline hex codes in components.

---

## 9. Forms

- React Hook Form for state, Yup for validation. Schemas live in `src/validators/`.
- Show errors inline below fields, in red text with `aria-describedby` linking to the message.
- Disable submit button while `isSubmitting`.
- Phone, OTP, and pincode inputs are numeric — set `inputMode="numeric"` and `pattern="[0-9]*"`.
- Mask phone numbers visually (`+91 98xxx xxx21`) but submit raw E.164.

---

## 10. Accessibility

- Every interactive element must be reachable by keyboard, with a visible focus ring.
- Use semantic HTML: `<button>` not `<div onClick>`, `<nav>`, `<main>`, `<form>`.
- Labels: every input has an associated `<label>` via `htmlFor`/`id` or aria-label.
- Modal/drawer: trap focus, restore on close, `Esc` to close, `aria-modal="true"`.
- Images: meaningful `alt`; decorative images get `alt=""`.
- Color is never the only signal — pair with icon or text.

---

## 11. Performance

- Lazy-load every route. Lazy-load heavy components (Razorpay SDK, image cropper).
- Images: `<img loading="lazy" decoding="async">` outside the fold; provide `srcset` for product images.
- Debounce search input at 200 ms.
- Memoize expensive list rendering (virtualize lists > 50 items with `react-window`).
- Bundle budget: initial route chunk < 250 KB gzipped. Run `npm run build -- --report` before merging large changes.

---

## 12. Security

- Never render user-supplied HTML. If absolutely needed (admin descriptions), pass through DOMPurify.
- Never log Rx image URLs, OTPs, payment tokens, or full phone numbers.
- Validate every form server-side too — client-side Yup is a UX layer, not a security boundary.
- CSP headers configured at hosting layer; do not use inline `<script>` or `eval`.
- External links: `rel="noopener noreferrer"` and `target="_blank"`.

---

## 13. Comments & Code Style

- Default to no comments. Add a comment only when the WHY is non-obvious (a hidden constraint, a workaround for a browser bug, a regulatory rule).
- Don't write comments that restate the code. `// increment counter` above `counter++` is noise.
- Don't reference tickets, fixes, or callers in comments — that belongs in the commit message.
- Self-documenting code: `getCheaperGenericAlternatives()` beats `getAlts() // returns cheaper generics`.

---

## 14. What NOT to Do

- Do not add new dependencies without being asked. If you think one is needed, propose it first.
- Do not refactor code that wasn't part of the asked task.
- Do not add error boundaries, retry logic, or loading skeletons unless the task says so.
- Do not add feature flags for code that's already simple to remove.
- Do not write README/docs unless explicitly asked.
- Do not generate placeholder data, mock APIs, or stub functions when the real implementation is the ask. If blocked on the API, stop and ask.
- Do not "improve" file structure across the codebase opportunistically.
- Do not add unit tests for trivial getters/setters or framework-provided behavior.

---

## 15. When You Get Stuck

Stop and ask if any of these are true:
- The requirements doc disagrees with the user's instruction.
- A task requires a tool not in §2.
- A task requires touching authentication, payments, or prescription handling and the spec is ambiguous.
- An action is destructive (deleting files, dropping tables, force-pushing) and was not explicitly authorized.
- You'd need to install > 2 new packages.

Ask one focused question, then wait. Do not guess.

---

## 16. Lock-Down Summary (v1)

Quick reference — all of this is fixed, do not propose changes.

| Area | Locked choice |
|---|---|
| Platform | Web only, mobile-first responsive, optional PWA |
| Language | JavaScript only — `.jsx` / `.js`. No TypeScript. |
| Build | Vite |
| Routing | React Router v6 (data router) |
| State | Zustand (one store per domain) |
| HTTP | Axios (single shared client) |
| Toasts | Sonner |
| Forms | React Hook Form + Yup |
| Styling | Tailwind CSS, light theme only, no dark mode |
| Animation | Framer Motion (only) |
| Icons | lucide-react (stroke 1.5) |
| Dates | date-fns |
| Font | Inter (self-hosted) |
| Primary color | `#0F766E` (deep teal) |
| Accent color | `#E1623D` (warm coral) |
| Backend | Node.js + Express, JSDoc, no TS |
| DB | PostgreSQL + Redis |
| Search | Meilisearch |
| Payments | Razorpay only (no fallback gateway in v1) |
| Notifications | Web Push (VAPID) + MSG91 SMS + SES email |
| Repo | Monorepo with npm workspaces |
| Hosting | AWS ap-south-1 (Mumbai) |
| Banned | Emojis, dark theme, gradients, square corners, max-width queries, native mobile (RN/Expo/Capacitor), GSAP/AOS/react-spring/Lottie, multiple toast libraries, inline tokens in `localStorage` |
