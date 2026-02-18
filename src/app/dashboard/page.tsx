'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import BookmarkForm from '@/components/BookmarkForm'
import BookmarkList from '@/components/BookmarkList'
import Navbar from '@/components/Navbar'

export default function Dashboard() {

  
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/')
      } else {
        setUserId(session.user.id)
        setEmail(session.user.email!)
      }

      setLoading(false)
    }

    checkSession()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
 <div className="relative min-h-screen text-gray-900 dark:text-gray-100">

  <Navbar email={email!} onLogout={handleLogout} />

  <div className="max-w-4xl mx-auto pt-28 px-6">

    <div className="rounded-3xl p-10 backdrop-blur-2xl bg-white/60 dark:bg-[#111827]/60 border border-gray-200 dark:border-white/10 shadow-2xl">

      {userId && (
        <>
          <BookmarkForm
            userId={userId}
            onAdd={() => setRefresh((prev) => prev + 1)}
          />
          <BookmarkList userId={userId} refreshTrigger={refresh} />
        </>
      )}

    </div>
  </div>
</div>

  )
}
