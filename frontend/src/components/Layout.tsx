import React from 'react'
import { NavLink, Link, useNavigate, useLocation, Outlet } from 'react-router-dom'
import { 
  Home, 
  Compass, 
  Sparkles, 
  Bookmark, 
  BarChart3, 
  User, 
  LogOut, 
  Search, 
  Plus, 
  Loader2 
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const Layout: React.FC = () => {
  const {
    showCreateModal,
    setShowCreateModal,
    destination,
    setDestination,
    days,
    setDays,
    budget,
    setBudget,
    style,
    setStyle,
    preferences,
    setPreferences,
    isGenerating,
    handleGenerate,
    searchQuery,
    setSearchQuery
  } = useApp()

  const navigate = useNavigate()
  const location = useLocation()

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard Console'
      case '/itineraries':
        return 'AI Route Itineraries'
      case '/copilot':
        return 'AI Co-pilot Chat'
      case '/saved':
        return 'Saved Collections'
      case '/analytics':
        return 'Authentic Metrics'
      case '/profile':
        return 'Travel Style Settings'
      default:
        return 'Sroute Console'
    }
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    await handleGenerate(e)
    navigate('/itineraries')
  }

  return (
    <div className="flex min-h-screen bg-[#FFF5F5]">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white/60 backdrop-blur-md border-r border-[#E91E63]/8 flex flex-col justify-between p-6 shrink-0 z-20">
        <div>
          {/* Logo brand */}
          <Link to="/" className="flex items-center gap-2 mb-8 px-2 no-underline">
            <div className="w-8 h-8 rounded-lg bg-gradient-premium flex items-center justify-center text-white font-bold shadow-md shadow-[#E91E63]/20">S</div>
            <span className="text-xl font-bold tracking-tight text-[#1E293B]">Sroute</span>
            <span className="text-[10px] uppercase font-semibold bg-[#E91E63]/10 text-[#E91E63] px-1.5 py-0.5 rounded ml-1">AI</span>
          </Link>

          {/* Nav List */}
          <nav className="space-y-1">
            <NavLink 
              to="/dashboard"
              className={({ isActive }) => 
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all no-underline ${
                  isActive ? 'bg-[#E91E63]/10 text-[#E91E63]' : 'text-[#475569] hover:bg-[#E91E63]/5'
                }`
              }
            >
              <Home size={18} />
              <span>Dashboard</span>
            </NavLink>
            
            <NavLink 
              to="/itineraries"
              className={({ isActive }) => 
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all no-underline ${
                  isActive ? 'bg-[#E91E63]/10 text-[#E91E63]' : 'text-[#475569] hover:bg-[#E91E63]/5'
                }`
              }
            >
              <Compass size={18} />
              <span>Itineraries</span>
            </NavLink>

            <NavLink 
              to="/copilot"
              className={({ isActive }) => 
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all no-underline ${
                  isActive ? 'bg-[#E91E63]/10 text-[#E91E63]' : 'text-[#475569] hover:bg-[#E91E63]/5'
                }`
              }
            >
              <Sparkles size={18} />
              <span>AI Co-Pilot</span>
            </NavLink>

            <NavLink 
              to="/saved"
              className={({ isActive }) => 
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all no-underline ${
                  isActive ? 'bg-[#E91E63]/10 text-[#E91E63]' : 'text-[#475569] hover:bg-[#E91E63]/5'
                }`
              }
            >
              <Bookmark size={18} />
              <span>Saved Places</span>
            </NavLink>

            <NavLink 
              to="/analytics"
              className={({ isActive }) => 
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all no-underline ${
                  isActive ? 'bg-[#E91E63]/10 text-[#E91E63]' : 'text-[#475569] hover:bg-[#E91E63]/5'
                }`
              }
            >
              <BarChart3 size={18} />
              <span>Analytics</span>
            </NavLink>

            <NavLink 
              to="/profile"
              className={({ isActive }) => 
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all no-underline ${
                  isActive ? 'bg-[#E91E63]/10 text-[#E91E63]' : 'text-[#475569] hover:bg-[#E91E63]/5'
                }`
              }
            >
              <User size={18} />
              <span>Preferences</span>
            </NavLink>
          </nav>
        </div>

        {/* User Card */}
        <div className="border-t border-[#E91E63]/8 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#E91E63] overflow-hidden bg-gradient-premium text-white flex items-center justify-center font-semibold">
              EX
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1E293B]">Alex Rivera</p>
              <p className="text-[10px] text-[#475569]">alex@gmail.com</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="text-[#475569] hover:text-[#E91E63] transition-colors p-1 rounded-lg border-0 bg-transparent cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Console Workspace */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header toolbar */}
        <header className="flex justify-between items-center p-8 pb-4 bg-transparent">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1E293B] m-0">
              {getPageTitle()}
            </h1>
            <p className="text-xs text-[#475569] m-0 mt-1">Sroute – Escape tourist traps, discover real places.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 text-[#475569]" size={16} />
              <input 
                type="text" 
                placeholder="Search spots, destinations..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white/60 border border-[#E91E63]/12 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63]/30 transition-all backdrop-blur-sm"
              />
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-premium text-white font-medium text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 hover:shadow-lg hover:shadow-[#E91E63]/20 hover:-translate-y-0.5 transition-all cursor-pointer border-0"
            >
              <Plus size={14} />
              <span>Create Plan</span>
            </button>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-8 pt-4 overflow-y-auto max-h-[calc(100vh-100px)] relative">
          <Outlet />
        </main>
      </div>

      {/* Modal: Create Itinerary */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-[#1E293B]/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 relative animate-in fade-in zoom-in-95 duration-155 bg-white/90 shadow-xl border border-[#E91E63]/10">
            <h3 className="text-base font-bold text-[#1E293B] mb-4 m-0">Build Authentic Plan</h3>
            
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#475569] uppercase">Destination City</label>
                <input 
                  type="text" 
                  value={destination} 
                  onChange={e => setDestination(e.target.value)}
                  placeholder="e.g. Paris, Tokyo, Barcelona"
                  required
                  className="w-full bg-[#FFF5F5] border border-[#E91E63]/15 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#475569] uppercase">Duration (Days)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="14"
                    value={days} 
                    onChange={e => setDays(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#FFF5F5] border border-[#E91E63]/15 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63]/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#475569] uppercase">Daily Budget ($)</label>
                  <input 
                    type="number" 
                    value={budget} 
                    onChange={e => setBudget(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#FFF5F5] border border-[#E91E63]/15 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63]/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#475569] uppercase">Travel Style</label>
                <select 
                  value={style} 
                  onChange={e => setStyle(e.target.value)}
                  className="w-full bg-[#FFF5F5] border border-[#E91E63]/15 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63]/20"
                >
                  <option value="cultural-adventure">Cultural & Local Heritage</option>
                  <option value="culinary-foodie">Gastronomy & Local Foodie</option>
                  <option value="budget-backpacker">Budget Backpacker</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#475569] uppercase">Keywords / Preferences (comma separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. quiet gardens, ramen counters, vintage shops"
                  value={preferences} 
                  onChange={e => setPreferences(e.target.value)}
                  className="w-full bg-[#FFF5F5] border border-[#E91E63]/15 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63]/20"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-[#E91E63]/12 text-[#475569] bg-transparent rounded-xl text-xs hover:bg-[#FFF5F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isGenerating}
                  className="bg-gradient-premium text-white font-medium text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 hover:shadow-md disabled:opacity-50 cursor-pointer border-0"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin" size={14} />
                      <span>Planning...</span>
                    </>
                  ) : (
                    <span>Generate Plan</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Layout
