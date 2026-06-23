# Lockmate Frontend

pnpm workspace monorepo for the Lockmate frontend.

## Structure

```
apps/
  app/      Vault app (React + TypeScript + Vite)
  public/   Marketing site (React + TypeScript + Vite)
packages/
  ui/       @lockmate/ui — shared component library
```

## Getting started

```bash
pnpm install
pnpm --filter app dev       # vault app
pnpm --filter public dev    # marketing site
```

## Key conventions

- `@lockmate/ui` is consumed as `workspace:*`, never published.
- `react` and `react-dom` are `peerDependencies` in `packages/ui`, never `dependencies`.
- Design tokens live in `packages/ui/src/tokens.css` and are imported in each app's entry CSS.
- Components in `packages/ui` use CSS Modules for scoped styling.

## Deployment

Two separate Vercel projects:
- Vault app — Root Directory: `apps/app`
- Marketing site — Root Directory: `apps/public`
