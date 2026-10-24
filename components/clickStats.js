import { useState } from 'react';

const ranges = [
  { key: 'd7', label: '7 days' },
  { key: 'd30', label: '30 days' },
  { key: 'all', label: 'All time' },
];

// horizontal bar list of clicks per link for the chosen range
export default function ClickStats({ links, stats }) {
  const [range, setRange] = useState('d7');

  const rows = links
    .map(link => ({
      id: link._id,
      title: link.title,
      active: String(link.active) === 'true',
      count: range === 'all' ? (link.clicks || 0) : (stats[link._id]?.[range] || 0),
    }))
    .sort((a, b) => b.count - a.count);

  const max = Math.max(1, ...rows.map(r => r.count));
  const total = rows.reduce((sum, r) => sum + r.count, 0);
  const rangeLabel = ranges.find(r => r.key === range).label.toLowerCase();

  return (
    <section className='w-full text-left my-6' aria-labelledby='click-stats-title'>
      <div className='flex items-baseline justify-between flex-wrap gap-2 mb-3'>
        <h2 id='click-stats-title' className='text-lg font-bold text-zinc-800'>Clicks</h2>
        <div className='flex gap-1' role='group' aria-label='Time range'>
          {ranges.map(r => (
            <button key={r.key} type='button' onClick={() => setRange(r.key)} aria-pressed={range === r.key}
              className={`px-3 py-1 rounded-full text-sm ${range === r.key ? 'bg-rose-100 text-rose-950' : 'text-zinc-500 hover:bg-zinc-100'}`}>
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <p className='text-3xl font-bold text-zinc-800'>{total.toLocaleString()}</p>
      <p className='text-sm text-zinc-500 mb-4'>total clicks, {range === 'all' ? 'since tracking started' : `last ${rangeLabel}`}</p>

      <table className='w-full text-sm'>
        <caption className='sr-only'>Clicks per link, {rangeLabel}</caption>
        <thead className='sr-only'>
          <tr><th scope='col'>Link</th><th scope='col'>Clicks</th></tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id} title={`${row.title}: ${row.count} clicks`}>
              <th scope='row' className='font-normal text-zinc-700 py-1 pr-3 w-2/5 truncate max-w-0'>
                {row.title}{!row.active && <span className='text-zinc-400'> (hidden)</span>}
              </th>
              <td className='py-1'>
                <div className='flex items-center gap-2'>
                  <div className='flex-1 h-3'>
                    <div className='h-3 rounded-r bg-rose-400' style={{ width: `${(row.count / max) * 100}%`, minWidth: row.count ? '4px' : 0 }} />
                  </div>
                  <span className='w-10 text-right tabular-nums text-zinc-700'>{row.count}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {range !== 'all' && total === 0 && (
        <p className='text-sm text-zinc-500 mt-2'>No clicks recorded in this period yet. Dated clicks are counted from when this dashboard went live.</p>
      )}
    </section>
  );
}
