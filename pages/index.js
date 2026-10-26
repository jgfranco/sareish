import connectMongo from '../database/conn';
import Links from '../model/LinkSchema';
import Layout from '../layouts/pagelayout';
import Image from 'next/image';
import {useState} from 'react';
import LinksView from '../components/linksView';
import PhotoView from '../components/photoView';
import { HiOutlineViewList, HiOutlineViewGrid } from "react-icons/hi";
import Seo from '../components/Seo';
import EmailSignup from '../components/emailSignup';

// shown when the links can't be loaded from the database
const fallbackLinks = [
  { _id: 'instagram', title: 'Instagram', url: 'https://www.instagram.com/sareish' },
  { _id: 'tiktok', title: 'TikTok', url: 'https://www.tiktok.com/@sareishh' },
  { _id: 'amazon', title: 'My Amazon storefront', url: 'https://www.amazon.com/shop/sareish' },
];

export default function Home( {links}) {
  return (
    <Layout>
      <Seo
        title="Home"
        description="Sareish shares home decor ideas, styling tips, and favorite finds for creating beautiful, romantic spaces. Shop her Amazon storefront and follow along on Instagram and TikTok."
        canonical="https://sareish.com/"
        image="https://sareish.com/assets/share.jpg"
      />
      <Guest links={links} />
    </Layout>
  )
}

// Guest
function Guest({links}){
  const [view, setView] = useState("list");

  // sort links by index, highest first
  const sortedLinks = [...links].sort((a, b) => b.index - a.index);
  const hasPhotos = sortedLinks.some(link => link.photoUrl);

  const toggleClass = (active) =>
    `flex items-center justify-center w-10 h-10 rounded-full ${active ? 'text-rose-950 bg-rose-50' : 'text-zinc-400 hover:text-zinc-600'}`;

  return (
      <section className="container mx-auto text-center py-10 w-4/5 sm:w-1/2 h-fit">
        <div className="flex justify-center mb-8">
          <Image className='rounded-full' src='/assets/profileSareish.jpeg' alt='Sareish' width={120} height={120} priority></Image>
        </div>
        {hasPhotos && (
          <div className="flex justify-end gap-1">
            <button type="button" className={toggleClass(view === "list")} onClick={() => setView("list")}
              aria-label="List view" aria-pressed={view === "list"}>
              <HiOutlineViewList size={25}/>
            </button>
            <button type="button" className={toggleClass(view === "photos")} onClick={() => setView("photos")}
              aria-label="Photo view" aria-pressed={view === "photos"}>
              <HiOutlineViewGrid size={25}/>
            </button>
          </div>
        )}
        {view === "photos" && hasPhotos ? <PhotoView links={sortedLinks} /> : <LinksView links={sortedLinks} />}
        <EmailSignup />
      </section>
  )
}

// static page, rebuilt at most once a minute and right after links are saved in the editor
export const getStaticProps = async () =>{
  try{
    await connectMongo();
    // only active links that are inside their schedule, if they have one
    const now = new Date();
    const links = await Links.find({
      active: true,
      $and: [
        { $or: [{ startAt: null }, { startAt: { $lte: now } }] },
        { $or: [{ endAt: null }, { endAt: { $gt: now } }] },
      ],
    });

    return {
      props: {
        links: JSON.parse(JSON.stringify(links)),
      },
      revalidate: 60,
    };
  }
  catch (error) {
    console.log(error);
    return {
      props: {
        links: fallbackLinks,
      },
      revalidate: 10,
    };
  }
}
