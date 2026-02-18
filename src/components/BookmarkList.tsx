'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-client'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

interface Bookmark {
  id: string
  url: string
  title: string
  created_at: string
}

interface Props {
  userId: string
  refreshTrigger: number
}

export default function BookmarkList({ userId, refreshTrigger }: Props) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  useEffect(() => {
    const loadBookmarks = async () => {
      const { data } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (data) setBookmarks(data)
      setLoading(false)
    }

    loadBookmarks()
  }, [userId, refreshTrigger])

  useEffect(() => {
  if (!userId) return

  const channel = supabase
    .channel(`bookmarks-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookmarks',
        filter: `user_id=eq.${userId}`,
      },
      async () => {
        const { data } = await supabase
          .from('bookmarks')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (data) {
          setBookmarks(data)
        }
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [userId])


  const handleDelete = async (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id))
    await supabase.from('bookmarks').delete().eq('id', id)
    toast.success('Deleted successfully')
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 dark:text-gray-400">
        No bookmarks yet.
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {bookmarks.map((bookmark) => (
      <motion.div
  key={bookmark.id}
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
  className="
    relative group overflow-hidden
    p-6 rounded-2xl
    backdrop-blur-xl
    bg-gradient-to-br 
    from-white/70 to-white/40
    dark:from-white/10 dark:to-white/5
    border border-white/30 dark:border-white/10
    shadow-[0_6px_25px_rgba(0,0,0,0.06)]
    transition-all duration-500
    hover:shadow-[0_18px_50px_rgba(0,0,0,0.12)]
    hover:-translate-y-1
  "
>
  {/* Hover Gradient Overlay */}
  <div
    className="
      absolute inset-0 z-0
      bg-gradient-to-r 
      from-indigo-500/10 via-purple-500/10 to-pink-500/10
      opacity-0 group-hover:opacity-100
      transition-opacity duration-500
    "
  />

  {/* Content */}
  <div className="relative z-10 flex justify-between items-start">
    <div>
      <h3 className="text-lg font-semibold tracking-tight text-gray-800 dark:text-gray-100">
        {bookmark.title}
      </h3>

      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 mt-3 text-sm text-indigo-500 hover:text-indigo-600 transition"
      >
        <ExternalLink size={16} />
        <span className="truncate max-w-xs">
          {bookmark.url}
        </span>
      </a>
    </div>

    <button
      onClick={() => setConfirmId(bookmark.id)}
      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
    >
      <Trash2 size={18} />
    </button>
  </div>
</motion.div>

        ))}
      </div>

      <AnimatePresence>
        {confirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            {/* Softer backdrop */}
            <div className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-md" />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="
                relative z-10
                w-[90%] max-w-md
                p-8 rounded-2xl
                bg-gradient-to-br
                from-white to-gray-50
                dark:from-[#111827] dark:to-[#0f172a]
                border border-gray-200 dark:border-white/10
                shadow-[0_20px_60px_rgba(0,0,0,0.15)]
              "
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Delete this bookmark?
              </h2>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setConfirmId(null)}
                  className="
                    px-4 py-2 rounded-lg
                    border border-gray-300 dark:border-white/20
                    text-gray-700 dark:text-gray-300
                    hover:bg-gray-100 dark:hover:bg-white/10
                    transition duration-300
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    handleDelete(confirmId)
                    setConfirmId(null)
                  }}
                  className="
                    px-4 py-2 rounded-lg
                    bg-red-500 text-white
                    hover:bg-red-600
                    shadow-md hover:shadow-lg
                    transition duration-300
                  "
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
