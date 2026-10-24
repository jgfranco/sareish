// fire-and-forget click count; doesn't delay opening the link
export default function trackClick(id) {
  try {
    const body = new Blob([JSON.stringify({ _id: id })], { type: 'application/json' });
    navigator.sendBeacon('/api/clicks', body);
  } catch {
    // tracking is best effort
  }
}
