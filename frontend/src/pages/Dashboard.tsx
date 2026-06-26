import React from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, ChevronRight } from 'lucide-react'
import { useApp } from '../context/AppContext'

const Dashboard: React.FC = () => {
  const { previousTrips, setShowCreateModal } = useApp()
  const navigate = useNavigate()

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between bg-white/50 border border-[#E91E63]/8 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-[#475569] tracking-wider">Trips Engineered</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-[#1E293B]">4</span>
            <span className="text-xs text-[#22C55E] flex items-center font-medium">+1 new</span>
          </div>
        </div>
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between bg-white/50 border border-[#E91E63]/8 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-[#475569] tracking-wider">Avg Authenticity</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-[#1e293b]">94.2%</span>
            <span className="text-xs bg-[#22C55E]/10 text-[#22C55E] px-1.5 py-0.5 rounded font-semibold flex items-center gap-0.5">
              <TrendingUp size={10} /> Ultra
            </span>
          </div>
        </div>
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between bg-white/50 border border-[#E91E63]/8 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-[#475569] tracking-wider">Hidden Gems Discovered</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-[#1E293B]">18</span>
            <span className="text-xs text-[#E91E63] font-medium">PostGIS verified</span>
          </div>
        </div>
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between bg-white/50 border border-[#E91E63]/8 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-[#475569] tracking-wider">Commercial Traps Avoided</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-[#FF5252]">12</span>
            <span className="text-xs text-[#FF5252] font-medium">- $340 saved</span>
          </div>
        </div>
      </div>

      {/* Quick Actions and Upcoming Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Welcome Card */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl bg-gradient-glow relative overflow-hidden bg-white/50 border border-[#E91E63]/8 shadow-sm flex flex-col justify-between">
          <div className="relative z-10 space-y-3">
            <span className="bg-[#E91E63]/10 text-[#E91E63] text-[10px] uppercase font-bold px-2 py-1 rounded">Sroute AI Engine</span>
            <h3 className="text-xl font-bold text-[#1E293B] m-0">Ready to design your next detour?</h3>
            <p className="text-xs text-[#475569] max-w-md m-0">
              Our AI filters out overcommercialized tourist sites, crafting paths focused on deep local heritage.
            </p>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-[#1e293b] text-white font-medium text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-[#1e293b]/90 transition-all cursor-pointer border-0 shadow-sm"
            >
              <span>Compute Itinerary</span>
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="absolute right-4 bottom-4 w-32 h-32 bg-[#E91E63]/8 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Right Column: Weather */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between bg-white/50 border border-[#E91E63]/8 shadow-sm">
          <h4 className="text-sm font-bold text-[#1E293B] m-0">Destination Forecast</h4>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-2xl font-bold text-[#1e293b] m-0">24°C</p>
              <p className="text-[10px] text-[#475569] m-0 mt-1">Partly Cloudy - Calm wind</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#FF8A65]/10 flex items-center justify-center text-xl">☀️</div>
          </div>
          <p className="text-[10px] text-[#475569] border-t border-[#E91E63]/8 pt-2 m-0">
            Tip: Perfect weather for exploring outdoor cultural landmarks.
          </p>
        </div>
      </div>

      {/* List Previous / Active Trips */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#1E293B] m-0">Saved Adventures</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {previousTrips.map(trip => (
            <div key={trip.id} className="glass-panel rounded-2xl overflow-hidden flex hover:shadow-md transition-shadow bg-white/50 border border-[#E91E63]/8 shadow-sm">
              <img src={trip.image} alt={trip.title} className="w-24 object-cover" />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-semibold text-[#1e293b] m-0">{trip.title}</h4>
                    <span className="text-[10px] font-bold bg-[#E91E63]/10 text-[#E91E63] px-1.5 py-0.5 rounded">{trip.score}% Auth</span>
                  </div>
                  <p className="text-[10px] text-[#475569] mt-1 m-0">{trip.days} Days • Budget ${trip.budget}/day</p>
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#475569] mt-2">
                  <span>Planned {trip.date}</span>
                  <button 
                    onClick={() => navigate('/itineraries')}
                    className="text-[#E91E63] font-semibold hover:underline bg-transparent border-0 p-0 cursor-pointer"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
