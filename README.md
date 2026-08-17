# GitHub User Search

A small React + Vite app that hits the public GitHub Search API. Built as a
focused exercise on the parts of data-fetching in React that don't show up
until you actually build something: debounced input, loading/error state,
pagination, and the race conditions that come from fetching inside `useEffect`.

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

No API key needed — GitHub's search endpoint works unauthenticated, but it's
rate-limited to 10 requests/minute per IP. You'll hit that limit if you type
a lot without debouncing, which is part of the point of this exercise.

## What each piece is doing

- **`src/api/github.js`** — all `fetch` calls live here, not in components.
  Throws readable errors instead of raw `Response` objects.
- **`src/hooks/useDebounce.js`** — delays updating a value until the input
  has been quiet for 400ms, so a `useEffect` watching it doesn't fire on
  every keystroke.
- **`src/App.jsx`** — owns state and the two `useEffect`s: one resets the
  page on a new search, the other actually fetches.

## The pain points this project is meant to surface

**Race conditions.** Type "torv" then keep typing to "torvalds" fast — two
requests go out, and without protection, whichever *resolves* last wins,
not whichever was *sent* last. `App.jsx` fixes this with an `AbortController`
stored in a `ref`: every new request aborts the previous one before firing.

**Stale closures.** If you fetch inside `useEffect` and reference `page` or
`query` without listing them as dependencies, the closure captures whatever
those values were on the render the effect was created in — so your fetch
silently uses old state. The fix here is boring but correct: every value the
effect reads (`debouncedQuery`, `page`) is in the dependency array.

**Re-fetch triggers.** There are two effects instead of one because "the
search changed" and "the page changed" are different events that should
both trigger a fetch, but only the first should reset pagination. Cramming
that into one effect with an `if` branch works but gets fragile fast.

## Extending it

- Swap the search-users call for `getUser(username)` to build a detail view
  on click.
- Add a `sort` param (`followers`, `repositories`, `joined`) as a second
  control next to the search bar.
- Cache pages already fetched in a `Map` keyed by `${query}-${page}` to
  avoid re-fetching when a user pages back and forth.
