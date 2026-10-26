import { detectSource } from './clickSource';

// fire-and-forget click count; doesn't delay opening the link
export default function trackClick(id) {
  try {
    const source = detectSource({ search: location.search, userAgent: navigator.userAgent, referrer: document.referrer });
    const body = new Blob([JSON.stringify({ _id: id, source })], { type: 'application/json' });
    navigator.sendBeacon('/api/clicks', body);
  } catch {
    // tracking is best effort
  }
}
