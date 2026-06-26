import React, { createContext, useContext, useState } from 'react'

export interface Place {
  name: string
  category: string
  address: string
  latitude: number
  longitude: number
  authenticity_score: number
  description: string
}

export interface ItineraryItem {
  position: number
  title: string
  notes: string
  startTime: string
  endTime: string
  type: string
  place: Place
}

export interface DayItinerary {
  dayNumber: number
  items: ItineraryItem[]
}

export interface ItineraryResponse {
  tripId: string
  days: DayItinerary[]
}

export interface ChatMessage {
  sender: 'user' | 'ai'
  text: string
}

export interface BookmarkedPlace {
  id: number
  name: string
  category: string
  score: number
  address: string
  tags: string[]
}

export interface TripSummary {
  id: string
  title: string
  days: number
  budget: number
  score: number
  date: string
  image: string
}

interface AppContextType {
  destination: string
  setDestination: (d: string) => void
  days: number
  setDays: (d: number) => void
  budget: number
  setBudget: (b: number) => void
  style: string
  setStyle: (s: string) => void
  preferences: string
  setPreferences: (p: string) => void
  isGenerating: boolean
  setIsGenerating: (b: boolean) => void
  generatedItinerary: ItineraryResponse | null
  setGeneratedItinerary: (it: ItineraryResponse | null) => void
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

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [destination, setDestination] = useState('')
  const [days, setDays] = useState(3)
  const [budget, setBudget] = useState(100)
  const [style, setStyle] = useState('cultural-adventure')
  const [preferences, setPreferences] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedItinerary, setGeneratedItinerary] = useState<ItineraryResponse | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: "Hello! I am Sroute's AI travel co-pilot. How can I help refine your itinerary or uncover hidden gems today?" }
  ])

  const [bookmarks, setBookmarks] = useState<BookmarkedPlace[]>([
    { id: 1, name: "Ramen Haruka", category: "restaurant", score: 96.4, address: "Akihabara, Tokyo", tags: ["ramen", "basement-spot"] },
    { id: 2, name: "Le Baratin", category: "restaurant", score: 95.3, address: "Belleville, Paris", tags: ["bistro", "natural-wine"] },
    { id: 3, name: "Di Fara Pizza", category: "restaurant", score: 94.5, address: "Brooklyn, New York", tags: ["pizza", "handmade"] }
  ])

  const [previousTrips, setPreviousTrips] = useState<TripSummary[]>([
    { id: "trip-1", title: "Autumn in Kyoto", days: 5, budget: 120, score: 94.5, date: "Oct 2025", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=300&auto=format&fit=crop" },
    { id: "trip-2", title: "Osaka Street Food Hunt", days: 3, budget: 80, score: 91.2, date: "Jan 2026", image: "https://images.unsplash.com/photo-1590253508316-db181a4d6560?q=80&w=300&auto=format&fit=crop" }
  ])

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsGenerating(true)

    try {
      const response = await fetch('http://localhost:8080/api/v1/trips')
      const tripData = await response.json()
      
      const genResponse = await fetch(`http://localhost:8080/api/v1/trips/${tripData.id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: destination,
          days: days,
          budgetPerDay: budget,
          style: style,
          preferences: preferences.split(',').map(p => p.trim()).filter(Boolean)
        })
      })
      const itineraryData = await genResponse.json()
      setGeneratedItinerary(itineraryData)
    } catch (err) {
      console.warn("Backend unavailable. Simulating dynamic local generation...", err)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const cityName = destination || 'your destination'
      const mockResult: ItineraryResponse = {
        tripId: "mock-trip-uuid",
        days: Array.from({ length: days }).map((_, idx) => ({
          dayNumber: idx + 1,
          items: [
            {
              position: 0,
              title: `Morning coffee at a local café in ${cityName}`,
              notes: `Find a neighborhood café in ${cityName} away from tourist areas. Ask locals for their favorite morning spot.`,
              startTime: "09:00:00",
              endTime: "10:00:00",
              type: "meal",
              place: {
                name: `Local Café in ${cityName}`,
                category: "cafe",
                address: cityName,
                latitude: 0,
                longitude: 0,
                authenticity_score: 85.0,
                description: `A neighborhood café in ${cityName} frequented by locals.`
              }
            },
            {
              position: 1,
              title: `Explore a cultural landmark in ${cityName}`,
              notes: `Visit a historic or cultural site in ${cityName}. Seek out lesser-known gems.`,
              startTime: "10:30:00",
              endTime: "12:30:00",
              type: "visit",
              place: {
                name: `Cultural Landmark in ${cityName}`,
                category: "attraction",
                address: cityName,
                latitude: 0,
                longitude: 0,
                authenticity_score: 90.0,
                description: `A historic or cultural site in ${cityName} with local significance.`
              }
            },
            {
              position: 2,
              title: `Dinner at a local restaurant in ${cityName}`,
              notes: `Seek out a family-run restaurant in ${cityName} serving traditional local cuisine.`,
              startTime: "18:00:00",
              endTime: "19:30:00",
              type: "meal",
              place: {
                name: `Local Restaurant in ${cityName}`,
                category: "restaurant",
                address: cityName,
                latitude: 0,
                longitude: 0,
                authenticity_score: 92.0,
                description: `A family-run restaurant in ${cityName} serving authentic local cuisine.`
              }
            }
          ]
        }))
      }
      setGeneratedItinerary(mockResult)
    } finally {
      setIsGenerating(false)
      setShowCreateModal(false)
    }
  }

  return (
    <AppContext.Provider value={{
      destination, setDestination,
      days, setDays,
      budget, setBudget,
      style, setStyle,
      preferences, setPreferences,
      isGenerating, setIsGenerating,
      generatedItinerary, setGeneratedItinerary,
      chatMessages, setChatMessages,
      bookmarks, setBookmarks,
      previousTrips, setPreviousTrips,
      showCreateModal, setShowCreateModal,
      searchQuery, setSearchQuery,
      handleGenerate
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
