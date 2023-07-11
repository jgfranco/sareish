import Head from 'next/head'
//import styles from '../styles/Home.module.css'
import Link from 'next/link'
//import { getSession, useSession, signOut } from "next-auth/react"
import connectMongo from '../database/conn';
import Links from '../model/LinkSchema';
import Layout from '../layouts/pagelayout';
import Image from 'next/image';

export default function Home( {links}) {

  return (
    <Layout>
      <Head>
        <title>Home Page</title>
      </Head>
      {Guest( {links})}
    </Layout>
  )
}

// Guest 
function Guest({links}){

  // sort links by index
  links = links.sort(function(a, b) {
    return b.index - a.index;
  });

  return (
      <section className="container mx-auto text-center py-10 w-4/5 sm:w-1/2">
        <div className="mb-8"> 
          <Image className='rounded-full' src='/assets/profileSareish.jpeg' width={120} height={120}></Image>
        </div>
        <div className='flex flex-col justify-center '>  
          {links.map(link =>(
            <Link href={link.url} key={link.index}>
              <div className='w-full bg-rose-50 hover:bg-rose-100 py-3 my-3 rounded-full 
                cursor-pointer border-2 border-rose-100 hover:border-rose-200 hover:border-dashed text-rose-950'> 
                <p>{link.title}</p>
              </div>
            </Link>
          ))}
        </div>      
      </section>

  )
  
}


export const getServerSideProps = async () =>{

  try{
    //console.log("Connecting to Mongo");
    await connectMongo();
    //console.log("Connected to Mongo");
  
    //console.log("Fetching documents");
    const links = await Links.find({active: true}); // bring only active links
    //console.log("Documents fetched")

    return {
      props: {
        links: JSON.parse(JSON.stringify(links)),
      },
    };


  }
  catch (error) {
    console.log(error);
    return {
      notFound: true
    }
  }
}