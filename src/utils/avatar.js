export function getInitial(value = '') {
  const seed = String(value || '').trim()
  return seed ? seed.charAt(0).toUpperCase() : '?'
}

export function getAvatarUrl(seed, explicitUrl) {
  const explicit = String(explicitUrl || '').trim()
  if (explicit) return explicit

  const safeSeed = encodeURIComponent(String(seed || 'user').trim() || 'user')
  return `https://api.dicebear.com/9.x/initials/svg?seed=${safeSeed}`
}
