import Head from 'next/head'
import styles from '../styles/Form.module.css'
import { getSession, useSession, signOut } from "next-auth/react"
import connectMongo from '../database/conn';
import Links from '../model/LinkSchema';
import Layout from '../layouts/pagelayout';
import { HiOutlinePencilAlt, HiOutlinePlusCircle, HiOutlineXCircle, HiOutlineCloudUpload}  from 'react-icons/hi'
import { useState } from 'react';
import { useFormik } from 'formik';
import { linkValidate } from '../lib/validate';
import { useRouter } from 'next/router';

export default function LinksEditor({links}){
    
  const { data: session } = useSession()

  function handleSignOut(){
    signOut()
  }

  return (
    <Layout>
      <Head>
          <title>Links Editor</title>
      </Head>
      {session ? User({ session, handleSignOut, links}) : <p>Restricted Access</p>}
    </Layout>
  )
}

function User({ session, handleSignOut, links }){

  const [showAddLink, setShowAddLink] = useState(false);
  const [showEditLink, setShowEditLink] = useState(false);
  //const [currentLink, setCurrentLink] = useState(null)
  const router = useRouter();
  
  // formik Hook
  const formik = useFormik({
    initialValues: {
        title : '',
        url: '',
        active: true,
        index: links.length
    },
    validate: linkValidate,
    onSubmit
  })   

  // sort links descending
  links = links.sort(function(a, b) {
      return b.index - a.index;
  });

  // edit link handlers
  function handleEditLink(e, link){
    e.preventDefault();
    //setCurrentLink(link)
    formik.values._id = link._id
    formik.values.title = link.title;
    formik.values.url = link.url;
    link.active === 'true' ? formik.values.active = true : formik.values.active = false;
    formik.values.index = link.index;
    setShowEditLink(true);
    
  }
  function handleCancel(e){
    e.preventDefault();
    if (showEditLink) setShowEditLink(false);
    if (showAddLink) setShowAddLink(false);
  }

  // add link handlers
  function handleAddLink(e){
    e.preventDefault();
    //setCurrentLink({...currentLink, active: 'true', url:'', title:'', index: links.length})
    formik.values.title = '';
    formik.values.url = '';
    formik.values.active = true;
    formik.values.index = links.length;
    setShowAddLink(true);
  }
  
  async function onSubmit(values){
    console.log("form submitted with these values", values)

    // add a new link
    if (showAddLink){
      console.log("adding  new link to database");

      // add to database
      const options = {
        method: "POST",
        headers : { 'Content-Type': 'application/json'},
        body: JSON.stringify(values)
      }
      await fetch('http://localhost:3000/api/auth/links', options)
        .then(res => res.json())
        .then((data) => {
            if(data) router.push('/linksEditor')
      })
      
      // hide module after a succesfull addition
      setShowAddLink(false);
      
    }


    // edit a link
    if (showEditLink){
      console.log("updating link in database");

      // update link in database
      const options = {
        method: "PATCH",
        headers : { 'Content-Type': 'application/json'},
        body: JSON.stringify(values)
      }
      await fetch('http://localhost:3000/api/auth/links', options)
        .then(res => res.json())
        .then((data) => {
            if(data) router.push('/linksEditor')
      })
      // hide module after a succesfull update
      setShowEditLink(false);
    }
  }

  
  return (
      <section className="container mx-auto text-center py-20 w-4/5 sm:w-1/2">
          <div className='flex flex-col'>
              {showAddLink || showEditLink
                  ?
                  <form onSubmit={formik.handleSubmit}>
                    <div className='grid grid-cols-4 gap-4'>
                      <div className='col-span-4'>
                        <div className='flex flex-col w-fu  ll'>
                          <div className='flex self-center justify-center items-center w-10 h-10 cursor-pointer rounded-full' onClick={(e) => handleCancel(e)}>
                            <HiOutlineXCircle size={25}/></div>
                        </div>
                      </div>
                      <div className='col-span-4'>
                        <input 
                          type="text"
                          name='title'
                          placeholder='title'
                          className={styles.input_text}
                          {...formik.getFieldProps('title')} 
                        />
                      {formik.errors.title && formik.touched.title ? <span className='text-rose-500'>{formik.errors.title}</span> : <></>} 
                      </div>
                      <div className='col-span-4'>
                        <input 
                          type="text"
                          name='url'
                          placeholder='url'
                          className={styles.input_text}
                          {...formik.getFieldProps('url')}
                        />
                      {formik.errors.url && formik.touched.url ? <span className='text-rose-500'>{formik.errors.url}</span> : <></>} 
                      </div>
                        <div className='col-span-4'>
                          <input 
                            type="text"
                            name='index'
                            placeholder='index'
                            className={styles.input_text}
                            readOnly={showAddLink}
                            {...formik.getFieldProps('index')} 
                          />
                        </div>  
                      <div><label for="active">active:</label></div>
                      <div className='col-span-3'>
                        <input 
                          type="checkbox"
                          name='active'
                          checked={formik.values.active}
                          {...formik.getFieldProps('active')}
                        />
                      </div>
                      <div className='col-span-4'>
                        <div className='flex flex-col w-full'>
                          <button type= 'submit' className='flex self-center justify-center items-center w-10 h-10 cursor-pointer rounded-full'>
                            <HiOutlineCloudUpload size={25}/></button>
                        </div>
                      </div>
                    </div>
                  </form>
                  :
                  <div className='flex flex-col w-full'>
                    <div className='flex self-center justify-center items-center w-10 h-10 cursor-pointer rounded-full' onClick={(e)=> handleAddLink(e)}>
                      <HiOutlinePlusCircle  size={25}/>
                    </div>
                  </div>
              }
              {links.map(link =>(
                  <div key = {link._id} className='flex flex-row justify-between w-full bg-zinc-50 hover:bg-zinc-100 py-3 m-3 rounded-full 
                      cursor-pointer border-2 border-zinc-100 hover:border-zinc-200 hover:border-dashed text-rose-950'> 
                      <p className="px-4">title: {link.title} | url:{link.url} | active:{link.active} | index: {link.index}</p> 
                      <span className='icon flex items-center px-4' onClick={(e) => handleEditLink(e, link)}><HiOutlinePencilAlt size={25} /></span>
                  </div>
              ))}    
          </div>  
          <main className="container mx-auto text-center py-20">
              <h4 className='text-4xl font-bold'>Authorized User</h4>
  
              <div className='details'>
                  <h5>{session.user.name}</h5>
                  <h5>{session.user.email}</h5>
              </div>
  
              <div className="flex justify-center">
                  <button onClick={handleSignOut} className='mt-5 px-10 py-1 rounded-sm bg-indigo-500'>Sign Out</button>
              </div>
          </main>    
      </section>
  )
    
}


export const getServerSideProps = async ({req}) =>{

  try{
      //console.log("Connecting to Mongo");
      await connectMongo();
      //console.log("Connected to Mongo");
      
      //console.log("Fetching documents");
      const links = await Links.find(); // {active:true} to bring only active links
      //console.log("Documents fetched")

      const session = await getSession({ req })

      if(!session){
          return {
              redirect : {
                  destination : "/login",
                  premanent: false
              }
          }
      }

      return {
          props: {
              links: JSON.parse(JSON.stringify(links)),
              session: session
          },
      };
  }
  catch (error) {
      console.log("this error:",error);
      return {
          notFound: true
      }
  }
}