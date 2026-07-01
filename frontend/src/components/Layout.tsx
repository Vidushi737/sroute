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
    <div className="flex min-h-screen bg-[#EAF0EE]">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white/65 backdrop-blur-md border-r border-[#D85A38]/8 flex flex-col justify-between p-6 shrink-0 z-20">
        <div>
          {/* Logo brand */}
          <Link to="/" className="flex items-center gap-2 mb-8 px-2 no-underline">
            <div className="w-8 h-8 rounded-lg bg-gradient-premium flex items-center justify-center text-white font-bold shadow-md shadow-[#D85A38]/20">S</div>
            <span className="text-xl font-bold tracking-tight text-[#1C2D27]">Sroute</span>
            <span className="text-[10px] uppercase font-semibold bg-[#D85A38]/10 text-[#D85A38] px-1.5 py-0.5 rounded ml-1">AI</span>
          </Link>

          {/* Nav List */}
          <nav className="space-y-1">
            <NavLink 
              to="/dashboard"
              className={({ isActive }) => 
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all no-underline ${
                  isActive ? 'bg-[#D85A38]/10 text-[#D85A38]' : 'text-[#4F5E59] hover:bg-[#D85A38]/5'
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
                  isActive ? 'bg-[#D85A38]/10 text-[#D85A38]' : 'text-[#4F5E59] hover:bg-[#D85A38]/5'
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
                  isActive ? 'bg-[#D85A38]/10 text-[#D85A38]' : 'text-[#4F5E59] hover:bg-[#D85A38]/5'
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
                  isActive ? 'bg-[#D85A38]/10 text-[#D85A38]' : 'text-[#4F5E59] hover:bg-[#D85A38]/5'
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
                  isActive ? 'bg-[#D85A38]/10 text-[#D85A38]' : 'text-[#4F5E59] hover:bg-[#D85A38]/5'
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
                  isActive ? 'bg-[#D85A38]/10 text-[#D85A38]' : 'text-[#4F5E59] hover:bg-[#D85A38]/5'
                }`
              }
            >
              <User size={18} />
              <span>Preferences</span>
            </NavLink>
          </nav>
        </div>

        {/* User Card */}
        <div className="border-t border-[#D85A38]/8 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#D85A38] overflow-hidden bg-gradient-premium text-white flex items-center justify-center font-semibold">
              EX
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1C2D27]">Alex Rivera</p>
              <p className="text-[10px] text-[#4F5E59]">alex@gmail.com</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="text-[#4F5E59] hover:text-[#D85A38] transition-colors p-1 rounded-lg border-0 bg-transparent cursor-pointer"
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
            <h1 className="text-2xl font-bold tracking-tight text-[#1C2D27] m-0 font-serif-mockup">
              {getPageTitle()}
            </h1>
            <p className="text-xs text-[#4F5E59] m-0 mt-1">Sroute – Escape tourist traps, discover real places.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 text-[#4F5E59]" size={16} />
              <input 
                type="text" 
                placeholder="Search spots, destinations..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white/60 border border-[#D85A38]/12 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#D85A38] focus:ring-1 focus:ring-[#D85A38]/30 transition-all backdrop-blur-sm"
              />
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-premium text-white font-medium text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 hover:shadow-lg hover:shadow-[#D85A38]/20 hover:-translate-y-0.5 transition-all cursor-pointer border-0"
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
        <div className="fixed inset-0 bg-[#1C2D27]/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 relative animate-in fade-in zoom-in-95 duration-155 bg-white/90 shadow-xl border border-[#D85A38]/10">
            <h3 className="text-base font-bold text-[#1C2D27] mb-4 m-0 font-serif-mockup">Build Authentic Plan</h3>
            
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#4F5E59] uppercase">Destination City</label>
                <input 
                  type="text" 
                  value={destination} 
                  onChange={e => setDestination(e.target.value)}
                  placeholder="e.g. Paris, Tokyo, Barcelona"
                  required
                  className="w-full bg-[#EAF0EE]/50 border border-[#D85A38]/15 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#D85A38] focus:ring-1 focus:ring-[#D85A38]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#4F5E59] uppercase">Duration (Days)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="14"
                    value={days} 
                    onChange={e => setDays(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#EAF0EE]/50 border border-[#D85A38]/15 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#D85A38] focus:ring-1 focus:ring-[#D85A38]/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#4F5E59] uppercase">Daily Budget ($)</label>
                  <input 
                    type="number" 
                    value={budget} 
                    onChange={e => setBudget(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#EAF0EE]/50 border border-[#D85A38]/15 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#D85A38] focus:ring-1 focus:ring-[#D85A38]/20"
                  />
                </div>
              </div>

              <p className="text-[10px] text-[#4F5E59] italic m-0">AI will organize your trip by region with nearby cafes, spots, and cultural food.</p>

              <div className="flex gap-3 justify-end pt-4">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-[#D85A38]/12 text-[#4F5E59] bg-transparent rounded-xl text-xs hover:bg-[#EAF0EE]/50 cursor-pointer"
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
