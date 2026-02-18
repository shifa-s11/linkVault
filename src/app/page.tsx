
'use client'

import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase-client'

export default function Home() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 text-center">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-2xl"
      >

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-5xl sm:text-6xl font-bold tracking-tight dark:text-white"
        >
          Welcome to{' '}
          <span className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            LinkVault
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-6 text-lg text-gray-600 dark:text-gray-400"
        >
          Organize your favorite links in one beautiful place.
        </motion.p>

        {/* Login Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-10"
        >
          <button
            onClick={handleLogin}
            className="
              px-8 py-3 rounded-full
              bg-black text-white
              dark:bg-white dark:text-black
              font-medium
              shadow-lg
              hover:scale-105
              hover:shadow-xl
              active:scale-95
              transition-all duration-300
            "
          >
            Continue with Google
          </button>
        </motion.div>

      </motion.div>
    </div>
  )
}
