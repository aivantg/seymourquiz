import '../styles/globals.css'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

function MyApp({ Component, pageProps }) {
  return (
    <div className="h-screen w-screen flex justify-center items-center sm:bg-black">
      <Head>
        <title>seymour st</title>
      </Head>
      <div className="sm:transform sm:rotate-1">
        <AnimatePresence 
        mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="container p-8 w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <Image src="/images/title.png" alt="seymour st" width={500} height={300} />
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>
      </div>
      <footer className="fixed bottom-0 text-center text-sm p-4 w-full sm:text-white">
        <p>•───────• <a className="link" href="https://github.com/cnnmon"><b>˙ᵕ˙</b></a> •───────•</p>
      </footer>
    </div>
  )
}

export default MyApp
