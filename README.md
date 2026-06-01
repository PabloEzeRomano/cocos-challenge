# Cocos Trading App

> 📝 Este README está en castellano porque el proceso de entrevistas se realiza íntegramente en español. [English version here](./README_EN.md).

App de trading en React Native para el mercado bursátil argentino. Muestra instrumentos con precios en tiempo real, posiciones del portafolio con ganancia/pérdida, búsqueda con debounce, y envío de órdenes (BUY/SELL, MARKET/LIMIT). Inspirada en Coinbase y Robinhood. Enfocada en claridad financiera por sobre ruido visual.

## Quick Start

```bash
# Prerequisitos: Node.js >= 18, Expo Go en tu dispositivo
yarn
yarn start
# Escaneá el QR con Expo Go o seguí las instrucciones para desarrollo local
```

```bash
yarn test  # 42 unit tests
```

## Stack

| Tecnología | Por qué |
|---|---|
| **Expo + Expo Router** | Builds nativos sin configuración, routing basado en archivos. El workflow managed evita complejidad de toolchain nativo. |
| **TypeScript** | Innegociable para lógica financiera. Atrapa errores de cálculo en tiempo de compilación. |
| **TanStack Query** | Estado del servidor con cache, refetching, estados de carga/error. Reemplaza boilerplate async manual. |
| **Zustand** | Estado global liviano para theme, locale, watchlist e historial de órdenes (~30 líneas por store). |
| **Axios** | Cliente HTTP tipado. Más simple que fetch para manejo consistente de errores. |
| **react-native-svg** | Sparklines sin necesidad de una librería de charts pesada. |
| **Estilos nativos de RN** | Control total sobre la presentación de datos financieros. Design tokens dan consistencia sin framework. |

## Arquitectura

```
src/
  features/
    instruments/          # Lista, cards, sparklines, filtrado por watchlist
    portfolio/            # Agregación de posiciones, P&L, resumen
    orders/               # Modal, formulario, validación, resultado, historial
    search/               # Barra de búsqueda con debounce + resultados
  components/             # Compartidos: Skeleton, ErrorState, EmptyState, TabBar, Avatar, Sparkline
  hooks/useDebounce.ts    # Hook genérico de debouncex
  services/api.ts         # Cliente Axios + funciones de endpoint tipadas
  store/                  # Zustand: preferences, watchlist, orderHistory, safeStorage
  theme/                  # Design tokens (colores semánticos, spacing, tipografía, radius)
  i18n/                   # Diccionarios JSON (es/en) + context provider
  utils/format.ts         # Formateadores de moneda, porcentaje, cantidad
  types/api.ts            # Tipos compartidos de la API
```

**Feature-based**: cada feature es dueña de sus componentes, hooks y utils. Agregar una feature no toca código existente; borrar una es eliminar un solo directorio.

## Decisiones Clave

### Agregación de Posiciones del Portafolio

La API devuelve tickers duplicados (ej: MOLA ×2 con distinto `avg_cost_price`) representando múltiples lotes de compra. La app agrega por ticker: suma cantidades, calcula costo promedio ponderado, y deriva valor de mercado / P&L desde ahí. Es el enfoque estándar de cualquier broker.

### Manejo de ARS (Efectivo)

El portafolio incluye una entrada ARS con `avg_cost_price=99.9` pero `last_price=1` (claramente efectivo, no una posición). Se muestra como fila "Efectivo" sin cálculos de P&L, excluida de retornos, no se puede operar.

### Sparklines

Determinísticos, con seed derivado del string del ticker, mismo ticker siempre renderiza la misma forma. Interpola de `close_price` a `last_price` con ruido controlado. La API solo provee dos data points, así que charts históricos reales no son posibles. El sparkline brinda contexto direccional, que es su propósito.

### Formulario de Órdenes

Dos modos de input: cantidad exacta o monto en ARS (auto-calcula `Math.floor(monto / last_price)`). No se permiten fracciones de acciones. Órdenes LIMIT muestran campo de precio; MARKET lo oculta. Validación de saldo disponible avisa cuando los fondos son insuficientes.

### Historial de Órdenes (Local)

Persistido con Zustand + AsyncStorage. La API no tiene endpoint de historial, así que el almacenamiento local da feedback inmediato de "mis órdenes". Sobrevive al reinicio de la app, no a la reinstalación.

### Theme

Sistema de tokens semánticos (light/dark). Jerarquía de fondos (`bg` → `surface` → `surfaceModal`), jerarquía de texto, colores financieros semánticos (`positive`/`negative`), y tokens interactivos. Sin shadows, inconsistentes cross-platform y agregan ruido a UIs financieras.

### i18n Sin Librería Externa

Diccionarios JSON + React context + función `t()`, ~40 líneas. Default: español. Soporta keys anidadas. Sin librería externa. Adoptaría `react-i18next` solo cuando se necesite pluralización/formato ICU.

### Manejo de Estado

| Estado | Solución | Razón |
|---|---|---|
| Datos del servidor | TanStack Query | Cache, refetching, tracking de stale |
| Búsqueda | TanStack Query (key con debounce) | Auto-cancelación en nuevas queries |
| Órdenes | TanStack Query mutation | Loading/success/error gratis |
| Inputs del form, modal | `useState` | Efímeros, scoped al componente |
| Theme, locale, watchlist, historial | Zustand + AsyncStorage | Persistidos, compartidos entre componentes |

Todos los stores de Zustand usan un wrapper `safeStorage` compartido que hace fallback a no-op si AsyncStorage no está disponible (compatibilidad web).

## Testing

Los tests se enfocan exclusivamente en lógica financiera crítica:

| Módulo | Por qué |
|---|---|
| `aggregation.ts` | Promedio ponderado incorrecto = plata mal mostrada en pantalla |
| `validation.ts` | Órdenes inválidas desperdician llamadas a la API y confunden al usuario |
| `payloads.ts` | Payload con forma incorrecta = rechazo de la API |
| `format.ts` | Edge cases: 0, negativos, números grandes, formateo de locale |
| `sparkline.ts` | Debe ser determinístico, charts random = caos visual |

**No testeado**: rendering de componentes (costo de setup de mocks > valor), llamadas a la API (mockear no testea comportamiento real), navegación (pantalla única).

## Trade-offs

- **Sin WebSocket**: la API es REST-only. Agregar `refetchInterval` sería trivial.
- **Sin librería de charts**: sparklines via SVG. Una app real usaría Victory o similar para charts de velas.
- **Sin auth**: la API es pública. Auth implicaría flujo de login + manejo de tokens.
- **Sin cola offline**: las órdenes fallidas no se reintentan. En producción se encolarían y sincronizarían.
- **Animaciones mínimas**: el modal desliza, los skeletons pulsan. Las apps financieras se benefician de estabilidad sobre movimiento.
- **Sin tests de componentes/E2E**: los tests de lógica de negocio dan mayor ROI para este scope.

## Accesibilidad

- **Touch targets**: mínimo 44pt para todos los elementos interactivos
- **Contraste**: colores semánticos cumplen WCAG AA en ambos modos light/dark
- **Labels**: `accessibilityRole` y `accessibilityLabel` en elementos interactivos
- **Screen readers**: inputs del modal de órdenes etiquetados, estado anunciado
- **Tipo dinámico**: `fontSize` en tokens soporta escalado del sistema

## Performance

- **`React.memo`** en `InstrumentCard` y `PortfolioPositionCard` — reciben props estables desde handlers wrapeados con `useCallback`
- **`keyExtractor`** en todos los FlatLists — keys estables previenen remounts innecesarios
- **Búsqueda con debounce** (300ms) — evita bombardear la API en cada keystroke
- **Datos de sparkline memorizados** — puntos SVG calculados una sola vez por cambio de datos
- **Sin arrow functions inline en renderItem** — previene re-renders por nuevas referencias de función
- **Valores de context estables** — theme e i18n usan `useMemo` para evitar re-renders en cascada

## Escalabilidad

**Se mantiene**: arquitectura feature-based, TanStack Query, design tokens, estructura de i18n.

**Cambia a escala**: adoptar `react-i18next` para pluralización, agregar interceptors de auth, tests de componentes (RNTL), E2E (Detox), librería de charts real, sync offline con resolución de conflictos, monitoreo con Sentry.

## Mejoras Futuras

- Precios en tiempo real via WebSocket
- Charts de velas con datos históricos
- Autenticación biométrica
- Notificaciones push para ejecución de órdenes
- Sync en la nube para historial de órdenes
- Feedback háptico en acciones de órdenes
