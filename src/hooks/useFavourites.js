import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

// Local storage key for demo mode favourites
const DEMO_FAV_KEY = 'tripmate_favourites'

export function useFavourites() {
  const { user, isDemo } = useAuth()
  const [favourites, setFavourites] = useState([])
  const [loading, setLoading] = useState(true)

  // Load favourites
  useEffect(() => {
    if (!user) {
      setFavourites([])
      setLoading(false)
      return
    }

    if (isDemo || !isSupabaseConfigured()) {
      // Load from localStorage in demo mode
      const stored = localStorage.getItem(DEMO_FAV_KEY)
      setFavourites(stored ? JSON.parse(stored) : [])
      setLoading(false)
      return
    }

    // Load from Supabase
    const fetchFavourites = async () => {
      try {
        const { data, error } = await supabase
          .from('favourites')
          .select('*')
          .eq('user_id', user.id)

        if (error) throw error
        setFavourites(data || [])
      } catch (err) {
        console.error('Error fetching favourites:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFavourites()
  }, [user, isDemo])

  const isFavourited = useCallback((destinationId) => {
    return favourites.some(f => f.destination_id === destinationId)
  }, [favourites])

  const toggleFavourite = useCallback(async (destinationId, destinationData = {}) => {
    if (!user) return

    const exists = isFavourited(destinationId)

    if (isDemo || !isSupabaseConfigured()) {
      // Demo mode: use localStorage
      let updated
      if (exists) {
        updated = favourites.filter(f => f.destination_id !== destinationId)
      } else {
        updated = [...favourites, {
          id: `fav-${Date.now()}`,
          user_id: user.id,
          destination_id: destinationId,
          created_at: new Date().toISOString(),
          ...destinationData
        }]
      }
      setFavourites(updated)
      localStorage.setItem(DEMO_FAV_KEY, JSON.stringify(updated))
      return
    }

    // Supabase mode
    try {
      if (exists) {
        const { error } = await supabase
          .from('favourites')
          .delete()
          .eq('user_id', user.id)
          .eq('destination_id', destinationId)

        if (error) throw error
        setFavourites(prev => prev.filter(f => f.destination_id !== destinationId))
      } else {
        const { data, error } = await supabase
          .from('favourites')
          .insert({
            user_id: user.id,
            destination_id: destinationId
          })
          .select()
          .single()

        if (error) throw error
        setFavourites(prev => [...prev, data])
      }
    } catch (err) {
      console.error('Error toggling favourite:', err)
    }
  }, [user, favourites, isFavourited, isDemo])

  return {
    favourites,
    loading,
    isFavourited,
    toggleFavourite
  }
}
