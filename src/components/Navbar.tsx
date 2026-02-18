'use client'

import { useState, useRef, useEffect } from 'react'
import { Sun, Moon, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  email: string
  onLogout: () => void
}

export default function Navbar({ email, onLogout }: Props) {
  const [dark, setDark] = useState(
    typeof window !== 'undefined' &&
      document.documentElement.classList.contains('dark')
  )

  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleTheme = () => {
    const newTheme = !dark
    setDark(newTheme)

    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const firstLetter = email.charAt(0).toUpperCase()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-6">

        <div className="mt-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-[#0f172a]/70 backdrop-blur-xl shadow-md px-6 h-16 flex items-center justify-between transition">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <span className="text-xl font-semibold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              LinkVault
            </span>

            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              Welcome {email}
            </span>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Avatar + Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-sm transition hover:scale-105"
              >
                {firstLetter}
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="
                      absolute 
                      right-[-8px]   /* slight shift right */
                      mt-5           /* slightly lower */
                      w-44
                      rounded-xl
                      border border-gray-200 dark:border-white/10
                      bg-white dark:bg-[#111827]
                      shadow-[0_15px_40px_rgba(0,0,0,0.12)]
                      overflow-hidden
                    "
                  >
                    <button
                      onClick={onLogout}
                      className="
                        flex items-center gap-3 
                        w-full px-4 py-3 
                        text-sm text-red-500 
                        hover:bg-red-50 dark:hover:bg-red-500/10 
                        transition
                      "
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>
        </div>
      </div>
    </header>
  )
}
