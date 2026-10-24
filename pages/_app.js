import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'

const poppins = Poppins({ weight: '400', subsets: ['latin'], display: 'swap' })

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <div className={poppins.className}>
        <Component {...pageProps} />
        <Analytics />
      </div>
    </SessionProvider>
  )
}

export default MyApp
