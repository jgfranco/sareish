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
//import { useRouter } from 'next/router';
import PolaroidPhoto from '../components/polaroidPhoto';
import {useState} from 'react';
import LinksView from '../components/linksView';
import PhotoView from '../components/photoView';

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

  const [view, setView] = useState("list");
  //const router = useRouter();
  
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
          <Image className='rounded-full' src='/assets/profileSareish.jpeg' alt='profile picture' width={120} height={120}></Image>
        </div>
        {/* <h1>under construction</h1> */}
        <button
          onClick={() => setView("list")}
          className={`px-4 py-2 rounded font-medium transition ${
            view === "list" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setView("photos")}
          className={`px-4 py-2 rounded font-medium transition ${
            view === "photos" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Photo View
        </button>

        {view === "list" ? <LinksView links={links} /> : <PhotoView links={links} />}
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