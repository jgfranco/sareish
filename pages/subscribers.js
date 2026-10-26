import Head from 'next/head'
import { useSession } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]"
import connectMongo from '../database/conn';
import Subscribers from '../model/SubscriberSchema';
import Layout from '../layouts/pagelayout';
import { kitEnabled } from '../lib/kit';
import { useState } from 'react';

export default function SubscribersPage({total, recent, kitConnected}){

  const { data: session } = useSession()
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  async function handleSync(){
    setSyncing(true);
    setSyncMessage('');
    const res = await fetch('/api/subscribers', { method: 'POST' }).catch(() => null);
    const data = await res?.json().catch(() => ({}));
    setSyncing(false);
    setSyncMessage(res?.ok ? `Copied ${data.added} of ${data.total} to Kit` : (data?.error || 'Copying to Kit failed, please try again'));
  }

  return (
    <Layout>
      <Head>
          <title>Subscribers</title>
          <meta name="robots" content="noindex, nofollow" />
      </Head>
      {session
        ? <section className="container mx-auto py-10 w-4/5 sm:w-1/2 text-left">
            <div className='flex items-baseline justify-between flex-wrap gap-2 mb-3'>
              <h1 className='text-lg font-bold text-zinc-800'>Email subscribers</h1>
              <a href='/api/subscribers' download className='text-sm px-3 py-1 rounded-full border border-zinc-200 hover:bg-zinc-50'>Download CSV</a>
            </div>
            <p className='text-3xl font-bold text-zinc-900'>{total}</p>
            <p className='text-sm text-zinc-500 mb-6'>people have signed up</p>
            {/* only shown once a KIT_API_KEY is set in Vercel */}
            {kitConnected && (
              <div className='mb-6 p-3 rounded-lg bg-zinc-50 text-sm text-zinc-600'>
                <p>Connected to Kit. New signups are added there automatically, so you can email them from Kit.</p>
                <button type='button' onClick={handleSync} disabled={syncing}
                  className='mt-2 px-3 py-1 rounded-full border border-zinc-200 bg-white hover:bg-zinc-100 disabled:opacity-50'>
                  {syncing ? 'Copying…' : 'Copy everyone to Kit'}
                </button>
                {syncMessage && <p className='mt-2' role='status'>{syncMessage}</p>}
              </div>
            )}
            {recent.length > 0 && (
              <>
                <h2 className='text-sm font-bold text-zinc-600 mb-2'>Latest signups</h2>
                <ul className='divide-y divide-zinc-100 text-sm'>
                  {recent.map(s => (
                    <li key={s.email} className='flex justify-between gap-4 py-2'>
                      <span className='truncate'>{s.email}</span>
                      <span className='text-zinc-500 shrink-0'>{new Date(s.at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        : <p>Restricted Access</p>}
    </Layout>
  )
}

export const getServerSideProps = async ({req, res}) =>{

  try{
      const session = await getServerSession(req, res, authOptions)

      if(!session){
          return {
              redirect : {
                  destination : "/login",
                  permanent: false
              }
          }
      }

      await connectMongo();
      const [total, recent] = await Promise.all([
          Subscribers.countDocuments(),
          Subscribers.find().sort({ at: -1 }).limit(20),
      ]);

      return {
          props: {
              total,
              kitConnected: kitEnabled(),
              recent: recent.map(s => ({ email: s.email, at: s.at.toISOString() })),
              session: session
          },
      };
  }
  catch (error) {
      console.error(error);
      return {
          notFound: true
      }
  }
}
