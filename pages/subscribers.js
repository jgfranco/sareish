import Head from 'next/head'
import { useSession } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]"
import connectMongo from '../database/conn';
import Subscribers from '../model/SubscriberSchema';
import Layout from '../layouts/pagelayout';

export default function SubscribersPage({total, recent}){

  const { data: session } = useSession()

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
