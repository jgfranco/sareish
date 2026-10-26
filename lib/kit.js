// Kit (kit.com) holds the email list for sending; set KIT_API_KEY to turn this on
export const kitEnabled = () => Boolean(process.env.KIT_API_KEY);

// adds or updates one subscriber in Kit; returns true when Kit accepted it
export async function addToKit(email) {
  if (!kitEnabled()) return false;
  try {
    const res = await fetch('https://api.kit.com/v4/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Kit-Api-Key': process.env.KIT_API_KEY },
      body: JSON.stringify({ email_address: email }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("Kit error:", res.status, await res.text().catch(() => ''));
    return res.ok;
  } catch (err) {
    console.error("Kit error:", err);
    return false;
  }
}
