'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase-client'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

interface Props {
  userId: string
  onAdd: () => void
}

export default function BookmarkForm({ userId, onAdd }: Props) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleAddBookmark = async () => {
    if (!url.trim() || !title.trim()) {
      toast.error('Both fields are required')
      return
    }

    setSubmitting(true)

 const cleanUrl = url.trim()
  const formattedUrl =
    cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')
      ? cleanUrl
      : `https://${cleanUrl}`

  const { error } = await supabase.from('bookmarks').insert([
    {
      user_id: userId,
      url: formattedUrl,
      title: title.trim(),
    },
  ])

    if (error) {
      toast.error(error.message)
    } else {
      setUrl('')
      setTitle('')
      toast.success('Bookmark added!')
      onAdd()
    }

    setSubmitting(false)
  }

  return (
    <div className="mb-10 space-y-4">
      <input
        type="text"
        placeholder="Bookmark Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />
   
      <input
        type="text"
        placeholder="Bookmark URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />

<div className="flex justify-end mt-4">
  <button
    onClick={handleAddBookmark}
    disabled={submitting}
    className="
      px-5 py-2.5
      flex items-center gap-2
      rounded-lg
      font-medium text-sm
      bg-indigo-600 text-white
      shadow-sm
      hover:bg-indigo-700
      hover:shadow-md
      active:scale-[0.98]
      transition-all duration-200
      disabled:opacity-50 disabled:cursor-not-allowed
    "
  >
    <Plus size={16} strokeWidth={2.2} />
    {submitting ? 'Adding...' : 'Add Bookmark'}
  </button>
</div>




    </div>
  )
}
