import Head from 'next/head'
import connectMongo from '../database/conn';
import Links from '../model/LinkSchema';
import Layout from '../layouts/pagelayout';
import Image from 'next/image';
import { linkValidate } from '../lib/validate';
import { useFormik } from 'formik';
import {useState} from 'react';
import LinksView from '../components/linksView';
import PhotoView from '../components/photoView';
import { HiOutlineViewList, HiOutlineViewGrid } from "react-icons/hi";

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

  // sort links by index
  links = links.sort(function(a, b) {
    return b.index - a.index;
  });

  /*
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
  }

  */

  return (
      <section className="container mx-auto text-center py-10 w-full sm:w-1/2 h-fit">
        <div className="mb-8"> 
          <Image className='rounded-full' src='/assets/profileSareish.jpeg' alt='profile picture' width={120} height={120}></Image>
        </div>
        <div className="flex justify-end">
          <div className='w-10 h-10 cursor-pointer rounded-full' onClick={() => setView("list")}>
            <HiOutlineViewList size={25}/>
          </div>
          <div className='w-10 h-10 cursor-pointer rounded-full' onClick={() => setView("photos")}>
            <HiOutlineViewGrid size={25}/>
          </div>
        </div>
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