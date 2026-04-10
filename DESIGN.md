# Design Brief

## Direction
Bloomberg Terminal meets Linear — dark, data-dense professional dashboard for supply chain risk optimization. Terminal-like precision with modern SaaS polish.

## Tone
Brutalist/industrial — no decoration, clinical cleanliness, high contrast text, surgical focus on data legibility and risk signaling.

## Differentiation
Risk color scale (red/yellow/green) integrated into every data point, sparkline trend visualization, monospace data displays for precision, grid-aligned information architecture.

## Color Palette

| Token      | OKLCH           | Role                                  |
| ---------- | --------------- | ------------------------------------- |
| background | 0.145 0.014 260 | Deep charcoal, dark mode primary      |
| foreground | 0.95 0.01 260   | Light grey text, max contrast         |
| card       | 0.18 0.014 260  | Surface elevation for sections        |
| primary    | 0.75 0.15 190   | Cyan accent, interactive elements     |
| destructive| 0.55 0.2 25     | High risk indicator (red)             |
| warning    | 0.75 0.15 85    | Medium risk indicator (yellow)        |
| success    | 0.65 0.18 145   | Low risk indicator (green)            |
| muted      | 0.22 0.02 260   | Disabled, secondary text              |

## Typography
- Display: Space Grotesk — dashboard headers, section titles, data labels
- Body: DM Sans — cards, UI text, descriptions
- Mono: Geist Mono — metric displays, data values, precision numbers
- Scale: hero `text-lg font-semibold`, h2 `text-sm font-semibold tracking-tight`, label `text-xs uppercase tracking-widest`, data `font-mono text-sm tabular-nums`

## Elevation & Depth
Minimal shadows: card border at 0.18 L with 1px top border only. No glow or blur. Depth via layered backgrounds (0.145, 0.18, 0.22) and thin 1px borders.

## Structural Zones

| Zone    | Background  | Border                    | Notes                             |
| ------- | ----------- | ------------------------- | --------------------------------- |
| Header  | card (0.18) | border-b 1px             | Navigation, alerts, refresh status|
| Sidebar | card (0.18) | border-r 1px             | Risk gauge, portfolio summary     |
| Content | background  | — per card                | Supplier grid, scenarios          |
| Footer  | muted (0.22)| border-t 1px              | Legend, status indicators         |

## Spacing & Rhythm
Compact: cards use 3px padding (tight density), 4px gaps between elements. Section margins 12px. Headings 6px above, 4px below. Data rows 2px padding. No breathing room — information priority.

## Component Patterns
- Buttons: accent background, minimal 1px border, no shadow, 4px radius on interactive only
- Cards: card background, 1px border-b only, no shadow, tight 3px padding
- Risk badges: color-coded (destructive/warning/success), monospace weight, bold, 2px padding
- Sparklines: chart colors mapped to time series trend, inline data visualization

## Motion
- Entrance: instant (no delay), fade in 200ms smooth easing
- Hover: text opacity shift 100ms, no scale or lift
- Decorative: none; motion reserved for data state changes (risk updates, refresh pulses)

## Constraints
- Dark mode only; light mode not supported
- No gradients, no blur, no decorative imagery
- Risk scale colors MUST NOT change (red/yellow/green fixed per risk level)
- Monospace required for all numeric displays for tabular alignment
- Max 4px border-radius; sharp corners on most elements

## Signature Detail
Thin 1px bottom border on cards only (not full border) creates minimalist elevation without visual weight, echoing terminal UI conventions while maintaining modern SaaS clarity.
