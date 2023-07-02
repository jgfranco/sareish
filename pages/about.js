import Layout from '../layouts/pagelayout'
import Head from 'next/head'
export default function About() {

    //const { data: session } = useSession()
  
    /* function handleSignOut(){
      signOut()
    } */
  
    return (
      <Layout>
        <Head>
          <title>About Page</title>
        </Head>
        {/* {session ? User({ session, handleSignOut }) : Guest( {links} )} */}
        <div>
            <h1 className='text-gray-800 text-4xl font-bold py-4'>About Me</h1>
            <p className='w-3/4 mx-auto text-gray-400'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, officia</p>
        </div>
      </Layout>
    )
  }