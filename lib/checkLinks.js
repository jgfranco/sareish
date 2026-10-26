import Links from '../model/LinkSchema';

// 'broken' only for answers that clearly mean the page is gone; shops like Amazon
// often block automated visits (403, 503), which says nothing about the link
async function checkUrl(url) {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SareishLinkCheck/1.0; +https://sareish.com)' },
    });
    res.body?.cancel();
    if (res.ok) return { status: 'ok', code: res.status };
    if ([404, 410].includes(res.status)) return { status: 'broken', code: res.status };
    return { status: 'unknown', code: res.status };
  } catch (err) {
    // a domain that doesn't exist is broken; a slow site is not
    const broken = err?.cause?.code === 'ENOTFOUND';
    return { status: broken ? 'broken' : 'unknown', code: 0 };
  }
}

// checks every link and saves the result on it
export default async function checkLinks() {
  const links = await Links.find({}, { url: 1 });
  const at = new Date();
  const results = await Promise.all(links.map(async link => ({ _id: link._id, ...(await checkUrl(link.url)) })));
  if (results.length) {
    await Links.bulkWrite(results.map(({ _id, status, code }) => ({
      updateOne: { filter: { _id }, update: { check: { status, code, at } } },
    })));
  }
  return results;
}
