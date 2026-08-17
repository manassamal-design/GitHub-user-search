import { UserCard } from './UserCard'

export function UserList({ users, status, error, query }) {
  if (status === 'loading') {
    return <p className="status-message">Loading users…</p>
  }

  if (status === 'error') {
    return <p className="status-message status-error">{error}</p>
  }

  if (status === 'idle' && !query) {
    return <p className="status-message">Start typing to search GitHub users.</p>
  }

  if (status === 'success' && users.length === 0) {
    return <p className="status-message">No users found for "{query}".</p>
  }

  return (
    <div className="user-grid">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}
