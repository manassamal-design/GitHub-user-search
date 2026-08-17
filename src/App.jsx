import { useEffect, useRef, useState } from 'react'
import { SearchBar } from './components/SearchBar'
import { UserList } from './components/UserList'
import { Pagination } from './components/Pagination'
import { useDebounce } from './hooks/useDebounce'
import { searchUsers } from './api/github'
import './App.css'

export default function App() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [users, setUsers] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [error, setError] = useState('')

  const debouncedQuery = useDebounce(query, 400)

  // Whenever the *debounced* query changes, we're starting a new search,
  // so page always resets to 1. This effect is intentionally separate
  // from the fetch effect below so "new search" and "change page" stay
  // as two distinct, easy-to-reason-about triggers instead of one
  // tangled condition.
  useEffect(() => {
    setPage(1)
  }, [debouncedQuery])

  // AbortController ref survives across renders without triggering one,
  // which is what fixes the classic race condition: if the user types
  // fast, an in-flight request for "torv" can resolve *after* the
  // request for "torvalds" and clobber the newer result. Aborting the
  // previous request before starting a new one prevents that.
  const abortRef = useRef(null)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setUsers([])
      setTotalPages(0)
      setStatus('idle')
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setStatus('loading')
    setError('')

    searchUsers(debouncedQuery, page, controller.signal)
      .then(({ users, totalPages }) => {
        setUsers(users)
        setTotalPages(totalPages)
        setStatus('success')
      })
      .catch((err) => {
        // A request we aborted ourselves isn't a real error - swallow it
        // so the UI doesn't flash an "AbortError" message.
        if (err.name === 'AbortError') return
        setStatus('error')
        setError(err.message)
      })

    return () => controller.abort()
  }, [debouncedQuery, page])

  return (
    <div className="app">
      <header>
        <h1>GitHub User Search</h1>
        <p className="subtitle">Search is debounced 400ms, results paginate 12 at a time.</p>
      </header>

      <SearchBar value={query} onChange={setQuery} />

      <UserList users={users} status={status} error={error} query={debouncedQuery} />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        disabled={status === 'loading'}
      />
    </div>
  )
}
