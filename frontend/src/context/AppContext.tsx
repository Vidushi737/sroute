import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

// ─── Interfaces ───
export interface NearbySpot {
  name: string
  type: string
  description: string
  walking_distance: string
  specialty?: string | null
  lat?: number | null
  lon?: number | null
}

export interface CulturalFood {
  dish: string
  description: string
  where_to_find: string
  cultural_significance: string
}

export interface PlaceDetail {
  name: string
  address: string
  description: string
  authenticity_score: number
  category: string
  lat?: number | null
  lon?: number | null
  opening_hours?: string | null
  tip?: string | null
}

export interface ItineraryStop {
  time: string
  end_time: string
  title: string
  description: string
  place: PlaceDetail
  nearby_cafes: NearbySpot[]
  nearby_spots: NearbySpot[]
  cultural_food: CulturalFood[]
  emoji: string
  cost_estimate?: string | null
}

export interface Region {
  name: string
  description: string
  stops: ItineraryStop[]
  region_tip: string
}

export interface DayPlan {
  day_number: number
  theme: string
  regions: Region[]
}

export interface GeneratedItinerary {
  city: string
  total_days: number
  budget_per_day: number
  overall_authenticity: number
  trip_summary: string
  days: DayPlan[]
  travel_tips: string[]
}

export interface ChatMessage { sender: 'user' | 'ai'; text: string }
export interface BookmarkedPlace { id: number; name: string; category: string; score: number; address: string; tags: string[] }
export interface TripSummary { id: string; title: string; days: number; budget: number; score: number; date: string; image: string; itinerary_data?: GeneratedItinerary | null }

// ─── Context Type ───
interface AppContextType {
  // Auth
  user: User | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
  // Form
  destination: string
  setDestination: (d: string) => void
  days: number
  setDays: (d: number) => void
  budget: number
  setBudget: (b: number) => void
  isGenerating: boolean
  setIsGenerating: (b: boolean) => void
  // Data
  generatedItinerary: GeneratedItinerary | null
  setGeneratedItinerary: (it: GeneratedItinerary | null) => void
  chatMessages: ChatMessage[]
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
  bookmarks: BookmarkedPlace[]
  setBookmarks: React.Dispatch<React.SetStateAction<BookmarkedPlace[]>>
  previousTrips: TripSummary[]
  setPreviousTrips: React.Dispatch<React.SetStateAction<TripSummary[]>>
  showCreateModal: boolean
  setShowCreateModal: (b: boolean) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  handleGenerate: (e?: React.FormEvent) => Promise<void>
  toggleBookmark: (place: BookmarkedPlace) => Promise<void>
}

const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8001'
const AppContext = createContext<AppContextType | undefined>(undefined)

// ─── Provider ───
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Form state
  const [destination, setDestination] = useState('')
  const [days, setDays] = useState(3)
  const [budget, setBudget] = useState(100)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedItinerary, setGeneratedItinerary] = useState<GeneratedItinerary | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Data state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: "Hello! I am Sroute's AI travel co-pilot. How can I help refine your itinerary or uncover hidden gems today?" }
  ])
  const [bookmarks, setBookmarks] = useState<BookmarkedPlace[]>([])
  const [previousTrips, setPreviousTrips] = useState<TripSummary[]>([])

  // ─── Auth listener ───
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // ─── Load trips from Supabase when user logs in ───
  useEffect(() => {
    if (user) {
      loadTripsFromSupabase(user.id)
      loadBookmarksFromSupabase(user.id)
    } else {
      setPreviousTrips([])
      setBookmarks([])
    }
  }, [user])

  // ─── Load trips from DB ───
  const loadTripsFromSupabase = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('id, title, start_date, itinerary_data')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      const trips: TripSummary[] = (data || []).map((row: any) => ({
        id: row.id,
        title: row.title,
        days: row.itinerary_data?.total_days || 3,
        budget: row.itinerary_data?.budget_per_day || 0,
        score: row.itinerary_data?.overall_authenticity || 0,
        date: new Date(row.start_date || row.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        image: '',
        itinerary_data: row.itinerary_data || null
      }))
      setPreviousTrips(trips)
    } catch (err) {
      console.warn('Failed to load trips from Supabase:', err)
    }
  }

  // ─── Load bookmarks from DB ───
  const loadBookmarksFromSupabase = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('place_id, places(id, name, category, address, metadata)')
        .eq('user_id', userId)

      if (error) throw error

      const bms: BookmarkedPlace[] = (data || []).map((row: any) => ({
        id: row.place_id,
        name: row.places?.name || 'Unknown',
        category: row.places?.category || 'attraction',
        score: row.places?.metadata?.authenticity_score || 0,
        address: row.places?.address || '',
        tags: []
      }))
      setBookmarks(bms)
    } catch (err) {
      console.warn('Failed to load bookmarks from Supabase:', err)
    }
  }

  // ─── Toggle bookmark ───
  const toggleBookmark = async (place: BookmarkedPlace) => {
    if (!user) return
    const isBookmarked = bookmarks.some(b => b.id === place.id)

    if (isBookmarked) {
      // Remove
      setBookmarks(prev => prev.filter(b => b.id !== place.id))
      try {
        await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('place_id', place.id)
      } catch (err) {
        console.warn('Failed to remove bookmark:', err)
      }
    } else {
      // Add
      setBookmarks(prev => [...prev, place])
      try {
        // Ensure place exists in places table first
        const { data: existingPlace } = await supabase
          .from('places')
          .select('id')
          .eq('id', place.id)
          .single()

        if (!existingPlace) {
          await supabase.from('places').insert({
            id: place.id as any,
            name: place.name,
            category: place.category,
            address: place.address,
            city: '',
            metadata: { authenticity_score: place.score }
          })
        }

        await supabase.from('bookmarks').insert({
          user_id: user.id,
          place_id: place.id
        })
      } catch (err) {
        console.warn('Failed to add bookmark:', err)
      }
    }
  }

  // ─── Sign out ───
  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setPreviousTrips([])
    setBookmarks([])
    setGeneratedItinerary(null)
  }

  // ─── Generate itinerary + save to Supabase ───
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsGenerating(true)
    try {
      const response = await fetch(`${AI_SERVICE_URL}/api/v1/itinerary/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: destination, days, budgetPerDay: budget })
      })
      if (!response.ok) throw new Error(`Status ${response.status}`)
      const data: GeneratedItinerary = await response.json()
      setGeneratedItinerary(data)

      // Save to Supabase if user is authenticated
      if (user) {
        try {
          const { data: newTrip, error } = await supabase
            .from('trips')
            .insert({
              user_id: user.id,
              title: `${destination} — ${data.total_days} days`,
              start_date: new Date().toISOString().split('T')[0],
              status: 'planning',
              itinerary_data: data as any
            })
            .select('id, title, start_date')
            .single()

          if (!error && newTrip) {
            setPreviousTrips(prev => [{
              id: newTrip.id,
              title: newTrip.title,
              days: data.total_days,
              budget: data.budget_per_day,
              score: data.overall_authenticity,
              date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
              image: '',
              itinerary_data: data
            }, ...prev])
          }
        } catch (dbErr) {
          console.warn('Failed to save trip to Supabase:', dbErr)
          // Still add to local state as fallback
          setPreviousTrips(prev => [{
            id: `local-${Date.now()}`,
            title: `${destination} — ${data.total_days} days`,
            days: data.total_days,
            budget: data.budget_per_day,
            score: data.overall_authenticity,
            date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            image: '',
            itinerary_data: data
          }, ...prev])
        }
      } else {
        // Not logged in — still show in session
        setPreviousTrips(prev => [{
          id: `local-${Date.now()}`,
          title: `${destination} — ${data.total_days} days`,
          days: data.total_days,
          budget: data.budget_per_day,
          score: data.overall_authenticity,
          date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          image: '',
          itinerary_data: data
        }, ...prev])
      }
    } catch (err) {
      console.warn("AI unavailable, using fallback...", err)
      await new Promise(resolve => setTimeout(resolve, 1500))
      const fallback = buildFallback(destination || 'your destination', days, budget)
      setGeneratedItinerary(fallback)
    } finally {
      setIsGenerating(false)
      setShowCreateModal(false)
    }
  }

  return (
    <AppContext.Provider value={{
      user, session, isLoading, signOut,
      destination, setDestination, days, setDays, budget, setBudget,
      isGenerating, setIsGenerating, generatedItinerary, setGeneratedItinerary,
      chatMessages, setChatMessages, bookmarks, setBookmarks,
      previousTrips, setPreviousTrips, showCreateModal, setShowCreateModal,
      searchQuery, setSearchQuery, handleGenerate, toggleBookmark
    }}>
      {children}
    </AppContext.Provider>
  )
}

// ─── Fallback builder ───
function buildFallback(city: string, days: number, budget: number): GeneratedItinerary {
  const themes = ["Cultural Heart & Morning Rituals", "Hidden Neighborhoods & Markets", "Nature, Views & Farewell Feast"]
  return {
    city, total_days: days, budget_per_day: budget, overall_authenticity: 93,
    trip_summary: `A ${days}-day deep dive into authentic ${city} — region by region.`,
    travel_tips: ["Use local transit", "Carry small bills", "Ask locals for tips", "Wake early for best food"],
    days: Array.from({ length: days }).map((_, d) => ({
      day_number: d + 1, theme: themes[d % 3],
      regions: [{
        name: `Central ${city}`, description: `The heart of ${city} where history meets daily life.`,
        region_tip: "Start early to beat crowds and catch morning routines.",
        stops: [
          { time: "09:00", end_time: "10:30", title: "Morning coffee ritual", description: "Slow coffee at a beloved neighbourhood cafe with fresh local pastries.",
            place: { name: "Local Morning Cafe", address: `Central, ${city}`, description: "Where locals start their day.", authenticity_score: 88, category: "cafe", opening_hours: "7:00-14:00", tip: "Order what the person ahead orders" },
            nearby_cafes: [{ name: "Artisan Roasters", type: "cafe", description: "Single-origin specialists.", walking_distance: "3 min" }],
            nearby_spots: [{ name: "Morning Market", type: "market", description: "Local produce and flowers.", walking_distance: "2 min" }],
            cultural_food: [{ dish: "Traditional breakfast pastry", description: "Flaky local specialty.", where_to_find: "Corner bakeries before 7am", cultural_significance: "Most important daily ritual" }],
            emoji: "\u2615", cost_estimate: "$3-8" },
          { time: "11:00", end_time: "13:00", title: "Historic landmark walk", description: `Explore the most iconic cultural site in ${city}.`,
            place: { name: "Heritage Cultural Center", address: `Old quarter, ${city}`, description: "The landmark that defines the city.", authenticity_score: 92, category: "attraction", opening_hours: "9:00-17:00", tip: "Back entrance has no queue" },
            nearby_cafes: [{ name: "Heritage Tea House", type: "cafe", description: "Traditional tea ceremony.", walking_distance: "4 min" }],
            nearby_spots: [{ name: "City Viewpoint", type: "viewpoint", description: "Panoramic old town views.", walking_distance: "6 min" }, { name: "Artisan Alley", type: "shop", description: "Handmade crafts.", walking_distance: "3 min" }],
            cultural_food: [{ dish: "Street food specialty", description: "The dish this area invented.", where_to_find: "Stalls near the gate", cultural_significance: "Centuries of culinary tradition" }],
            emoji: "\uD83C\uDFDB\uFE0F", cost_estimate: "$5-12" },
          { time: "18:30", end_time: "20:30", title: "Evening heritage dinner", description: `Multi-generational restaurant where recipes haven't changed.`,
            place: { name: "Family Heritage Restaurant", address: `Old town, ${city}`, description: "Recipes unchanged for decades.", authenticity_score: 95, category: "restaurant", opening_hours: "17:00-22:00", tip: "Reserve the window table" },
            nearby_cafes: [{ name: "Night Market Stalls", type: "cafe", description: "Late-night local favorites.", walking_distance: "4 min" }],
            nearby_spots: [{ name: "Evening River Walk", type: "park", description: "Lantern-lit riverside path.", walking_distance: "5 min" }],
            cultural_food: [
              { dish: "Signature city dish", description: "What this city is known for.", where_to_find: "Gold standard here", cultural_significance: "Shows respect for tradition" },
              { dish: "Regional dessert", description: "Sweet with local ingredients.", where_to_find: "House special", cultural_significance: "Unique to this region" }
            ],
            emoji: "\uD83C\uDF7D\uFE0F", cost_estimate: "$15-30" }
        ]
      }]
    }))
  }
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within an AppProvider')
  return context
}
