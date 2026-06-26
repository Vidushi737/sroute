import React from 'react'
import { Compass, Plus, Clock, Bookmark, MapPin } from 'lucide-react'
import { useApp } from '../context/AppContext'

const Itineraries: React.FC = () => {
  const { 
    generatedItinerary, 
    destination, 
    days, 
    budget, 
    setBookmarks, 
    setShowCreateModal 
  } = useApp()

  const handleSavePlace = (place: any) => {
    setBookmarks(prev => [
      ...prev,
      {
        id: Date.now(),
        name: place.name,
        category: place.category,
        score: place.authenticity_score,
        address: place.address,
        tags: ["itinerary"]
      }
    ])
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {!generatedItinerary ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 max-w-lg mx-auto bg-[#FFF0F0] border border-[#E91E63]/10 shadow-sm mt-12">
          <div className="w-16 h-16 rounded-full bg-[#E91E63]/10 flex items-center justify-center mx-auto text-[#E91E63]">
            <Compass size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#1e293b] m-0">No Active Itinerary Loaded</h3>
          <p className="text-xs text-[#475569] m-0">
            Configure and generate a route using our AI co-pilot, and details will be mapped out day-by-day here.
          </p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-premium text-white font-medium text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-1.5 hover:shadow-md transition-all cursor-pointer border-0 shadow-sm"
          >
            <Plus size={14} />
            <span>Build New Plan</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Timeline Detail */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-panel p-6 rounded-2xl flex justify-between items-center bg-[#FFF0F0] border border-[#E91E63]/10 shadow-sm">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#E91E63] tracking-wider">Active Travel Plan</span>
                <h2 className="text-lg font-bold text-[#1E293B] mt-0.5 m-0">{destination} Autour</h2>
                <p className="text-[10px] text-[#475569] m-0 mt-1">{days} days • Budget constraints: ${budget}/day</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#475569] block">Engineered Authenticity</span>
                <span className="text-xl font-extrabold text-[#E91E63]">96.2%</span>
              </div>
            </div>

            {/* Days timeline list */}
            <div className="space-y-6">
              {generatedItinerary.days.map(day => (
                <div key={day.dayNumber} className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#E91E63]/10 pb-2">
                    <span className="w-6 h-6 rounded-full bg-[#E91E63] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {day.dayNumber}
                    </span>
                    <h3 className="text-sm font-bold text-[#1E293B] m-0">Day {day.dayNumber} Exploration</h3>
                  </div>

                  <div className="space-y-4 pl-4 border-l border-[#E91E63]/20 ml-3">
                    {day.items.map(item => (
                      <div key={item.position} className="glass-card p-4 rounded-xl relative hover:shadow-sm transition-shadow bg-[#FFF0F0] border border-[#E91E63]/10 shadow-sm">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-bold text-[#E91E63] uppercase bg-[#E91E63]/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                                <Clock size={10} />
                                {item.startTime.substring(0, 5)} - {item.endTime.substring(0, 5)}
                              </span>
                              <span className="text-[10px] font-medium text-[#475569]">{item.place.address}</span>
                            </div>
                            <h4 className="text-sm font-bold text-[#1E293B] m-0 mt-1">{item.title}</h4>
                            <p className="text-xs text-[#475569] italic m-0 mt-1">{item.notes}</p>
                            <p className="text-[10px] text-[#475569] bg-[#FFF0F0]/50 p-2.5 rounded-lg border border-[#E91E63]/10 mt-2 m-0">
                              <strong>AI Insight:</strong> {item.place.description}
                            </p>
                          </div>
                          <div className="text-right flex flex-col items-end gap-1.5 shrink-0">
                            <div className="bg-[#22C55E]/10 text-[#22C55E] font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <span>{item.place.authenticity_score}% Auth</span>
                            </div>
                            <button 
                              onClick={() => handleSavePlace(item.place)}
                              className="text-xs text-[#E91E63] hover:underline flex items-center gap-0.5 mt-2 cursor-pointer bg-transparent border-0 p-0"
                            >
                              <Bookmark size={10} />
                              <span>Save</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Map Viewer & Spatial Controls */}
          <div className="space-y-4">
            <div className="glass-panel p-4 rounded-2xl h-80 flex flex-col justify-between bg-[#FFF0F0] border border-[#E91E63]/10 shadow-sm relative overflow-hidden">
              <h3 className="text-xs font-bold text-[#1E293B] flex items-center gap-1.5 m-0">
                <MapPin size={14} className="text-[#E91E63]" />
                <span>Sroute Spatial Network</span>
              </h3>
              
              {/* SVG Map mock representing path coordinates between stops */}
              <div className="flex-1 flex items-center justify-center relative">
                <svg width="200" height="150" viewBox="0 0 200 150" className="opacity-90">
                  {/* Connecting Paths */}
                  <path d="M 40 100 Q 100 40 160 80" fill="none" stroke="url(#gradient)" strokeWidth="3" strokeDasharray="5,5" />
                  <path d="M 160 80 Q 90 120 40 100" fill="none" stroke="url(#gradient-reverse)" strokeWidth="2" />
                  
                  {/* Markers */}
                  <circle cx="40" cy="100" r="6" fill="#E91E63" />
                  <circle cx="160" cy="80" r="6" fill="#EC407A" />
                  <circle cx="100" cy="50" r="4" fill="#FF8A65" />
                  
                  {/* Gradients */}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E91E63" />
                      <stop offset="100%" stopColor="#EC407A" />
                    </linearGradient>
                    <linearGradient id="gradient-reverse" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#EC407A" />
                      <stop offset="100%" stopColor="#FF8A65" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Map Pins overlay descriptors */}
                <span className="absolute top-[25%] left-[45%] text-[9px] bg-[#FFF0F0] border border-[#E91E63]/20 px-1 py-0.5 rounded shadow-sm text-[#1e293b]">Way 2</span>
                <span className="absolute bottom-[25%] left-[10%] text-[9px] bg-[#FFF0F0] border border-[#E91E63]/20 px-1 py-0.5 rounded shadow-sm text-[#1e293b]">Way 1</span>
                <span className="absolute top-[40%] right-[10%] text-[9px] bg-[#FFF0F0] border border-[#E91E63]/20 px-1 py-0.5 rounded shadow-sm text-[#1e293b]">Way 3</span>
              </div>

              <div className="text-[10px] text-[#475569] border-t border-[#E91E63]/10 pt-2 flex justify-between m-0">
                <span>Proximity optimized</span>
                <span className="text-[#E91E63] font-bold">2.4 km walking loop</span>
              </div>
            </div>

            {/* Walk Radius Tool */}
            <div className="glass-panel p-5 rounded-2xl space-y-3 bg-[#FFF0F0] border border-[#E91E63]/10 shadow-sm">
              <h4 className="text-xs font-bold text-[#1e293b] m-0">Proximity Radius Checker</h4>
              <p className="text-[10px] text-[#475569] m-0">
                Verify authentic eateries within a 1.5 km walking radius from your current waypoint.
              </p>
              <div className="flex gap-2">
                <select className="bg-[#FFF0F0] border border-[#E91E63]/15 rounded-lg p-2 text-xs flex-1 focus:outline-none focus:border-[#E91E63]">
                  <option>Way 1: Primary Spot</option>
                  <option>Way 2: Secondary Spot</option>
                  <option>Way 3: Tertiary Spot</option>
                </select>
                <button className="bg-[#E91E63] text-white text-xs px-3 rounded-lg hover:bg-[#E91E63]/90 transition-colors border-0 cursor-pointer">Find</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Itineraries
