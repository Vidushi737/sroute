import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Compass,
  Sparkles,
  MapPin,
  Coffee,
  UtensilsCrossed,
  Globe,
  ArrowRight,
  Map,
  MessageCircle,
  Route,
  Shield,
  Star,
  ChevronRight,
  Camera,
  Heart
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { setShowCreateModal, previousTrips, generatedItinerary } = useApp()

  // Build list of visited cities from trip history + current itinerary
  const visitedCities = React.useMemo(() => {
    const cityMap: Record<string, { days: number; budget: number; score: number; date: string }> = {}
    previousTrips.forEach(t => {
      const cityName = t.title.split(' \u2014 ')[0] || t.title
      if (!cityMap[cityName]) {
        cityMap[cityName] = { days: t.days, budget: t.budget, score: t.score, date: t.date }
      }
    })
    if (generatedItinerary && !cityMap[generatedItinerary.city]) {
      cityMap[generatedItinerary.city] = {
        days: generatedItinerary.total_days,
        budget: generatedItinerary.budget_per_day,
        score: generatedItinerary.overall_authenticity,
        date: 'Just now'
      }
    }
    return Object.entries(cityMap).map(([city, info]) => ({ city, ...info }))
  }, [previousTrips, generatedItinerary])

  return (
    <div className="w-full min-h-full -m-8 pb-12">
      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[520px] flex items-center overflow-hidden rounded-b-[40px]">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1C2D27] via-[#243D33] to-[#1A3A2E]" />

        {/* Animated decorative blobs */}
        <div className="absolute top-10 right-20 w-72 h-72 bg-[#D85A38]/15 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-[#2A9D8F]/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-[#E98B73]/10 rounded-full blur-2xl animate-float-slow pointer-events-none" />

        {/* Floating decorative icons */}
        <div className="absolute top-16 right-32 text-white/10 animate-float">
          <Globe size={48} />
        </div>
        <div className="absolute bottom-24 right-48 text-white/8 animate-float-reverse">
          <Compass size={36} />
        </div>
        <div className="absolute top-32 left-20 text-white/6 animate-float-slow">
          <MapPin size={28} />
        </div>
        <div className="absolute bottom-36 left-40 text-white/5 animate-float">
          <Camera size={24} />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }} />

        {/* Hero Content */}
        <div className="relative z-10 px-12 py-16 max-w-3xl">
          <div className="animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#D85A38] flex items-center justify-center shadow-lg shadow-[#D85A38]/30">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-white/50 text-xs font-semibold uppercase tracking-[0.25em]">AI Travel Planner</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-[1.15] mb-5 font-serif-mockup animate-fade-up" style={{ animationDelay: '0.25s', opacity: 0 }}>
            Discover the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E98B73] to-[#D85A38]">real</span>
            {' '}city,<br />not the tourist version.
          </h1>

          <p className="text-base text-white/60 leading-relaxed max-w-lg mb-8 animate-fade-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
            AI-powered itineraries organized by region, with hidden cafes, local food,
            and authentic spots that tourists never find. Escape the traps.
          </p>

          <div className="flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: '0.55s', opacity: 0 }}>
            <button
              onClick={() => setShowCreateModal(true)}
              className="group bg-gradient-to-r from-[#D85A38] to-[#E76F51] text-white font-semibold text-sm px-7 py-3.5 rounded-2xl flex items-center gap-2 hover:shadow-xl hover:shadow-[#D85A38]/25 hover:-translate-y-1 transition-all duration-300 cursor-pointer border-0"
            >
              <Sparkles size={16} />
              <span>Plan a Trip</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/copilot')}
              className="group bg-white/10 backdrop-blur-sm text-white font-semibold text-sm px-7 py-3.5 rounded-2xl flex items-center gap-2 hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer border border-white/10"
            >
              <MessageCircle size={16} />
              <span>Ask AI Co-pilot</span>
            </button>
          </div>

          {/* Floating stats */}
          <div className="flex gap-8 mt-10 animate-fade-up" style={{ animationDelay: '0.7s', opacity: 0 }}>
            {[
              { value: '94%', label: 'Authenticity' },
              { value: '50+', label: 'Cities' },
              { value: 'Free', label: 'Forever' }
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right side decorative compass */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none hidden lg:block">
          <div className="animate-spin-slow">
            <Compass size={280} strokeWidth={0.5} />
          </div>
        </div>
      </section>

      {/* ─── Feature Cards Section ─── */}
      <section className="px-12 pt-12">
        <div className="text-center mb-10">
          <p className="text-xs font-bold text-[#D85A38] uppercase tracking-[0.2em] mb-2">Core Features</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1C2D27] font-serif-mockup">
            Everything you need to travel smart
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* AI Itineraries Card */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="group relative text-left bg-white rounded-3xl p-8 border border-[#E2ECE9] hover:border-[#D85A38]/30 hover:shadow-2xl hover:shadow-[#D85A38]/8 hover:-translate-y-2 transition-all duration-400 cursor-pointer overflow-hidden"
          >
            {/* Background glow on hover */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#D85A38]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D85A38] to-[#E76F51] flex items-center justify-center mb-6 shadow-lg shadow-[#D85A38]/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-400">
                <Route size={28} className="text-white" />
              </div>

              <h3 className="text-xl font-bold text-[#1C2D27] mb-2 font-serif-mockup group-hover:text-[#D85A38] transition-colors">
                AI Itineraries
              </h3>
              <p className="text-sm text-[#4F5E59] leading-relaxed mb-6">
                Generate complete region-wise travel plans with nearby cafes,
                hidden viewpoints, local markets, and cultural food spots.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['Region-wise', 'Real Places', 'Cultural Food', 'Nearby Cafes'].map((f) => (
                  <span key={f} className="px-3 py-1 rounded-full bg-[#EAF0EE] text-[10px] font-bold text-[#1C2D27]">
                    {f}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1.5 text-[#D85A38] text-sm font-semibold group-hover:gap-3 transition-all">
                <span>Generate a plan</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </button>

          {/* AI Co-pilot Card */}
          <button
            onClick={() => navigate('/copilot')}
            className="group relative text-left bg-white rounded-3xl p-8 border border-[#E2ECE9] hover:border-[#2A9D8F]/30 hover:shadow-2xl hover:shadow-[#2A9D8F]/8 hover:-translate-y-2 transition-all duration-400 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#2A9D8F]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2A9D8F] to-[#1C8C7E] flex items-center justify-center mb-6 shadow-lg shadow-[#2A9D8F]/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-400">
                <Sparkles size={28} className="text-white" />
              </div>

              <h3 className="text-xl font-bold text-[#1C2D27] mb-2 font-serif-mockup group-hover:text-[#2A9D8F] transition-colors">
                AI Co-pilot
              </h3>
              <p className="text-sm text-[#4F5E59] leading-relaxed mb-6">
                Chat with your personal travel assistant. Ask about any city,
                get instant recommendations, tips, and insider knowledge.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {['Instant Answers', 'Travel Tips', 'Local Secrets', '24/7 Available'].map((f) => (
                  <span key={f} className="px-3 py-1 rounded-full bg-[#EAF0EE] text-[10px] font-bold text-[#1C2D27]">
                    {f}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1.5 text-[#2A9D8F] text-sm font-semibold group-hover:gap-3 transition-all">
                <span>Start chatting</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="px-12 pt-16">
        <div className="text-center mb-10">
          <p className="text-xs font-bold text-[#D85A38] uppercase tracking-[0.2em] mb-2">How It Works</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1C2D27] font-serif-mockup">
            Three steps to your perfect trip
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              step: '01',
              icon: MapPin,
              color: '#D85A38',
              title: 'Tell us where',
              desc: 'Enter your destination city, number of days, and budget. That\'s all we need.'
            },
            {
              step: '02',
              icon: Sparkles,
              color: '#2A9D8F',
              title: 'AI builds your plan',
              desc: 'Our AI generates a region-wise itinerary with real places, cafes, and cultural experiences.'
            },
            {
              step: '03',
              icon: Heart,
              color: '#E76F51',
              title: 'Explore & enjoy',
              desc: 'Browse nearby spots, discover local food, and navigate with confidence. No tourist traps.'
            }
          ].map((item, idx) => (
            <div
              key={item.step}
              className="group bg-white rounded-2xl p-6 border border-[#E2ECE9] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative"
              style={{ animationDelay: `${idx * 0.15}s` }}
            >
              {/* Step number */}
              <span className="text-6xl font-black text-[#EAF0EE] absolute top-4 right-5 select-none group-hover:text-[#D85A38]/10 transition-colors">
                {item.step}
              </span>

              <div className="relative z-10">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${item.color}12`, boxShadow: `0 4px 12px ${item.color}15` }}
                >
                  <item.icon size={22} style={{ color: item.color }} />
                </div>

                <h3 className="text-base font-bold text-[#1C2D27] mb-2 font-serif-mockup">{item.title}</h3>
                <p className="text-sm text-[#4F5E59] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── What You Get Section ─── */}
      <section className="px-12 pt-16">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#1C2D27] to-[#2A4A3E] rounded-3xl p-10 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-6 right-8 text-white/5 animate-float-slow">
            <Compass size={100} strokeWidth={0.5} />
          </div>
          <div className="absolute bottom-4 left-8 text-white/5 animate-float">
            <Globe size={60} strokeWidth={0.5} />
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white font-serif-mockup mb-8">
              Every itinerary includes
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Map, title: 'Region-wise Plan', desc: 'Organized by neighborhoods' },
                { icon: Coffee, title: 'Nearby Cafes', desc: 'Real cafes with specialties' },
                { icon: UtensilsCrossed, title: 'Cultural Food', desc: 'Local dishes & where to eat' },
                { icon: Shield, title: 'Authenticity Score', desc: 'Verified real, not tourist traps' }
              ].map((item) => (
                <div key={item.title} className="bg-white/8 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/12 hover:-translate-y-1 transition-all duration-300">
                  <item.icon size={22} className="text-[#E98B73] mb-3" />
                  <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-xs text-white/50">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Your Trips / Recent Destinations ─── */}
      <section className="px-12 pt-16 pb-8">
        {visitedCities.length > 0 ? (
          <>
            <div className="text-center mb-8">
              <p className="text-xs font-bold text-[#D85A38] uppercase tracking-[0.2em] mb-2">Your Trips</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C2D27] font-serif-mockup">
                Cities you've planned
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {visitedCities.map((trip) => (
                <div
                  key={trip.city}
                  className="group bg-white rounded-2xl p-5 border border-[#E2ECE9] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#D85A38]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-[#1C2D27] group-hover:text-[#D85A38] transition-colors">{trip.city}</h4>
                      <p className="text-[10px] text-[#4F5E59] mt-0.5">{trip.days} days · ${trip.budget || '—'}/day</p>
                    </div>
                    <div className="flex items-center gap-1 bg-[#2A9D8F]/10 px-2 py-1 rounded-lg">
                      <Shield size={10} className="text-[#2A9D8F]" />
                      <span className="text-[10px] font-bold text-[#2A9D8F]">{trip.score}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-[10px] text-[#4F5E59]/60">{trip.date}</p>
                    <button
                      onClick={() => navigate('/itineraries')}
                      className="text-[10px] font-semibold text-[#D85A38] flex items-center gap-0.5 hover:gap-1.5 transition-all bg-transparent border-0 cursor-pointer p-0"
                    >
                      View plan <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="max-w-lg mx-auto text-center bg-white rounded-2xl p-8 border border-[#E2ECE9]">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF0EE] flex items-center justify-center mx-auto mb-4">
              <Map size={24} className="text-[#D85A38]" />
            </div>
            <h3 className="text-base font-bold text-[#1C2D27] mb-2 font-serif-mockup">No trips yet</h3>
            <p className="text-sm text-[#4F5E59] mb-5">Generate your first AI itinerary and your planned cities will appear here.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D85A38] to-[#E76F51] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-[#D85A38]/20 hover:-translate-y-0.5 transition-all cursor-pointer border-0"
            >
              <Sparkles size={14} />
              <span>Create your first plan</span>
            </button>
          </div>
        )}
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="px-12 pt-8">
        <div className="max-w-3xl mx-auto text-center">
          <button
            onClick={() => setShowCreateModal(true)}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#D85A38] to-[#E76F51] text-white font-bold text-base px-10 py-4 rounded-2xl hover:shadow-2xl hover:shadow-[#D85A38]/25 hover:-translate-y-1 transition-all duration-300 cursor-pointer border-0"
          >
            <Sparkles size={20} />
            <span>Start Your Adventure</span>
            <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
          </button>
          <p className="text-xs text-[#4F5E59]/50 mt-4">Free forever · No credit card · AI-powered</p>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
