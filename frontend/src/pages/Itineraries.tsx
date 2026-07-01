import React, { useState } from 'react'
import {
  Compass, Plus, Clock, Bookmark, MapPin, Coffee, UtensilsCrossed,
  ChevronDown, ChevronUp, Sparkles, Map, Eye, Store, TreePine,
  Landmark, DollarSign, Lightbulb, Navigation, Star
} from 'lucide-react'
import { useApp, ItineraryStop, NearbySpot } from '../context/AppContext'

const spotIcon = (type: string) => {
  switch (type) {
    case 'viewpoint': return <Eye size={11} />
    case 'park': return <TreePine size={11} />
    case 'shop': case 'market': return <Store size={11} />
    case 'museum': case 'gallery': return <Landmark size={11} />
    case 'restaurant': return <UtensilsCrossed size={11} />
    default: return <MapPin size={11} />
  }
}

const Itineraries: React.FC = () => {
  const { generatedItinerary, destination, days, budget, setBookmarks, setShowCreateModal } = useApp()
  const [activeDay, setActiveDay] = useState(0)
  const [expandedStop, setExpandedStop] = useState<string | null>(null)

  const toggleStop = (key: string) => setExpandedStop(p => p === key ? null : key)

  const handleSave = (stop: ItineraryStop) => {
    setBookmarks(prev => [...prev, {
      id: Date.now(), name: stop.place.name, category: stop.place.category,
      score: stop.place.authenticity_score, address: stop.place.address, tags: ['itinerary']
    }])
  }

  // ─── Empty State ───
  if (!generatedItinerary) {
    return (
      <div className="animate-in fade-in duration-200 max-w-lg mx-auto mt-12">
        <div className="rounded-3xl bg-white border border-[#E2ECE9] shadow-sm p-10 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D85A38] to-[#FF8A65] flex items-center justify-center mx-auto text-white shadow-lg shadow-[#D85A38]/20">
            <Compass size={32} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#1C2D27] m-0">Plan Your AI Trip</h3>
            <p className="text-xs text-[#4F5E59] m-0 mt-2 leading-relaxed">
              Enter a place, your budget, and number of days. Our AI creates a region-by-region plan with real places, nearby cafes, hidden spots, and cultural food.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-[10px] text-[#4F5E59]">
            <span className="flex items-center gap-1"><MapPin size={12} className="text-[#D85A38]" /> Real Places</span>
            <span className="flex items-center gap-1"><Coffee size={12} className="text-[#D85A38]" /> Nearby Cafes</span>
            <span className="flex items-center gap-1"><Navigation size={12} className="text-[#D85A38]" /> Nearby Spots</span>
            <span className="flex items-center gap-1"><UtensilsCrossed size={12} className="text-[#D85A38]" /> Cultural Food</span>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="bg-gradient-to-r from-[#D85A38] to-[#FF8A65] text-white font-bold text-sm px-8 py-3.5 rounded-xl inline-flex items-center gap-2 hover:shadow-lg hover:shadow-[#D85A38]/25 hover:-translate-y-0.5 transition-all cursor-pointer border-0">
            <Sparkles size={16} /> Generate AI Itinerary
          </button>
        </div>
      </div>
    )
  }

  const { city, total_days, overall_authenticity, trip_summary, travel_tips, days: itinDays } = generatedItinerary
  const currentDay = itinDays[activeDay] || itinDays[0]
  const totalStops = itinDays.reduce((a, d) => a + d.regions.reduce((b, r) => b + r.stops.length, 0), 0)
  const totalCafes = itinDays.reduce((a, d) => a + d.regions.reduce((b, r) => b + r.stops.reduce((c, s) => c + s.nearby_cafes.length, 0), 0), 0)
  const totalSpots = itinDays.reduce((a, d) => a + d.regions.reduce((b, r) => b + r.stops.reduce((c, s) => c + s.nearby_spots.length, 0), 0), 0)

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* ─── Hero Header ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C2D27] via-[#2A4A3F] to-[#1C2D27] p-6 sm:p-8 text-white">
        <div className="absolute top-4 right-8 text-6xl opacity-10">🌍</div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-[#D85A38]/20 text-[#FF8A65] px-2 py-0.5 rounded">AI + OpenStreetMap</span>
                <span className="text-[10px] text-white/50 font-bold">{total_days} Days</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold m-0">{city} <span className="text-[#FF8A65]">Explorer</span></h1>
              <p className="text-xs text-white/60 max-w-lg m-0 leading-relaxed">{trip_summary}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/10 text-center shrink-0">
              <p className="text-3xl font-extrabold text-[#FF8A65] m-0">{overall_authenticity}%</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-white/50 m-0">Authenticity</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5 mt-5 pt-4 border-t border-white/10">
            <div className="flex items-center gap-1.5 bg-white/8 rounded-lg px-3 py-1.5 text-[10px] font-bold"><MapPin size={11} className="text-[#FF8A65]" /> {totalStops} Places</div>
            <div className="flex items-center gap-1.5 bg-white/8 rounded-lg px-3 py-1.5 text-[10px] font-bold"><Coffee size={11} className="text-[#FF8A65]" /> {totalCafes} Cafes</div>
            <div className="flex items-center gap-1.5 bg-white/8 rounded-lg px-3 py-1.5 text-[10px] font-bold"><Navigation size={11} className="text-[#FF8A65]" /> {totalSpots} Spots</div>
            <div className="flex items-center gap-1.5 bg-white/8 rounded-lg px-3 py-1.5 text-[10px] font-bold"><DollarSign size={11} className="text-[#FF8A65]" /> ${budget}/day</div>
          </div>
        </div>
      </div>

      {/* ─── Day Tabs ─── */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {itinDays.map((day, i) => (
          <button key={i} onClick={() => setActiveDay(i)}
            className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 ${
              activeDay === i ? 'bg-[#D85A38] text-white border-[#D85A38] shadow-md shadow-[#D85A38]/20' : 'bg-white text-[#4F5E59] border-transparent hover:border-[#D85A38]/20'
            }`}>
            Day {day.day_number}
            <span className="block text-[9px] font-medium mt-0.5 opacity-80">{day.theme}</span>
          </button>
        ))}
      </div>

      {/* ─── Regions for current day ─── */}
      <div className="space-y-6">
        {currentDay.regions.map((region, ri) => (
          <div key={ri} className="space-y-4">
            {/* Region Header */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D85A38]/10 flex items-center justify-center text-[#D85A38] shrink-0 mt-0.5">
                <Map size={18} />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-extrabold text-[#1C2D27] m-0">{region.name}</h2>
                <p className="text-xs text-[#4F5E59] m-0 mt-0.5">{region.description}</p>
                {region.region_tip && (
                  <div className="flex items-start gap-1.5 mt-2 bg-[#FF8A65]/8 rounded-lg px-3 py-2 text-[10px] text-[#D85A38]">
                    <Lightbulb size={11} className="shrink-0 mt-0.5" /> {region.region_tip}
                  </div>
                )}
              </div>
            </div>

            {/* Stops in this region */}
            <div className="space-y-3 ml-2 pl-4 border-l-2 border-[#D85A38]/10">
              {region.stops.map((stop, si) => {
                const key = `${activeDay}-${ri}-${si}`
                const open = expandedStop === key
                return (
                  <div key={si} className="bg-white rounded-2xl border border-[#E2ECE9] overflow-hidden hover:shadow-md transition-all">
                    {/* Stop Header */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-3 flex-1 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-[#F5F7F2] flex items-center justify-center text-xl shrink-0">{stop.emoji}</div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-extrabold text-[#1C2D27] m-0">{stop.title}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className="text-[9px] font-bold text-[#D85A38] bg-[#D85A38]/8 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <Clock size={8} /> {stop.time}–{stop.end_time}
                              </span>
                              <span className="text-[9px] text-[#4F5E59] flex items-center gap-0.5"><MapPin size={8} /> {stop.place.name}</span>
                              {stop.cost_estimate && (
                                <span className="text-[9px] font-bold text-[#2A9D8F] bg-[#2A9D8F]/8 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                  <DollarSign size={8} /> {stop.cost_estimate}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white ${stop.place.authenticity_score >= 95 ? 'bg-[#2A9D8F]' : stop.place.authenticity_score >= 90 ? 'bg-[#D85A38]' : 'bg-[#4F5E59]'}`}>
                            {stop.place.authenticity_score}%
                          </span>
                          <button onClick={() => handleSave(stop)} className="text-[9px] text-[#D85A38] hover:underline flex items-center gap-0.5 cursor-pointer bg-transparent border-0 p-0"><Bookmark size={9} /> Save</button>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#4F5E59] m-0 mt-2 leading-relaxed">{stop.description}</p>

                      {/* Quick info badges */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <button onClick={() => toggleStop(key)} className="text-[10px] font-bold text-[#D85A38] flex items-center gap-1 cursor-pointer bg-[#D85A38]/5 hover:bg-[#D85A38]/10 px-2.5 py-1 rounded-lg border-0 transition-colors">
                          <Coffee size={10} /> {stop.nearby_cafes.length} Cafes {open ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                        </button>
                        <button onClick={() => toggleStop(key)} className="text-[10px] font-bold text-[#1C2D27] flex items-center gap-1 cursor-pointer bg-[#F5F7F2] hover:bg-[#E2ECE9] px-2.5 py-1 rounded-lg border-0 transition-colors">
                          <Navigation size={10} /> {stop.nearby_spots.length} Spots
                        </button>
                        <button onClick={() => toggleStop(key)} className="text-[10px] font-bold text-[#E91E63] flex items-center gap-1 cursor-pointer bg-[#E91E63]/5 hover:bg-[#E91E63]/10 px-2.5 py-1 rounded-lg border-0 transition-colors">
                          <UtensilsCrossed size={10} /> {stop.cultural_food.length} Dishes
                        </button>
                      </div>
                    </div>

                    {/* ─── Expanded Details ─── */}
                    {open && (
                      <div className="px-4 pb-4 space-y-4 border-t border-[#E2ECE9] pt-4 animate-in slide-in-from-top-1 duration-200">
                        {/* Place details */}
                        <div className="bg-[#F5F7F2] rounded-xl p-3 space-y-1.5">
                          <p className="text-[10px] text-[#4F5E59] m-0 italic"><strong className="not-italic text-[#1C2D27]">Why special:</strong> {stop.place.description}</p>
                          <div className="flex flex-wrap gap-3 text-[9px] text-[#4F5E59]">
                            {stop.place.address && <span className="flex items-center gap-0.5"><MapPin size={8} /> {stop.place.address}</span>}
                            {stop.place.opening_hours && <span className="flex items-center gap-0.5"><Clock size={8} /> {stop.place.opening_hours}</span>}
                            {stop.place.tip && <span className="flex items-center gap-0.5"><Lightbulb size={8} className="text-[#D85A38]" /> {stop.place.tip}</span>}
                          </div>
                        </div>

                        {/* Nearby Cafes */}
                        {stop.nearby_cafes.length > 0 && (
                          <div>
                            <h4 className="text-[10px] font-extrabold text-[#1C2D27] uppercase tracking-wider flex items-center gap-1.5 m-0 mb-2"><Coffee size={12} className="text-[#D85A38]" /> Nearby Cafes</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {stop.nearby_cafes.map((c, ci) => (
                                <div key={ci} className="bg-[#F5F7F2] rounded-xl p-3 border border-[#D85A38]/8 hover:border-[#D85A38]/25 transition-colors">
                                  <div className="flex justify-between items-start gap-2">
                                    <div>
                                      <p className="text-[11px] font-bold text-[#1C2D27] m-0">{c.name}</p>
                                      <p className="text-[9px] text-[#D85A38] font-semibold m-0">{c.specialty || c.type}</p>
                                    </div>
                                    <span className="text-[8px] font-bold text-[#4F5E59] bg-white px-1.5 py-0.5 rounded shrink-0">{c.walking_distance}</span>
                                  </div>
                                  {c.description && <p className="text-[9px] text-[#4F5E59] m-0 mt-1">{c.description}</p>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Nearby Spots */}
                        {stop.nearby_spots.length > 0 && (
                          <div>
                            <h4 className="text-[10px] font-extrabold text-[#1C2D27] uppercase tracking-wider flex items-center gap-1.5 m-0 mb-2"><Navigation size={12} className="text-[#1C2D27]" /> Nearby Spots</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {stop.nearby_spots.map((s, si) => (
                                <div key={si} className="bg-[#F5F7F2] rounded-xl p-3 border border-[#1C2D27]/5 hover:border-[#1C2D27]/15 transition-colors">
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-6 h-6 rounded-lg bg-[#D85A38]/10 flex items-center justify-center text-[#D85A38]">{spotIcon(s.type)}</div>
                                      <div>
                                        <p className="text-[11px] font-bold text-[#1C2D27] m-0">{s.name}</p>
                                        <p className="text-[8px] text-[#4F5E59] font-semibold uppercase m-0">{s.type}</p>
                                      </div>
                                    </div>
                                    <span className="text-[8px] font-bold text-[#4F5E59] bg-white px-1.5 py-0.5 rounded shrink-0">{s.walking_distance}</span>
                                  </div>
                                  {s.description && <p className="text-[9px] text-[#4F5E59] m-0 mt-1">{s.description}</p>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Cultural Food */}
                        {stop.cultural_food.length > 0 && (
                          <div>
                            <h4 className="text-[10px] font-extrabold text-[#1C2D27] uppercase tracking-wider flex items-center gap-1.5 m-0 mb-2"><UtensilsCrossed size={12} className="text-[#E91E63]" /> Cultural Food Must-Try</h4>
                            <div className="space-y-2">
                              {stop.cultural_food.map((f, fi) => (
                                <div key={fi} className="bg-gradient-to-r from-[#FFF0F0] to-white rounded-xl p-3 border border-[#E91E63]/8">
                                  <div className="flex items-start gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-[#E91E63]/10 flex items-center justify-center text-sm shrink-0">🍜</div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[11px] font-extrabold text-[#1C2D27] m-0">{f.dish}</p>
                                      <p className="text-[9px] text-[#4F5E59] m-0 mt-0.5">{f.description}</p>
                                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                                        <span className="text-[8px] text-[#D85A38] font-bold flex items-center gap-0.5"><MapPin size={7} /> {f.where_to_find}</span>
                                        <span className="text-[8px] text-[#E91E63] flex items-center gap-0.5"><Star size={7} /> {f.cultural_significance}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Travel Tips ─── */}
      {travel_tips && travel_tips.length > 0 && (
        <div className="bg-[#F5F7F2] rounded-2xl p-5 border border-[#E2ECE9]">
          <h3 className="text-xs font-extrabold text-[#1C2D27] uppercase tracking-wider flex items-center gap-1.5 m-0 mb-3"><Lightbulb size={14} className="text-[#D85A38]" /> Travel Tips</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {travel_tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-[10px] text-[#4F5E59]">
                <span className="w-5 h-5 rounded-full bg-[#D85A38]/10 text-[#D85A38] flex items-center justify-center text-[8px] font-extrabold shrink-0">{i + 1}</span>
                <span className="leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="text-center pb-4">
        <button onClick={() => setShowCreateModal(true)} className="bg-gradient-to-r from-[#D85A38] to-[#FF8A65] text-white font-bold text-xs px-6 py-3 rounded-xl inline-flex items-center gap-2 hover:shadow-lg hover:shadow-[#D85A38]/20 transition-all cursor-pointer border-0">
          <Sparkles size={14} /> Plan Another Trip
        </button>
      </div>
    </div>
  )
}

export default Itineraries
