# Forge — Personal Gym Coach

Forge is a mobile-first, local-first PWA foundation for a calm personal gym coach. This repository currently contains **Milestone 1 only**: the design system and application shell. It intentionally does not execute workouts, assign weights, or embed a particular person's plan.

## Architecture boundary

The shell is deliberately organized around independent domains:

- `UserProfile`: preferences and training context
- `WorkoutPlan`: versioned, imported plan data owned by a profile
- `Exercise`: reusable exercise-library metadata
- `WorkoutSession`: execution records (future workout engine output)
- `BodyWeightEntry`: history / analytics input
- `AppSettings`: device-local settings and schema version

The types live in `src/domain/types.ts`. The contents in `src/data/sampleContent.ts` are visual-only seed data, not workout behavior. Milestone 2 will add validated local persistence, onboarding, and structured plan import; Milestone 4 will make the engine execute the active user plan.

## Local development

Prerequisite: Node.js 20.19+ (or a currently supported Node LTS) and npm.

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite. Use `npm run typecheck` for strict TypeScript validation and `npm run build` for the production bundle.

## PWA installation

Build and serve the production app, then use the browser’s **Install app** / **Add to Home Screen** command. The project includes a manifest and a small app-shell service worker. It caches the application shell only; persistent offline workout data is intentionally deferred until the local-data milestone.

## Performance checklist

- No runtime UI dependency beyond React.
- One local render tree; navigation changes are immediate.
- Responsive CSS starts with phone widths and uses large controls.
- Service worker caches the shell after first successful load.
- Exercise media is not downloaded or embedded in Milestone 1.
- Future active-workout actions must persist locally and never wait on network responses.
