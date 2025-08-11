# Repository Guidelines

## Project Structure & Modules
- `src/`: App code (React + TypeScript)
  - `components/` (PascalCase React components), `hooks/` (camelCase, start with `use`), `store/` (Zustand stores), `services/` (platform/data utils), `types/` (TypeScript types), `tests/` (Vitest specs, setup).
- `public/`: Static assets served by Vite.
- `docs/`: Project documentation; see `MOBILE_SETUP.md` for mobile specifics.
- `dist/`: Build output (generated).

## Build, Test, and Dev Commands
- `npm run dev`: Start Vite dev server.
- `npm run build`: Type-check (`tsc`) then production build.
- `npm run preview`: Serve the production build locally.
- `npm run test`: Run Vitest in node/jsdom with globals.
- `npm run test:coverage`: Run tests with coverage (90% global thresholds).
- Mobile (Capacitor): `npm run mobile:build` (build + `cap sync`), `npm run cap:run:ios` / `npm run cap:run:android` to run on devices/emulators.

## Coding Style & Naming
- TypeScript, 2-space indentation, semicolons optional (stay consistent with existing files).
- Components: PascalCase filenames (e.g., `MainApp.tsx`). Hooks: `useX` camelCase (e.g., `useTheme.ts`). Stores/util files: camelCase (e.g., `progressStore.ts`). Types/interfaces: PascalCase.
- Import aliases: `@` → `/src`, `@tests` → `/src/tests`.

## Testing Guidelines
- Frameworks: Vitest + React Testing Library; jsdom environment. Setup at `src/tests/setup.ts`.
- Place specs under `src/tests/**` as `*.test.ts` or `*.test.tsx` (e.g., `src/tests/components/progress/WeekProgress.test.tsx`).
- Ensure coverage meets thresholds (branches/functions/lines/statements ≥ 90%). Use focused commands like `npm run test:components` or `npm run test:integration` when iterating.

## Commit & PR Guidelines
- Commit style: Prefer Conventional Commits (e.g., `feat: ...`, `fix: ...`). Keep concise, imperative subject; reference issues when relevant.
- PRs must include: clear description/scope, linked issues, test evidence (coverage or screenshots for UI), and notes on platform impact (iOS/Android) if applicable.
- CI expectations: All tests and `npm run build` pass locally before requesting review.

## Mobile & Platform Notes
- Capacitor config lives in `capacitor.config.ts`. After dependency or asset changes, run `npm run mobile:build` then the platform-specific run command.
- Do not commit generated platform build artifacts; prefer syncing via Capacitor. See `MOBILE_SETUP.md` for provisioning and device setup.

