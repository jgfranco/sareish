import Head from 'next/head'
import styles from '../styles/Form.module.css'
import Link from 'next/link'
import { getSession, useSession, signOut } from "next-auth/react"
import connectMongo from '../database/conn';
import Links from '../model/LinkSchema';
import Layout from '../layouts/pagelayout';
import { HiOutlinePencil, HiOutlinePlusSm }  from 'react-icons/hi'
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

  function handleEditLink(e, link){
    e.preventDefault();
    //console.log("I've been clicked", link._id);
    setCurrentLink(link)
    setShowEditLink(true);
  }
  function handleCancelEditLink(e){
    e.preventDefault();
    setShowEditLink(false);
  }


  // add link handlers
  function handleAddLink(e){
    e.preventDefault();
    setShowAddLink(true)
  }

  function handleCancelAddLink(e){
    e.preventDefault();
    setShowAddLink(false)
  }   

  if(showEditLink){
    return(
      <section className="container mx-auto text-center py-20 w-4/5 sm:w-1/2">
        <div className='flex flex-col items-center'>
          <form>
            <input 
              type="text"
              name='title'
              placeholder='title'
              value={currentLink.title}
              className={styles.input_text}
              onChange={(e)=>setCurrentLink({...currentLink, title : e.target.value})}
              /* {...formik.getFieldProps('email')} */
            />
            <input 
              type="text"
              name='url'
              placeholder='url'
              value={currentLink.url}
              className={styles.input_text}
              onChange={(e)=>setCurrentLink({...currentLink, url : e.target.value})}
              /* {...formik.getFieldProps('email')} */
              />
            <input 
              type="checkbox"
              name='active'
              placeholder='active'
              className={styles.input_text}
              checked={currentLink.active === 'true'}
              onChange={(e)=>{setCurrentLink({...currentLink, active: e.target.value})}}
              /* {...formik.getFieldProps('email')} */
            />
            <div className="input-button">
              <button type='submit' className="w-1/3 bg-gradient-to-r from-rose-500 to-fuchsia-500 rounded-md py-3 text-gray-50 text-lg">
                Save
              </button>
              <button 
                className="w-1/3 bg-zinc-100 rounded-md py-3 text-gray-800 text-lg"
                onClick={(e) => handleCancelEditLink(e)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </section>
    )
  }
  else{
      return (
          <section className="container mx-auto text-center py-20 w-4/5 sm:w-1/2">
              <div className='flex flex-col items-center'>
                  {showAddLink 
                      ?
                      <form>
                          <input 
                              type="text"
                              name='title'
                              placeholder='title'
                              className={styles.input_text}
                              /* {...formik.getFieldProps('email')} */
                              />
                          <input 
                              type="text"
                              name='url'
                              placeholder='url'
                              className={styles.input_text}
                              /* {...formik.getFieldProps('email')} */
                              />
                          <input 
                              type="checkbox"
                              name='active'
                              placeholder='active'
                              className={styles.input_text}
                              /* {...formik.getFieldProps('email')} */
                              />
                          <div className="input-button">
                              <button type='submit' className="w-1/3 bg-gradient-to-r from-rose-500 to-fuchsia-500 rounded-md py-3 text-gray-50 text-lg">
                                  Save
                              </button>
                              <button 
                                  className="w-1/3 bg-zinc-100 rounded-md py-3 text-gray-800 text-lg"
                                  onClick={(e) => handleCancelAddLink(e)}>
                                  Cancel
                              </button>
                          </div>
                      </form>
                      : <div className='flex flex-col items-center justify-center align-center border-2 w-10 h-10 cursor-pointer rounded-full bg-zinc-50' onClick={(e)=> handleAddLink(e)}>
                          <HiOutlinePlusSm />
                      </div>
                  }
                  {links.map(link =>(
                      <div key = {link._id} className='flex flex-row justify-between w-full bg-zinc-50 hover:bg-zinc-100 py-3 m-3 rounded-full 
                          cursor-pointer border-2 border-zinc-100 hover:border-zinc-200 hover:border-dashed text-rose-950'> 
                          <p className="px-4">title: {link.title} | url:{link.url} | active:{link.active} | index: {link.index}</p> 
                          <span className='icon flex items-center px-4' onClick={(e) => handleEditLink(e, link)}><HiOutlinePencil /></span>
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