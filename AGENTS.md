# AI Agent Instructions for GP-Dashboard

## Build & Verification Rules
- **DO NOT run `npm run build` or `next build` simply to verify changes while developing.**
- **ALWAYS use `npm run type-check` (`tsc --noEmit`) to verify TypeScript types, imports, and syntax.**
- Next.js development server caches to `.next-dev/` while production builds use `.next/`.
- Ensure all newly introduced packages are installed with `npm install` before running scripts.
