import Head from 'next/head'
import { useSession } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]"
import connectMongo from '../database/conn';
import Links from '../model/LinkSchema';
import Clicks from '../model/ClickSchema';
import ClickStats from '../components/clickStats';
import SourceStats from '../components/sourceStats';
import Layout from '../layouts/pagelayout';

export default function ClicksPage({links, stats, sources}){

  const { data: session } = useSession()

  return (
    <Layout>
      <Head>
          <title>Clicks</title>
          <meta name="robots" content="noindex, nofollow" />
      </Head>
      {session
        ? <section className="container mx-auto py-10 w-4/5 sm:w-1/2">
            <ClickStats links={links} stats={stats} />
            <SourceStats sources={sources} />
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
      const links = await Links.find();

      // clicks per link over the last 7 and 30 days
      const now = Date.now();
      const since7 = new Date(now - 7 * 24 * 60 * 60 * 1000);
      const since30 = new Date(now - 30 * 24 * 60 * 60 * 1000);
      const counts = await Clicks.aggregate([
          { $match: { at: { $gte: since30 } } },
          { $group: {
              _id: '$link',
              d30: { $sum: 1 },
              d7: { $sum: { $cond: [{ $gte: ['$at', since7] }, 1, 0] } },
          } },
      ]);
      const stats = Object.fromEntries(counts.map(c => [String(c._id), { d7: c.d7, d30: c.d30 }]));

      // the same counts per source; clicks from before sources were recorded have none
      const bySource = await Clicks.aggregate([
          { $match: { at: { $gte: since30 }, source: { $exists: true } } },
          { $group: {
              _id: '$source',
              d30: { $sum: 1 },
              d7: { $sum: { $cond: [{ $gte: ['$at', since7] }, 1, 0] } },
          } },
      ]);
      const sources = bySource.map(s => ({ source: s._id, d7: s.d7, d30: s.d30 }));

      return {
          props: {
              links: JSON.parse(JSON.stringify(links)),
              stats,
              sources,
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
