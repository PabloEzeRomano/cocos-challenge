# Cocos Trading App

React Native trading app for the Argentine stock market. Displays instruments with real-time prices, portfolio positions with P&L, debounced search, and order placement (BUY/SELL, MARKET/LIMIT). Inspired by Coinbase and Robinhood, focused on financial clarity over visual noise.

## Quick Start

```bash
# Prerequisites: Node.js >= 18, Expo Go on your device
yarn
yarn start
# Scan QR with Expo Go or follow the instructions for local development
```

```bash
yarn test  # 42 unit tests
```

## Stack

| Technology | Why |
|---|---|
| **Expo + Expo Router** | Zero-config native builds, file-based routing. Managed workflow avoids native toolchain complexity. |
| **TypeScript** | Non-negotiable for financial logic. Catches calculation errors at compile time. |
| **TanStack Query** | Server state with caching, refetching, loading/error states. Replaces manual async boilerplate. |
| **Zustand** | Lightweight global state for theme, locale, watchlist, and order history (~30 lines per store). |
| **Axios** | Typed HTTP client. Simpler than raw fetch for consistent error handling. |
| **react-native-svg** | Sparkline charts without a heavy charting library. |
| **Plain RN styles** | Full control over financial data presentation. Design tokens provide consistency without a framework. |

## Architecture

```
src/
  features/
    instruments/          # List, cards, sparklines, watchlist filtering
    portfolio/            # Position aggregation, P&L, summary
    orders/               # Modal, form, validation, result, history
    search/               # Debounced search bar + results
  components/             # Shared: Skeleton, ErrorState, EmptyState, TabBar, Avatar, Sparkline
  hooks/useDebounce.ts    # Generic debounce hook
  services/api.ts         # Axios client + typed endpoint functions
  store/                  # Zustand: preferences, watchlist, orderHistory, safeStorage
  theme/                  # Design tokens (semantic colors, spacing, typography, radius)
  i18n/                   # JSON dictionaries (es/en) + context provider
  utils/format.ts         # Currency, percentage, quantity formatters
  types/api.ts            # Shared API types
```

**Feature-based**: each feature owns its components, hooks, and utils. Adding a feature doesn't touch existing code; deleting one is a single directory removal.

## Key Decisions

### Portfolio Aggregation

The API returns duplicate tickers (e.g., MOLA ×2 with different `avg_cost_price`) representing multiple lots. The app aggregates by ticker: sums quantities, calculates weighted average cost, and derives market value / P&L from there. This is the standard brokerage approach.

### ARS Cash Handling

The portfolio includes an ARS entry with `avg_cost_price=99.9` but `last_price=1`, clearly cash, not a position. Displayed as a "Cash" row without P&L calculations, excluded from returns, non-tappable.

### Sparklines

Deterministic, seeded from ticker string. Same ticker always renders the same shape. Interpolates from `close_price` to `last_price` with controlled noise. The API only provides two data points, so real historical charts aren't possible. The sparkline provides directional context, which is its purpose.

### Order Form

Two input modes: exact quantity or ARS amount (auto-calculates `Math.floor(amount / last_price)`). No fractional shares. LIMIT orders show a price field; MARKET hides it. Cash balance validation warns when funds are insufficient.

### Order History (Local)

Persisted via Zustand + AsyncStorage. The API has no history endpoint, so local storage provides immediate "my orders" feedback. Survives app restart, not reinstall.

### Theme

Semantic token-based system (light/dark). Background hierarchy (`bg` → `surface` → `surfaceModal`), text hierarchy, semantic financial colors (`positive`/`negative`), and interactive tokens. No shadows, inconsistent cross-platform and adds noise to financial UIs.

### i18n Without a Library

JSON dictionaries + React context + `t()` function, ~40 lines. Default: Spanish. Supports nested keys. No external library. Would adopt `react-i18next` only when pluralization/ICU format becomes necessary.

### State Management

| State | Solution | Reason |
|---|---|---|
| Server data | TanStack Query | Caching, refetching, stale tracking |
| Search | TanStack Query (debounced key) | Auto-cancellation on new queries |
| Orders | TanStack Query mutation | Loading/success/error for free |
| Form inputs, modal | `useState` | Ephemeral, component-scoped |
| Theme, locale, watchlist, order history | Zustand + AsyncStorage | Persisted, shared across components |

All Zustand stores use a shared `safeStorage` wrapper that falls back to no-op if AsyncStorage is unavailable (web compatibility).

## Testing

Tests focus on business-critical financial logic only:

| Module | Why |
|---|---|
| `aggregation.ts` | Wrong weighted average = wrong money on screen |
| `validation.ts` | Invalid orders waste API calls and confuse users |
| `payloads.ts` | Wrong payload shape = API rejection |
| `format.ts` | Edge cases: 0, negatives, large numbers, locale formatting |
| `sparkline.ts` | Must be deterministic, random charts create visual chaos |

**Not tested**: component rendering (mock setup cost > value), API calls (mocking doesn't test real behavior), navigation (single screen).

## Trade-offs

- **No WebSocket**: API is REST-only. Adding `refetchInterval` would be trivial.
- **No chart library**: Sparklines via SVG. A real app would use Victory or similar for candlestick charts.
- **No auth**: API is public. Auth would mean login flow + token management.
- **No offline queue**: Failed orders aren't retried. Production would queue and sync.
- **Minimal animation**: Modal slides, skeletons pulse. Financial apps benefit from stability over motion.
- **No component/E2E tests**: Business logic tests provide higher ROI for this scope.

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

## Scalability

**Stays**: feature-based architecture, TanStack Query, design tokens, i18n structure.

**Changes at scale**: adopt `react-i18next` for pluralization, add auth interceptors, component tests (RNTL), E2E (Detox), proper charting library, offline sync with conflict resolution, Sentry monitoring.

## Future Improvements

- Real-time prices via WebSocket
- Candlestick charts with historical data
- Biometric authentication
- Push notifications for order fills
- Cloud sync for order history
- Haptic feedback on order actions
