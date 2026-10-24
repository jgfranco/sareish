import Head from 'next/head'
import styles from '../styles/Form.module.css'
import { useSession, signOut } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]"
import connectMongo from '../database/conn';
import Links from '../model/LinkSchema';
import Layout from '../layouts/pagelayout';
import { HiOutlinePencilAlt, HiOutlinePlusCircle, HiOutlineXCircle, HiOutlineCheckCircle, HiOutlineLogout, HiOutlineTrash }  from 'react-icons/hi'
import { useState } from 'react';
import { useFormik } from 'formik';
import { linkValidate } from '../lib/validate';
import { useRouter } from 'next/router';
import DragDropUpload from '../components/uploadForm';
import Image from 'next/image';

export default function LinksEditor({links}){
    
  const { data: session } = useSession()

  function handleSignOut(){
    signOut()
  }

  return (
    <Layout>
      <Head>
          <title>Links Editor</title>
          <meta name="robots" content="noindex, nofollow" />
      </Head>
      {session ? <User session={session} handleSignOut={handleSignOut} links={links} /> : <p>Restricted Access</p>}
    </Layout>
  )
}

function User({ session, handleSignOut, links }){

  const [mode, setMode] = useState(null); // null, 'add' or 'edit'
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // formik Hook
  const formik = useFormik({
    initialValues: {
        title : '',
        url: '',
        active: true,
        index: '',
        photoUrl:''
    },
    validate: linkValidate,
    onSubmit
  })

  // sort links descending
  const sortedLinks = [...links].sort((a, b) => b.index - a.index);

  // edit link handlers
  function handleEditLink(link){
    formik.resetForm({ values: {
      _id: link._id,
      title: link.title || '',
      url: link.url || '',
      active: String(link.active) === 'true',
      index: link.index ?? '',
      photoUrl: link.photoUrl || '',
    }});
    setMessage('');
    setMode('edit');
  }

  function handleCancel(){
    setMode(null);
  }

  // add link handlers
  function handleAddLink(){
    formik.resetForm({ values: {
      title: '',
      url: '',
      active: true,
      index: links.length,
      photoUrl: '',
    }});
    setMessage('');
    setMode('add');
  }

  function setPhotoUrl(url){
    formik.setFieldValue('photoUrl', url);
  }

  // send a change to the links API, then reload the list
  async function saveLink(method, values, doneMessage){
    const res = await fetch('/api/links', {
      method,
      headers : { 'Content-Type': 'application/json'},
      body: JSON.stringify(values)
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error || 'Something went wrong, please try again');
      return false;
    }

    setMessage(doneMessage);
    setMode(null);
    router.replace(router.asPath);
    return true;
  }

  async function onSubmit(values){
    // saving mid-upload would store the link without its photo
    if (uploading) {
      setMessage('Wait for the photo to finish uploading, then save');
      return;
    }
    if (mode === 'add') await saveLink('POST', values, 'Link added');
    if (mode === 'edit') await saveLink('PATCH', values, 'Link updated');
  }

  async function handleDelete(){
    if (!window.confirm(`Delete "${formik.values.title}"? This can't be undone.`)) return;
    await saveLink('DELETE', { _id: formik.values._id }, 'Link deleted');
  }

  return (
      <section className="container mx-auto text-center py-10 w-4/5 sm:w-1/2">
        {message && <p className='mb-4 text-sm text-zinc-600' role='status'>{message}</p>}
        <div className='flex flex-col'>
          {mode
            ?
            <form onSubmit={formik.handleSubmit}>
              <div className='grid grid-cols-4 gap-4'>
                <div className='col-span-4'>
                  <div className='flex flex-col w-full'>
                    <button type='button' className='flex self-center justify-center items-center w-10 h-10 rounded-full' onClick={handleCancel} aria-label='Cancel'>
                      <HiOutlineXCircle size={25}/></button>
                  </div>
                </div>
                <div className='col-span-4'>
                  <input
                    type="text"
                    placeholder='title'
                    aria-label='Title'
                    className={styles.input_text}
                    {...formik.getFieldProps('title')}
                  />
                {formik.errors.title && formik.touched.title ? <span className='text-rose-500'>{formik.errors.title}</span> : <></>}
                </div>
                <div className='col-span-4'>
                  <input
                    type="text"
                    placeholder='url'
                    aria-label='URL'
                    className={styles.input_text}
                    {...formik.getFieldProps('url')}
                  />
                {formik.errors.url && formik.touched.url ? <span className='text-rose-500'>{formik.errors.url}</span> : <></>}
                </div>
                  <div className='col-span-4'>
                    <input
                      type="number"
                      placeholder='index'
                      aria-label='Position (higher shows first)'
                      className={styles.input_text}
                      readOnly={mode === 'add'}
                      {...formik.getFieldProps('index')}
                    />
                  </div>
                <div><label htmlFor="active">active:</label></div>
                <div className='col-span-3 text-left'>
                  <input
                    id="active"
                    type="checkbox"
                    {...formik.getFieldProps({ name: 'active', type: 'checkbox' })}
                  />
                </div>

                <div className="col-span-4">
                  <DragDropUpload onUploadComplete={(url) => setPhotoUrl(url)} onUploadingChange={setUploading} />
                  {formik.values.photoUrl && (
                    <div className="mt-4">
                      <Image src={formik.values.photoUrl} alt="Photo preview" className="w-32 mx-auto mt-2 rounded-lg" width={75} height={75} />
                      <p className="text-sm text-gray-600 mt-2">Press ✓ to save the photo with this link</p>
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder='photo url'
                    aria-label='Photo URL'
                    className={styles.input_text}
                    {...formik.getFieldProps('photoUrl')}
                  />
                </div>
                <div className='col-span-4'>
                  <div className='flex justify-center gap-4'>
                    {mode === 'edit' && (
                      <button type='button' onClick={handleDelete} disabled={formik.isSubmitting}
                        className='flex justify-center items-center w-10 h-10 rounded-full text-rose-600 hover:bg-rose-50' aria-label='Delete link'>
                        <HiOutlineTrash size={25}/></button>
                    )}
                    <button type='submit' disabled={formik.isSubmitting || uploading}
                      className='flex justify-center items-center w-10 h-10 rounded-full hover:bg-zinc-100 disabled:opacity-30' aria-label='Save link'>
                      <HiOutlineCheckCircle size={25}/></button>
                  </div>
                </div>
              </div>
            </form>
            :
            <div className='flex flex-col w-full'>
              <button type='button' className='flex self-center justify-center items-center w-10 h-10 rounded-full hover:bg-zinc-100' onClick={handleAddLink} aria-label='Add link'>
                <HiOutlinePlusCircle  size={25}/>
              </button>
              {sortedLinks.map(link =>(
                <div key = {link._id} className='flex flex-row justify-between w-full bg-zinc-50 hover:bg-zinc-100 py-3 m-3 rounded-full
                    border-2 border-zinc-100 hover:border-zinc-200 hover:border-dashed text-rose-950'>
                  <p className="px-4 text-left">|{link.index}|: {link.title} | {(link.url || "").substring(0,20)}... | active:{String(link.active)} | clicks: {link.clicks || 0} | photoUrl: {(link.photoUrl || "").substring(0,40)}...</p>
                  <button type='button' className='icon flex items-center px-4' onClick={() => handleEditLink(link)} aria-label={`Edit ${link.title}`}><HiOutlinePencilAlt size={25} /></button>
                </div>
              ))}
            </div>
          }
        </div>
        <div className="container mx-auto text-center py-4">
          <h1 className=' text-2xl font-bold'>Authorized User</h1>
          <div className='details'>
            <h5>{session.user.email}</h5>
          </div>
          <div className="flex justify-center">
            <button type='button' className='icon flex items-center p-2 hover:text-sky-600' onClick={handleSignOut}>Sign out &nbsp; <HiOutlineLogout size={25}/></button>
          </div>
        </div>
      </section>
  )
}


export const getServerSideProps = async ({req, res}) =>{

  try{
      const session = await getServerSession(req, res, authOptions)

      if(!session){
          return {
              redirect : {
                  destination : "/login",
                  permanent: false
              }
          }
      }

      await connectMongo();
      const links = await Links.find(); // {active:true} to bring only active links

      return {
          props: {
              links: JSON.parse(JSON.stringify(links)),
              session: session
          },
      };
  }
  catch (error) {
      console.error(error);
      return {
          notFound: true
      }
  }
}