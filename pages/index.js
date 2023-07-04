import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { getSession, useSession, signOut } from "next-auth/react"
import connectMongo from '../database/conn';
import Links from '../model/LinkSchema';
import Layout from '../layouts/pagelayout';
// a change

export default function Home( {links}) {

  const { data: session } = useSession()

  function handleSignOut(){
    signOut()
  }

  return (
    <Layout>
      <Head>
        <title>Home Page</title>
      </Head>
      {session ? User({ session, handleSignOut }) : Guest( {links} )}
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
      <section className="container mx-auto text-center py-20 w-4/5 sm:w-1/2">
        <div className='flex flex-col justify-center '>  
          {links.map(link =>(
            <Link href={link.url} key={link.index}>
              <div className='w-full bg-rose-50 hover:bg-rose-100 py-3 my-3 rounded-full 
                cursor-pointer border-2 border-rose-100 hover:border-rose-200 hover:border-dashed text-rose-950'> 
                <p>{link.title}, {link._id}</p>
              </div>
            </Link>
          ))}
        </div>      
      </section>

  )
  
}

// Authorize User
function User({ session, handleSignOut }){
  return(
    <main className="container mx-auto text-center py-20">
          <h3 className='text-4xl font-bold'>Authorized User Homepage</h3>

          <div className='details'>
            <h5>{session.user.name}</h5>
            <h5>{session.user.email}</h5>
          </div>

          <div className="flex justify-center">
            <button onClick={handleSignOut} className='mt-5 px-10 py-1 rounded-sm bg-indigo-500'>Sign Out</button>
          </div>

          <div className='flex justify-center'>
            <Link href={'/profile'}><a className='mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50'>Profile Page</a></Link>
          </div>
      </main>
  )
}


/* 
// this function is used to protect pages when there's not an authorized user logged in

export async function getServerSideProps({ req }){
  const session = await getSession({ req })

  if(!session){
    return {
      redirect : {
        destination: '/login',
        permanent: false
      }
    }
  }

  return {
    props: { session }
  }
} */

export const getServerSideProps = async () =>{

  try{
    console.log("Connecting to Mongo");
    await connectMongo();
    console.log("Connected to Mongo");
  
    console.log("Fetching documents");
    const links = await Links.find(); // {active:true} to bring only active links
    console.log("Documents fetched")

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