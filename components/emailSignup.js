import { useState } from 'react';

// homepage form to join the email list
export default function EmailSignup() {
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [state, setState] = useState('idle'); // idle, sending, done, error
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setState('sending');
        const res = await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, website }),
        }).catch(() => null);
        if (res?.ok) {
            setState('done');
            return;
        }
        const data = await res?.json().catch(() => ({}));
        setError(data?.error || 'Something went wrong, please try again');
        setState('error');
    }

    return (
        <section className='mt-12 p-5 rounded-2xl bg-zinc-50 border border-zinc-100' aria-labelledby='signup-title'>
            <h2 id='signup-title' className='text-rose-950 font-bold'>Get new finds by email</h2>
            {state === 'done'
                ? <p className='mt-2 text-sm text-zinc-600' role='status'>Thanks! You&apos;re on the list.</p>
                : <form onSubmit={handleSubmit} className='mt-3 flex flex-col sm:flex-row gap-2'>
                    <label htmlFor='signup-email' className='sr-only'>Email</label>
                    <input id='signup-email' type='email' required placeholder='you@example.com' autoComplete='email'
                        value={email} onChange={e => setEmail(e.target.value)}
                        className='flex-1 min-w-0 px-4 py-2 rounded-full border border-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400' />
                    {/* hidden from people, catches bots */}
                    <input type='text' name='website' tabIndex={-1} autoComplete='off' aria-hidden='true'
                        value={website} onChange={e => setWebsite(e.target.value)} className='hidden' />
                    <button type='submit' disabled={state === 'sending'}
                        className='px-5 py-2 rounded-full bg-rose-700 hover:bg-rose-800 text-white disabled:opacity-50'>
                        {state === 'sending' ? 'Joining…' : 'Join'}
                    </button>
                </form>}
            {state === 'error' && <p className='mt-2 text-sm text-rose-700' role='alert'>{error}</p>}
        </section>
    );
}
