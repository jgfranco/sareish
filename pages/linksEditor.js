import Head from 'next/head'
import styles from '../styles/Form.module.css'
import { useSession, signOut } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]"
import connectMongo from '../database/conn';
import Links from '../model/LinkSchema';
import Layout from '../layouts/pagelayout';
import { HiOutlinePencilAlt, HiOutlinePlusCircle, HiOutlineXCircle, HiOutlineCheckCircle, HiOutlineLogout, HiOutlineTrash, HiOutlineChevronUp, HiOutlineChevronDown, HiOutlineMenu }  from 'react-icons/hi'
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { linkValidate } from '../lib/validate';
import { useRouter } from 'next/router';
import DragDropUpload from '../components/uploadForm';
import Image from 'next/image';
import Badge from '../components/badge';

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
        photoUrl:'',
        badge: '',
        startAt: '',
        endAt: ''
    },
    validate: linkValidate,
    onSubmit
  })

  // sort links descending; kept in state so it can be reordered
  const [sortedLinks, setSortedLinks] = useState(() => [...links].sort((a, b) => b.index - a.index));
  const [dragId, setDragId] = useState(null);
  useEffect(() => {
    setSortedLinks([...links].sort((a, b) => b.index - a.index));
  }, [links]);

  // move a link to a new position and save the order
  async function moveLink(id, toIndex){
    const from = sortedLinks.findIndex(l => l._id === id);
    if (from === -1 || toIndex < 0 || toIndex >= sortedLinks.length || from === toIndex) return;
    const next = [...sortedLinks];
    const [moved] = next.splice(from, 1);
    next.splice(toIndex, 0, moved);
    setSortedLinks(next);
    const saved = await saveLink('PUT', { order: next.map(l => l._id) }, 'Order saved');
    if (!saved) setSortedLinks([...links].sort((a, b) => b.index - a.index));
  }

  // edit link handlers
  function handleEditLink(link){
    formik.resetForm({ values: {
      _id: link._id,
      title: link.title || '',
      url: link.url || '',
      active: String(link.active) === 'true',
      index: link.index ?? '',
      photoUrl: link.photoUrl || '',
      badge: link.badge || '',
      startAt: toLocalInput(link.startAt),
      endAt: toLocalInput(link.endAt),
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
      badge: '',
      startAt: '',
      endAt: '',
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
    // the date inputs are in local time; send them as exact times
    const toSend = { ...values, startAt: fromLocalInput(values.startAt), endAt: fromLocalInput(values.endAt) };
    if (mode === 'add') await saveLink('POST', toSend, 'Link added');
    if (mode === 'edit') await saveLink('PATCH', toSend, 'Link updated');
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
                <div><label htmlFor="badge">badge:</label></div>
                <div className='col-span-3 text-left'>
                  <select id="badge" className='border border-zinc-200 rounded px-2 py-1' {...formik.getFieldProps('badge')}>
                    <option value=''>None</option>
                    <option value='New'>New</option>
                    <option value='Featured'>Featured</option>
                  </select>
                </div>
                <div><label htmlFor="startAt">show from:</label></div>
                <div className='col-span-3 text-left'>
                  <input id="startAt" type="datetime-local" className='border border-zinc-200 rounded px-2 py-1 max-w-full' {...formik.getFieldProps('startAt')} />
                </div>
                <div><label htmlFor="endAt">hide after:</label></div>
                <div className='col-span-3 text-left'>
                  <input id="endAt" type="datetime-local" className='border border-zinc-200 rounded px-2 py-1 max-w-full' {...formik.getFieldProps('endAt')} />
                  <p className='text-xs text-zinc-500 mt-1'>Optional. Leave empty to always show the link.</p>
                  {formik.errors.endAt && <span className='text-rose-500 block'>{formik.errors.endAt}</span>}
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
              <p className='text-xs text-zinc-500 mt-2'>Drag a link (or use the arrows) to change its position on the homepage.</p>
              {sortedLinks.map((link, i) =>(
                <div key = {link._id}
                    draggable
                    onDragStart={(e) => { setDragId(link._id); e.dataTransfer.effectAllowed = 'move'; }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); moveLink(dragId, i); setDragId(null); }}
                    onDragEnd={() => setDragId(null)}
                    className={`flex flex-row items-center justify-between w-full bg-zinc-50 hover:bg-zinc-100 py-3 my-2 rounded-full
                    border-2 border-zinc-100 hover:border-zinc-200 hover:border-dashed text-rose-950 ${dragId === link._id ? 'opacity-40' : ''}`}>
                  <span className='pl-4 text-zinc-400 cursor-grab' aria-hidden='true'><HiOutlineMenu size={20} /></span>
                  <p className="px-3 text-left flex-1 min-w-0 truncate">
                    {link.title}{link.badge && <Badge label={link.badge} />}{String(link.active) !== 'true' ? <span className='text-zinc-400'> (hidden)</span> : <ScheduleNote link={link} />}
                    <span className='text-zinc-400 text-sm'> · {(link.url || "").replace(/^https?:\/\//, '').substring(0,30)}</span>
                  </p>
                  <div className='flex items-center pr-2'>
                    <button type='button' className='p-1 disabled:opacity-20' onClick={() => moveLink(link._id, i - 1)} disabled={i === 0} aria-label={`Move ${link.title} up`}><HiOutlineChevronUp size={20} /></button>
                    <button type='button' className='p-1 disabled:opacity-20' onClick={() => moveLink(link._id, i + 1)} disabled={i === sortedLinks.length - 1} aria-label={`Move ${link.title} down`}><HiOutlineChevronDown size={20} /></button>
                    <button type='button' className='icon flex items-center px-2' onClick={() => handleEditLink(link)} aria-label={`Edit ${link.title}`}><HiOutlinePencilAlt size={25} /></button>
                  </div>
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


// "(starts Nov 3)" or "(ended)" next to links with a schedule
function ScheduleNote({ link }){
  const now = Date.now();
  const format = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (link.startAt && new Date(link.startAt) > now) return <span className='text-zinc-400'> (starts {format(link.startAt)})</span>;
  if (link.endAt && new Date(link.endAt) <= now) return <span className='text-zinc-400'> (ended)</span>;
  if (link.endAt) return <span className='text-zinc-400'> (until {format(link.endAt)})</span>;
  return null;
}

// stored time -> value for a datetime-local input, in the browser's time zone
function toLocalInput(value){
  if (!value) return '';
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

// datetime-local input value -> exact time, or null when empty
function fromLocalInput(value){
  return value ? new Date(value).toISOString() : null;
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