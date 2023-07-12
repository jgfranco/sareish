import Head from 'next/head'
//import styles from '../styles/Home.module.css'
import Link from 'next/link'
//import { getSession, useSession, signOut } from "next-auth/react"
import connectMongo from '../database/conn';
import Links from '../model/LinkSchema';
import Layout from '../layouts/pagelayout';
import Image from 'next/image';
import { linkValidate } from '../lib/validate';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';

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
  const router = useRouter();
  // sort links by index
  links = links.sort(function(a, b) {
    return b.index - a.index;
  });

  const formik = useFormik({
    initialValues: {
        title : '',
        url: '',
        active: '',
        index: ''
    },
    validate: linkValidate,
    onSubmit
  })   

  function onLinkClick(e, link){
    const newWindow = window.open(link.url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null
    e.preventDefault();
    //setCurrentLink(link)
    formik.values._id = link._id
    formik.values.title = link.title;
    formik.values.url = link.url;
    link.active === 'true' ? formik.values.active = true : formik.values.active = false;
    formik.values.index = link.index;
    onSubmit(formik.values);

  }

  async function onSubmit(values){
    const options = {
      method: "PATCH",
      headers : { 'Content-Type': 'application/json'},
      body: JSON.stringify(values)
    }
    await fetch('/api/auth/clicks', options)
      .then(res => res.json())
      /* .then((data) => {
        if (data) router.push("/")
    }) */
  }

  return (
      <section className="container mx-auto text-center py-10 w-4/5 sm:w-1/2 h-fit">
        <div className="mb-8"> 
          <Image className='rounded-full' src='/assets/profileSareish.jpeg' width={120} height={120}></Image>
        </div>
        {/* <h1>under construction</h1> */}
        <div className='flex flex-col justify-center '>  
          {links.map(link =>(
        
            
            <div className='w-full bg-rose-50 hover:bg-rose-100 py-3 my-3 rounded-full 
              cursor-pointer border-2 border-rose-100 hover:border-rose-200 hover:border-dashed text-rose-950'
              onClick={(e) =>onLinkClick(e, link)}
              key={link.index}> 
              <p>{link.title}</p>
            </div>
            
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