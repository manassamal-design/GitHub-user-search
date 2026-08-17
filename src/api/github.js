const BASE_URL = 'https://api.github.com'
const PER_PAGE = 12

/**
 * Thin wrapper around the GitHub "search users" endpoint.
 * Throws a normal Error with a readable message on any non-2xx response,
 * so callers can just try/catch instead of checking res.ok everywhere.
 */
export async function searchUsers(query, page = 1, signal) {
  const url = new URL(`${BASE_URL}/search/users`)
  url.searchParams.set('q', query)
  url.searchParams.set('page', String(page))
  url.searchParams.set('per_page', String(PER_PAGE))

  const res = await fetch(url, { signal })

  if (!res.ok) {
    // GitHub's unauthenticated rate limit is 10 req/min - this is the
    // most common error you'll actually hit while developing, so it
    // gets its own message instead of a generic "request failed".
    if (res.status === 403) {
      throw new Error('GitHub rate limit hit. Wait a bit and try again.')
    }
    if (res.status === 422) {
      throw new Error('Invalid search query.')
    }
    throw new Error(`GitHub API error (${res.status})`)
  }

  const data = await res.json()
  return {
    users: data.items,
    totalCount: data.total_count,
    totalPages: Math.min(Math.ceil(data.total_count / PER_PAGE), 1000 / PER_PAGE),
  }
}

export async function getUser(username, signal) {
  const res = await fetch(`${BASE_URL}/users/${username}`, { signal })
  if (!res.ok) throw new Error(`Could not load ${username} (${res.status})`)
  return res.json()
}

export { PER_PAGE }
