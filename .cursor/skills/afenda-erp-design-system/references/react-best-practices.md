# React Best Practices (V2)

From Vercel `react-best-practices`. **Primitives:** P1–P8 only. **ERP routes:** also [surface-quality-scan.md](surface-quality-scan.md) A-tier.

## P1–P8 (components/ui)

| ID | Check |
| --- | --- |
| P1 | No inline subcomponents in render |
| P2 | No `useEffect` mirroring Base UI state |
| P3 | Module `*_CLASS` + `*ClassName()` — no inline `style` |
| P4 | Animate `<span>` wrapper, not lucide SVG root |
| P5 | Named `lucide-react` imports; public barrel imports |
| P6 | Ternary not `&&` for numeric; `aria-hidden` on decorative icons |
| P7 | Hoist default `[]`/`{}` props |
| P8 | Hoist static JSX only if profiled |

## ERP (summary)

- `async-parallel` — `Promise.all` in loaders
- `bundle-barrel-imports` / `bundle-dynamic-imports` — narrow imports, `next/dynamic` for heavy UI
- `server-serialization` — minimal RSC → client props

No `memo` on thin primitives without evidence.
