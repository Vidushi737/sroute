import React, { createContext, useContext, useState } from 'react'

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
export interface TripSummary { id: string; title: string; days: number; budget: number; score: number; date: string; image: string }

interface AppContextType {
  destination: string
  setDestination: (d: string) => void
  days: number
  setDays: (d: number) => void
  budget: number
  setBudget: (b: number) => void
  isGenerating: boolean
  setIsGenerating: (b: boolean) => void
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
}

const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8001'
const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [destination, setDestination] = useState('')
  const [days, setDays] = useState(3)
  const [budget, setBudget] = useState(100)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedItinerary, setGeneratedItinerary] = useState<GeneratedItinerary | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: "Hello! I am Sroute's AI travel co-pilot. How can I help refine your itinerary or uncover hidden gems today?" }
  ])
  const [bookmarks, setBookmarks] = useState<BookmarkedPlace[]>([
    { id: 1, name: "Ramen Haruka", category: "restaurant", score: 96.4, address: "Akihabara, Tokyo", tags: ["ramen"] },
    { id: 2, name: "Le Baratin", category: "restaurant", score: 95.3, address: "Belleville, Paris", tags: ["bistro"] },
    { id: 3, name: "Di Fara Pizza", category: "restaurant", score: 94.5, address: "Brooklyn, New York", tags: ["pizza"] }
  ])
  const [previousTrips, setPreviousTrips] = useState<TripSummary[]>([])

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
      // Save to trip history
      setPreviousTrips(prev => [{
        id: `trip-${Date.now()}`,
        title: `${destination} — ${data.total_days} days`,
        days: data.total_days,
        budget: data.budget_per_day,
        score: data.overall_authenticity,
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        image: ''
      }, ...prev])
    } catch (err) {
      console.warn("AI unavailable, using fallback...", err)
      await new Promise(resolve => setTimeout(resolve, 1500))
      setGeneratedItinerary(buildFallback(destination || 'your destination', days, budget))
    } finally {
      setIsGenerating(false)
      setShowCreateModal(false)
    }
  }

  return (
    <AppContext.Provider value={{
      destination, setDestination, days, setDays, budget, setBudget,
      isGenerating, setIsGenerating, generatedItinerary, setGeneratedItinerary,
      chatMessages, setChatMessages, bookmarks, setBookmarks,
      previousTrips, setPreviousTrips, showCreateModal, setShowCreateModal,
      searchQuery, setSearchQuery, handleGenerate
    }}>
      {children}
    </AppContext.Provider>
  )
}

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
          { time: "09:00", end_time: "10:30", title: "Morning coffee ritual", description: "Slow coffee at a beloved neighborhood café with fresh local pastries.",
            place: { name: "Local Morning Café", address: `Central, ${city}`, description: "Where locals start their day.", authenticity_score: 88, category: "cafe", opening_hours: "7:00-14:00", tip: "Order what the person ahead orders" },
            nearby_cafes: [{ name: "Artisan Roasters", type: "cafe", description: "Single-origin specialists.", walking_distance: "3 min" }],
            nearby_spots: [{ name: "Morning Market", type: "market", description: "Local produce and flowers.", walking_distance: "2 min" }],
            cultural_food: [{ dish: "Traditional breakfast pastry", description: "Flaky local specialty.", where_to_find: "Corner bakeries before 7am", cultural_significance: "Most important daily ritual" }],
            emoji: "☕", cost_estimate: "$3-8" },
          { time: "11:00", end_time: "13:00", title: "Historic landmark walk", description: `Explore the most iconic cultural site in ${city}.`,
            place: { name: "Heritage Cultural Center", address: `Old quarter, ${city}`, description: "The landmark that defines the city.", authenticity_score: 92, category: "attraction", opening_hours: "9:00-17:00", tip: "Back entrance has no queue" },
            nearby_cafes: [{ name: "Heritage Tea House", type: "cafe", description: "Traditional tea ceremony.", walking_distance: "4 min" }],
            nearby_spots: [{ name: "City Viewpoint", type: "viewpoint", description: "Panoramic old town views.", walking_distance: "6 min" }, { name: "Artisan Alley", type: "shop", description: "Handmade crafts.", walking_distance: "3 min" }],
            cultural_food: [{ dish: "Street food specialty", description: "The dish this area invented.", where_to_find: "Stalls near the gate", cultural_significance: "Centuries of culinary tradition" }],
            emoji: "🏛️", cost_estimate: "$5-12" },
          { time: "18:30", end_time: "20:30", title: "Evening heritage dinner", description: `Multi-generational restaurant where recipes haven't changed.`,
            place: { name: "Family Heritage Restaurant", address: `Old town, ${city}`, description: "Recipes unchanged for decades.", authenticity_score: 95, category: "restaurant", opening_hours: "17:00-22:00", tip: "Reserve the window table" },
            nearby_cafes: [{ name: "Night Market Stalls", type: "cafe", description: "Late-night local favorites.", walking_distance: "4 min" }],
            nearby_spots: [{ name: "Evening River Walk", type: "park", description: "Lantern-lit riverside path.", walking_distance: "5 min" }],
            cultural_food: [
              { dish: "Signature city dish", description: "What this city is known for.", where_to_find: "Gold standard here", cultural_significance: "Shows respect for tradition" },
              { dish: "Regional dessert", description: "Sweet with local ingredients.", where_to_find: "House special", cultural_significance: "Unique to this region" }
            ],
            emoji: "🍽️", cost_estimate: "$15-30" }
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
