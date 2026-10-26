import { useState } from 'react';

const ranges = [
  { key: 'd7', label: '7 days' },
  { key: 'd30', label: '30 days' },
];

const names = {
  instagram: 'Instagram', tiktok: 'TikTok', pinterest: 'Pinterest', facebook: 'Facebook',
  google: 'Google', other: 'Other sites', direct: 'Direct or unknown',
};

// horizontal bar list of clicks per traffic source for the chosen range
export default function SourceStats({ sources }) {
  const [range, setRange] = useState('d7');

  const rows = sources
    .map(s => ({ source: s.source, name: names[s.source] || s.source, count: s[range] || 0 }))
    .filter(r => r.count > 0)
    .sort((a, b) => b.count - a.count);

  const max = Math.max(1, ...rows.map(r => r.count));
  const total = rows.reduce((sum, r) => sum + r.count, 0);
  const rangeLabel = ranges.find(r => r.key === range).label;

  return (
    <section className='w-full text-left my-10' aria-labelledby='source-stats-title'>
      <div className='flex items-baseline justify-between flex-wrap gap-2 mb-3'>
        <h2 id='source-stats-title' className='text-lg font-bold text-zinc-800'>Where clicks come from</h2>
        <div className='flex gap-1' role='group' aria-label='Time range for sources'>
          {ranges.map(r => (
            <button key={r.key} type='button' onClick={() => setRange(r.key)} aria-pressed={range === r.key}
              className={`px-3 py-1 rounded-full text-sm ${range === r.key ? 'bg-rose-100 text-rose-950' : 'text-zinc-500 hover:bg-zinc-100'}`}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {total === 0
        ? <p className='text-sm text-zinc-500'>No sources recorded in the last {rangeLabel} yet. Sources are counted from when this went live.</p>
        : <table className='w-full text-sm'>
            <caption className='sr-only'>Clicks per source, last {rangeLabel}</caption>
            <thead className='sr-only'>
              <tr><th scope='col'>Source</th><th scope='col'>Clicks</th><th scope='col'>Share</th></tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.source} title={`${row.name}: ${row.count} clicks`}>
                  <th scope='row' className='font-normal text-zinc-700 py-1 pr-3 w-2/5 truncate max-w-0'>{row.name}</th>
                  <td className='py-1'>
                    <div className='flex items-center gap-2'>
                      <div className='flex-1 h-3'>
                        <div className='h-3 rounded-r bg-rose-400' style={{ width: `${(row.count / max) * 100}%`, minWidth: '4px' }} />
                      </div>
                      <span className='w-10 text-right tabular-nums text-zinc-700'>{row.count}</span>
                    </div>
                  </td>
                  <td className='w-12 text-right tabular-nums text-zinc-500'>{Math.round((row.count / total) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>}
      <p className='text-xs text-zinc-500 mt-3'>Tip: add <code>?utm_source=instagram</code> (or tiktok, pinterest) to the link in each bio for the most accurate split.</p>
    </section>
  );
}
