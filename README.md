# UCLA Knee MRI Course

Canonical production app for the UCLA Knee MRI interpretation course.

This is the active Vite/Firebase implementation. The older Next/SQLite prototype
is kept in `../knee-mri-fellows` as an archived reference only.

## Stack

- Vite
- React
- TypeScript
- Firebase Auth, Firestore, and callable functions
- Tailwind CSS

## Local Development

```bash
npm install
npm run dev
```

Open the local Vite URL printed by the dev server.

## Quality Gate

Run both checks before deploying:

```bash
npm run lint
npm run build
```

## Notes

- Case simulator images should be embedded in this app under `public/images`.
- External source links may be kept for attribution or faculty review, but the
  learner workflow should not depend on opening an external case site.
- Do not use the archived Next app for new feature work unless the goal is to
  migrate a specific useful idea into this Vite app.
