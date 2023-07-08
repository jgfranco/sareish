import Head from 'next/head'
import styles from '../styles/Form.module.css'
import Link from 'next/link'
import { getSession, useSession, signOut } from "next-auth/react"
import connectMongo from '../database/conn';
import Links from '../model/LinkSchema';
import Layout from '../layouts/pagelayout';
import { HiOutlinePencilAlt, HiOutlinePlusSm, HiOutlineXCircle, HiOutlineCloudUpload}  from 'react-icons/hi'
import { useState } from 'react';
import { set } from 'mongoose';

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
      {session ? User({ session, handleSignOut, links}) : Guest()}
    </Layout>
  )
}

function User({ session, handleSignOut, links }){

  const [showAddLink, setShowAddLink] = useState(false);
  const [showEditLink, setShowEditLink] = useState(false);
  const [currentLink, setCurrentLink] = useState(null)
  
  // sort links descending
  links = links.sort(function(a, b) {
      return b.index - a.index;
  });

  // edit link handlers
  function handleEditLink(e, link){
    e.preventDefault();
    setCurrentLink(link)
    setShowEditLink(true);
  }
  function handleCancel(e){
    e.preventDefault();
    if (showEditLink) setShowEditLink(false);
    if (showAddLink) setShowAddLink(false)
    
  }

  // add link handlers
  function handleAddLink(e){
    e.preventDefault();
    setCurrentLink({...currentLink, active: 'true', url:'', title:'', index: links.length})
    setShowAddLink(true)
  }
  
  function handleFormSubmit(e){
    e.preventDefault()
    console.log("form submitted")
  }

  
  return (
      <section className="container mx-auto text-center py-20 w-4/5 sm:w-1/2">
          <div className='flex flex-col'>
              {showAddLink || showEditLink
                  ?
                  <form onSubmit={(e)=>handleFormSubmit(e)}>
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
                          value={currentLink.title}
                          className={styles.input_text}
                          onChange={(e)=>setCurrentLink({...currentLink, title : e.target.value})}
                          /* {...formik.getFieldProps('email')} */
                        />
                      </div>
                      <div className='col-span-4'>
                        <input 
                          type="text"
                          name='url'
                          placeholder='url'
                          value={currentLink.url}
                          className={styles.input_text}
                          onChange={(e)=>setCurrentLink({...currentLink, url : e.target.value})}
                          /* {...formik.getFieldProps('email')} */
                        />
                      </div>
                      {showEditLink 
                        ?
                        <div className='col-span-4'>
                          <input 
                            type="text"
                            name='index'
                            placeholder='index'
                            value={currentLink.index}
                            className={styles.input_text}
                            onChange={(e)=>setCurrentLink({...currentLink, index : e.target.value})}
                            /* {...formik.getFieldProps('email')} */
                          />
                        </div>
                        :
                        <></>
                      }
                      <div><span>active:</span></div>
                      <div className='col-span-3'>
                        <input 
                          type="checkbox"
                          name='active'
                          placeholder='active'
                          className={styles.input_text}
                          checked={currentLink.active === 'true'}
                          onChange={(e)=>{setCurrentLink({...currentLink, active: String(e.target.checked)})}}
                          /* {...formik.getFieldProps('email')} */
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
                      <HiOutlinePlusSm  size={25}/>
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
        console.log(error);
        return {
            notFound: true
        }
    }
}