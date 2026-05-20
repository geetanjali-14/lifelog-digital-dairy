import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

/**
 * Custom hook to get the current user session
 * @returns session data, loading state, and helper functions
 */
export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'
  const user = session?.user

  const logout = async () => {
    await signOut({ redirect: false })
    router.push('/signin')
  }

  const requireAuth = () => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin')
    }
  }

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    logout,
    requireAuth,
  }
}
