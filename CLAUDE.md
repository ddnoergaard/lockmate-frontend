# Lockmate Frontend — CLAUDE.md

pnpm workspace monorepo. Node 24+, pnpm 11.8.0.

## Layout

```
apps/
  app/      Vault app — React 19 + TypeScript + Vite. Deployed on Vercel (Root Directory: apps/app).
  public/   Marketing site — React 19 + TypeScript + Vite. Deployed on Vercel (Root Directory: apps/public).
packages/
  ui/       @lockmate/ui — shared component library. Private, never published.
```

## Running the workspace

```bash
pnpm install                    # install all packages from root
pnpm --filter app dev           # vault app dev server
pnpm --filter public dev        # marketing site dev server
pnpm --filter app build         # production build for vault app
pnpm --filter public build      # production build for marketing site
```

## @lockmate/ui rules

**Rule 1 — workspace:*, never published.**
Both apps depend on `"@lockmate/ui": "workspace:*"`. The package is `private: true`,
`version: "0.0.0"`. Do not add a publish script, changesets, or version bumps.

**Rule 2 — react and react-dom are always peerDependencies in ui, never dependencies.**
If react ends up under `dependencies` in packages/ui/package.json, both apps will each
bundle their own copy of React. Two React copies in one page breaks all hooks with
"invalid hook call". Keep react/react-dom under `peerDependencies` AND `devDependencies`
(the devDep lets TypeScript and local tooling resolve types), but never under `dependencies`.

**Rule 3 — no build step in ui.**
`packages/ui/package.json` exports point directly at TypeScript source (`./src/index.ts`,
`./src/tokens.css`). Each app's Vite compiles the ui source inline. Do not add a tsup/tsc
build step unless Vite starts failing to resolve raw TSX from a workspace dependency.

## Tokens and styling

**Rule 4 — design tokens live in packages/ui/src/tokens.css, nowhere else.**
`tokens.css` defines all CSS custom properties (`--bg`, `--accent`, `--text`, etc.) for
both dark (`:root`) and light (`[data-theme="light"]`) themes. The `data-theme` attribute
is set on `<html>` by an inline script in each app's `index.html` before first paint.

Both apps import the token file at the top of their CSS entry:
```css
@import "@lockmate/ui/tokens.css";
```

Do not copy token values into individual app CSS files. If a token is missing, add it to
`packages/ui/src/tokens.css` and it becomes available in both apps automatically.

**Rule 5 — components in ui use CSS Modules.**
Component styles live in `ComponentName.module.css` alongside the component file.
Classes are scoped automatically. Token references (`var(--accent)`, etc.) work because
the consuming app imports `tokens.css` in its entry CSS before rendering.

## Adding a new shared component

1. Create `packages/ui/src/MyComponent.tsx` + `MyComponent.module.css`.
2. Export from `packages/ui/src/index.ts`.
3. Import in the app: `import { MyComponent } from '@lockmate/ui'`.
4. No install or build step needed — Vite picks up the change immediately.

## Vercel deployment

Two separate Vercel projects, one per app:

| Project        | Root Directory | Build command       | Output dir |
|----------------|---------------|---------------------|------------|
| lockmate-app   | `apps/app`    | `pnpm run build`    | `dist`     |
| lockmate-public| `apps/public` | `pnpm run build`    | `dist`     |

Vercel must be told to use pnpm: set the **Install Command** to `pnpm install --frozen-lockfile`
(or leave blank if Vercel auto-detects pnpm from `packageManager` in root package.json).
The monorepo root's `pnpm-workspace.yaml` ensures workspace links resolve correctly during CI.
