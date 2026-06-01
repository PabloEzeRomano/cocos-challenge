# Austral Trading App

A React Native fintech/trading app for the Argentine stock market. Consumes real-time instrument data, portfolio positions, and supports order placement (BUY/SELL, MARKET/LIMIT). Inspired by the simplicity of Coinbase and Robinhood, with a focus on financial clarity over visual noise.

> **Branding**: App is branded "Austral" with a star icon. Header uses icon-only buttons for theme toggle (sun/moon) and locale switch (globe + code).

## Screenshots

> Run the app locally to see the full experience. Key screens: Instruments list with sparklines, Portfolio with aggregated P&L, debounced search, and bottom-sheet order modal.

## Quick Start

```bash
# Prerequisites: Node.js >= 18, Expo Go on your device
npm install
npm start
# Scan QR with Expo Go (iOS/Android) or press 'i' for iOS simulator
```

Run tests:
```bash
npm test
```

## Stack Choices

| Technology | Why |
|---|---|
| **Expo + Expo Router** | Zero-config native builds, file-based routing, fast iteration. The managed workflow avoids native toolchain complexity that adds no value for this scope. |
| **TypeScript** | Non-negotiable for financial logic. Catches calculation errors at compile time. |
| **TanStack Query** | Declarative server state with built-in caching, refetching, and loading/error states. Eliminates hand-rolled async boilerplate. |
| **Zustand** | Minimal global state (theme + locale only). No Redux ceremony for two persisted preferences. |
| **Axios** | Typed HTTP client with interceptors if needed. Simpler than raw fetch for consistent error handling. |
| **react-native-svg** | Lightweight sparkline charts. No heavy charting library for a non-interactive mini visualization. |
| **Plain RN styles** | Full control, zero abstraction overhead. Design tokens provide consistency without a framework. |

### Why NOT

- **Redux/MobX**: Disproportionate complexity. TanStack Query handles server state; Zustand covers the rest in ~20 lines.
- **UI frameworks (Paper, Tamagui, NativeBase)**: Add bundle weight and fight their opinions. For a fintech app, owning the UI layer means precise control over financial data presentation.
- **i18n libraries (react-i18next)**: A JSON dictionary + context hook is ~40 lines. No need for ICU message format, pluralization engines, or namespace systems at this scale.
- **Full offline-first architecture**: TanStack Query's cache provides pragmatic offline resilience. Building a proper sync layer is weeks of work for a take-home.

## Architecture

```
app/                          # Expo Router (file-based routing)
  _layout.tsx                 # Root layout: providers (Query, Theme, I18n)
  index.tsx                   # Main screen: search + tabs + order modal
src/
  features/
    instruments/              # Instrument list, cards, sparklines
    portfolio/                # Position aggregation, P&L calculations
    orders/                   # Order modal, form, validation, result
    search/                   # Debounced search bar + results
  components/                 # Shared: Skeleton, ErrorState, EmptyState, TabBar, Avatar, BalanceChart, Sparkline
  services/api.ts             # Axios client + typed endpoint functions
  hooks/useDebounce.ts        # Generic debounce hook
  store/preferences.ts        # Zustand: theme + locale (persisted)
  store/orderHistory.ts       # Zustand: local order history (persisted)
  theme/                      # Design tokens, ThemeProvider, useTheme
  i18n/                       # Translation provider, dictionaries (es/en)
  utils/format.ts             # Currency, percentage, quantity formatters
  types/api.ts                # Shared API type definitions
```

### Why Feature-Based

Each feature owns its components, hooks, utils, and types. This means:
- Adding a new feature doesn't touch existing code
- Deleting a feature is a single directory removal
- Related code lives together (no hunting across `components/`, `hooks/`, `utils/` for one feature)

**Alternative considered**: Layer-based (`components/`, `hooks/`, `services/`). Rejected because it scatters domain logic across directories and couples unrelated features through shared folders.

## Technical Decisions

### Single-Screen Architecture

The app uses one screen with three tabs (Market/Portfolio/Orders) and a search overlay. This mirrors how Robinhood and Coinbase handle their core trading views — the user's mental model is "I'm looking at the market" with different lenses.

**Tab bar**: Fixed at bottom (global), always visible. Only the Market tab shows the search bar and header. The Orders tab provides local history. This is a standard mobile fintech pattern.

**Alternative**: Multi-screen navigation with stack. Rejected because separate screens add navigation complexity without UX benefit. The user never needs a "back" button in this flow.

### Portfolio Position Aggregation

The API returns duplicate tickers (e.g., MOLA appears twice with different `avg_cost_price`). These represent multiple purchase lots. The app aggregates them:
- **Quantity**: Sum of all lots
- **Weighted avg cost**: `Σ(quantity_i × avg_cost_price_i) / Σ(quantity_i)`
- **Market value**: `total_quantity × last_price`
- **P&L**: `market_value - cost_basis`

This is the standard brokerage approach. Showing individual lots would confuse users and isn't how retail trading apps present positions.

### ARS Cash Handling

The portfolio contains an ARS entry with `avg_cost_price=99.9` but `last_price=1`. This is clearly a cash balance, not an investable position. The app:
- Displays it as a "Cash" row without P&L calculations
- Uses `quantity × 1` as the display value
- Excludes it from return calculations
- Makes it non-tappable (can't trade cash)

### Sparkline Implementation

Deterministic sparklines seeded from the ticker string. Same ticker always produces the same chart shape. Points interpolate from `close_price` to `last_price` with controlled noise for realism.

**Why deterministic**: Random sparklines would change on every re-render, creating a chaotic visual experience. Seeded PRNG ensures visual stability.

**Why not real data**: The API provides only two data points (close, last). A realistic chart would need historical OHLCV data. The sparkline provides directional context, which is its purpose.

### Order Form Design

The modal supports two input modes:
1. **Quantity mode**: Enter exact number of whole shares
2. **Amount mode**: Enter ARS amount, auto-calculates maximum whole shares via `Math.floor(amount / last_price)`

Fractional shares are explicitly disallowed. The estimated total updates live as the user types.

**Native keyboard over custom keypad**: The original implementation used a custom in-app numpad. Replaced with native `TextInput` + `keyboardType="number-pad"` for better accessibility, OS-level input handling (autocomplete, clipboard), and less code to maintain.

### Order History (Local)

Completed orders are persisted locally via Zustand + AsyncStorage. Stored as a separate `cocos-order-history` key. Each entry captures: ticker, side, type, quantity, price, total, status, and timestamp.

**Why local-only**: The API has no order history endpoint. Local storage provides immediate UX feedback ("my orders") without a backend dependency. Orders survive app restart but not reinstall. No sync between devices — acceptable trade-off for a challenge scope.

### Portfolio Chart (Derived Data)

The `BalanceChart` generates a deterministic value curve from `totalCost → totalValue` using a seeded PRNG with realistic volatility scaling. The chart is visually stable across re-renders (same inputs = same curve) but does not represent real historical data.

**Why not a static shape**: The original chart was hardcoded. Deriving from actual portfolio data means the chart direction, amplitude, and shape reflect the user's real P&L ratio — positive portfolios trend up, negative trend down, with proportional volatility.

### Theme System (Redesigned)

Complete design system overhaul from generic tokens to semantic, purpose-driven naming:

- **Background hierarchy**: `bg` → `bgElevated` → `surface` → `surface2` → `surfaceModal`
- **Text hierarchy**: `text` → `textSecondary` → `textMuted` → `textInverse`
- **Semantic colors**: `positive`/`positiveBg`, `negative`/`negativeBg`, `warn`/`warnBg`
- **Interactive**: `accent` → `accentText` → `accentSoft`
- **Utility**: `border`, `borderStrong`, `field`, `overlay`
- **Numeric typography**: Added `numLg` (46px) and `numMd` (22px) variants for price/amount displays
- **Radius tokens**: Semantic naming (`badge`, `input`, `button`, `card`, `sheet`, `chip`) instead of size-based (`sm`, `md`, `lg`)

Dropped the `shadows` object entirely — React Native shadow behavior is inconsistent cross-platform and adds visual noise to a financial app that benefits from flat, high-contrast surfaces.

**Why not more tokens**: Financial data readability depends on contrast, not color variety. More tokens = more maintenance with no UX benefit.

### i18n Without a Library

A JSON dictionary + React context + `t()` function. Default locale: Spanish (Argentine market). English available.

The entire implementation is ~40 lines. It supports:
- Nested key access (`t('order.validation.quantityRequired')`)
- Locale switching persisted via Zustand/AsyncStorage

**When this breaks down**: Pluralization, ICU message format, dynamic interpolation with gender/number agreement. At that point, adopt `react-i18next`. Not before.

### State Management Strategy

| What | Where | Why |
|---|---|---|
| Instrument/portfolio data | TanStack Query | Server state with caching, refetching, stale tracking |
| Search results | TanStack Query (debounced key) | Same benefits + automatic cancellation |
| Order submission | TanStack Query mutation | Loading/success/error states for free |
| Form inputs | `useState` | Ephemeral, component-scoped, no sharing needed |
| Modal visibility | `useState` | Same |
| Theme + locale | Zustand + AsyncStorage | Persisted across sessions, accessed from multiple components |
| Order history | Zustand + AsyncStorage | Local persistence, no backend dependency |

Both Zustand stores use a resilient `safeStorage` wrapper that silently falls back to no-op if the AsyncStorage native module is missing (web compatibility).

## Trade-offs

### What was intentionally simplified

- **No WebSocket/real-time prices**: The API is REST-only. Polling with `refetchInterval` would be trivial to add.
- **No chart library**: Sparklines via SVG paths. A real trading app would use a proper charting library for candlestick/OHLCV charts.
- **No authentication**: The API is public. Auth would add a login flow + token management.
- **No offline queue**: Orders submitted offline would fail. A production app would queue and retry.
- **No animations beyond transitions**: The modal slides up, skeletons pulse. No spring physics or gesture-driven animations. Financial products benefit from stability, not motion.

### What was intentionally not implemented

- **Component rendering tests**: Setup cost (mock providers, query client, theme context) is disproportionate for a take-home. Business logic tests provide higher ROI.
- **E2E tests**: Would require Detox/Maestro setup. Valuable in production, not for demonstrating engineering judgment.
- **Storybook**: Useful for design systems with multiple consumers. Overhead for a single-app challenge.

## Accessibility

- **Touch targets**: Minimum 44pt for all interactive elements
- **Contrast**: Semantic colors meet WCAG AA in both light/dark modes
- **Labels**: `accessibilityRole` and `accessibilityLabel` on interactive elements
- **Screen readers**: Order modal inputs labeled, status announced
- **Dynamic type**: `fontSize` in tokens supports system scaling

## Performance

- **`React.memo`** on `InstrumentCard` and `PortfolioPositionCard` — these receive stable props from `useCallback`-wrapped handlers
- **`keyExtractor`** on all FlatLists — stable keys prevent unnecessary remounts
- **Debounced search** (300ms) — avoids hammering the API on every keystroke
- **Memoized sparkline data** — SVG points computed once per data change
- **No inline arrow functions in renderItem** — prevents re-renders from new function references
- **Stable context values** — theme and i18n contexts use `useMemo` to avoid cascading re-renders

### What was NOT optimized

- **Bundle splitting**: Single route app, no benefit
- **Image optimization**: No images beyond assets
- **Virtualization tuning**: Default FlatList settings are adequate for ~25 items

## Testing Philosophy

Tests focus exclusively on **business-critical financial logic**:

| Module | Why tested |
|---|---|
| `aggregation.ts` | Position merging with weighted averages — wrong math = wrong money display |
| `validation.ts` | Order form rules — invalid orders waste API calls and confuse users |
| `payloads.ts` | Payload construction — wrong shape = API rejection |
| `format.ts` | Currency/percentage formatting — subtle edge cases (0, negative, locale) |
| `sparkline.ts` | Determinism guarantee — non-deterministic charts create visual chaos |

**42 tests total.** Each test exists because a bug there would directly harm the user.

### Intentionally not tested

- **Component rendering**: Mock setup cost > value for a take-home
- **API calls**: Mocking Axios doesn't test real network behavior
- **Navigation**: Single screen, trivial flow

## Scalability

### What stays the same at scale
- Feature-based architecture
- TanStack Query for server state
- Design token system
- i18n structure (add locales as JSON files)

### What changes at scale
- **i18n**: Adopt `react-i18next` when pluralization/interpolation is needed
- **State management**: Zustand stays but may get more stores (user session, feature flags)
- **Testing**: Add component tests (React Native Testing Library), E2E (Detox/Maestro)
- **API layer**: Add interceptors for auth tokens, refresh flows, error reporting
- **Navigation**: Multiple screens with deep linking
- **Charts**: Replace sparklines with a proper charting library (Victory, react-native-charts-wrapper)
- **Offline**: Add persistence layer with conflict resolution
- **Monitoring**: Sentry for errors, analytics for UX metrics

## Future Improvements

- Real-time price updates via WebSocket
- Watchlist / favorites functionality
- ~~Order history screen~~ ✓ (local)
- Candlestick charts with historical data
- Biometric authentication
- Push notifications for order fills
- ~~Portfolio performance over time chart~~ ✓ (derived from P&L)
- Haptic feedback on order submission
- Cloud sync for order history across devices

## License

MIT
