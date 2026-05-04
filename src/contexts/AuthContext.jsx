import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

// Demo user for when Supabase is not configured
const DEMO_USER = {
  id: 'demo-user-001',
  email: 'traveller@tripmate.app',
  user_metadata: { name: 'Traveller' }
}

const DEMO_PROFILE = {
  id: 'demo-user-001',
  name: 'Traveller',
  email: 'traveller@tripmate.app',
  avatar_url: null,
  created_at: new Date().toISOString()
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // Demo mode — skip auth
      setIsDemo(true)
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
      }
      setProfile(data || null)
    } catch (err) {
      console.error('Profile fetch error:', err)
    }
  }

  const signIn = async (email, password) => {
    if (isDemo) {
      setUser(DEMO_USER)
      setProfile(DEMO_PROFILE)
      return { data: { user: DEMO_USER }, error: null }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signUp = async (email, password, name) => {
    if (isDemo) {
      const demoUser = { ...DEMO_USER, email, user_metadata: { name } }
      setUser(demoUser)
      setProfile({ ...DEMO_PROFILE, name, email })
      return { data: { user: demoUser }, error: null }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })

    if (!error && data.user) {
      // Create user profile
      await supabase.from('users').insert({
        id: data.user.id,
        name,
        email,
        avatar_url: null
      })
    }

    return { data, error }
  }

  const signOut = async () => {
    if (isDemo) {
      setUser(null)
      setProfile(null)
      return
    }
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setSession(null)
  }

  const updateProfile = async (updates) => {
    if (isDemo) {
      setProfile(prev => ({ ...prev, ...updates }))
      return { error: null }
    }

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)

    if (!error) {
      setProfile(prev => ({ ...prev, ...updates }))
    }
    return { error }
  }

  const demoLogin = () => {
    setUser(DEMO_USER)
    setProfile(DEMO_PROFILE)
    setIsDemo(true)
  }

  const value = {
    user,
    profile,
    session,
    loading,
    isDemo,
    signIn,
    signUp,
    signOut,
    updateProfile,
    demoLogin,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
