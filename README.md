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

The types live in `src/domain/types.ts`. The contents in `src/data/sampleContent.ts` are visual-only seed data, not workout behavior. Milestone 2 adds an eight-step onboarding flow plus a versioned IndexedDB bundle containing the active profile, equipment inventory, safety acknowledgement, workout settings, and app settings. The bundle includes a plan slot but does not execute plans. Milestone 3 adds the bundled curated exercise library in `src/data/exerciseLibrary.ts`, including safety, substitution, and optional verified-video metadata. Structured plan import should then populate the plan slot before Milestone 4 makes the engine execute the active user's plan.

## Local development

Prerequisite: Node.js 20.19+ (or a currently supported Node LTS) and npm.

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite. Use `npm test` for persistence/schema tests, `npm run typecheck` for strict TypeScript validation, and `npm run build` for the production bundle.

## Structured plan import

The Workout screen accepts JSON with `title`, seven `schedule` entries, and `workoutDays`. Each workout exercise must use an `exerciseId` already present in the bundled library, plus `sets`, a `repRange`, `restSeconds`, and `priority` (`primary` or `accessory`). Imported plans are versioned data saved locally; the resolver selects compatible exercises or a ranked, available substitute. It never invents a starting weight.

## PWA installation

Build and serve the production app, then use the browser’s **Install app** / **Add to Home Screen** command. The project includes a manifest and a small app-shell service worker. It caches the application shell only; persistent offline workout data is intentionally deferred until the local-data milestone.

## Performance checklist

- No runtime UI dependency beyond React.
- One local render tree; navigation changes are immediate.
- Responsive CSS starts with phone widths and uses large controls.
- Service worker caches the shell after first successful load.
- Exercise media is not downloaded or embedded in Milestone 1.
- Future active-workout actions must persist locally and never wait on network responses.
