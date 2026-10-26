// where a homepage visitor came from, as one of the names in clickSources
export const clickSources = ['instagram', 'tiktok', 'pinterest', 'facebook', 'google', 'other', 'direct'];

const patterns = [
  ['instagram', /instagram/i],
  ['tiktok', /tiktok|musical_ly|bytedance/i],
  ['pinterest', /pinterest|pin\.it/i],
  ['facebook', /facebook|FBAN|FBAV|fb\.me/i],
  ['google', /google\./i],
];

export function detectSource({ search = '', userAgent = '', referrer = '' } = {}) {
  const utm = new URLSearchParams(search).get('utm_source') || '';
  // a utm_source tag wins, then the in-app browser, then the page that linked here
  for (const value of [utm, userAgent, referrer]) {
    const match = value && patterns.find(([, pattern]) => pattern.test(value));
    if (match) return match[0];
  }
  if (utm) return 'other';
  if (referrer && !referrer.includes(typeof location !== 'undefined' ? location.host : 'sareish.com')) return 'other';
  return 'direct';
}
