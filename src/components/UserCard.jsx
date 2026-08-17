export function UserCard({ user }) {
  return (
    <a
      className="user-card"
      href={user.html_url}
      target="_blank"
      rel="noreferrer"
    >
      <img src={user.avatar_url} alt={`${user.login} avatar`} loading="lazy" />
      <div className="user-card-info">
        <p className="user-login">{user.login}</p>
        <p className="user-type">{user.type}</p>
      </div>
    </a>
  )
}
