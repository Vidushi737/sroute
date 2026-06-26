import React, { useState } from 'react'
import { Sparkles, Save, ShieldAlert } from 'lucide-react'
import { useApp } from '../context/AppContext'

const Profile: React.FC = () => {
  const { 
    style, 
    setStyle, 
    budget, 
    setBudget, 
    preferences, 
    setPreferences 
  } = useApp()

  const [saved, setSaved] = useState(false)
  const [excludedCategories, setExcludedCategories] = useState([
    'Shopping Malls', 
    'Global Fast Food'
  ])
  const [newExclusion, setNewExclusion] = useState('')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleAddExclusion = () => {
    if (newExclusion.trim() && !excludedCategories.includes(newExclusion.trim())) {
      setExcludedCategories(prev => [...prev, newExclusion.trim()])
      setNewExclusion('')
    }
  }

  const handleRemoveExclusion = (cat: string) => {
    setExcludedCategories(prev => prev.filter(c => c !== cat))
  }

  return (
    <div className="glass-panel p-6 rounded-2xl max-w-2xl mx-auto bg-[#FFF0F0] border border-[#E91E63]/10 shadow-sm animate-in fade-in duration-200 space-y-6">
      <h3 className="text-sm font-bold text-[#1e293b] border-b border-[#E91E63]/10 pb-3 m-0">My Travel Preferences</h3>
      
      {saved && (
        <div className="bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] text-xs p-3.5 rounded-xl flex items-center gap-2">
          <span>✓ Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#475569] uppercase">Travel Style</label>
            <select 
              value={style} 
              onChange={e => setStyle(e.target.value)}
              className="w-full bg-[#FFF0F0] border border-[#E91E63]/15 rounded-xl p-3 text-xs focus:outline-none focus:border-[#E91E63]"
            >
              <option value="cultural-adventure">Cultural Adventure & History</option>
              <option value="culinary-foodie">Street Food & Cuisine Hunt</option>
              <option value="budget-backpacker">Minimalist Budget Traveler</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#475569] uppercase">Default Budget Limit</label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-xs text-[#475569] font-semibold">$</span>
              <input 
                type="number" 
                value={budget} 
                onChange={e => setBudget(parseInt(e.target.value) || 0)}
                className="w-full bg-[#FFF0F0] border border-[#E91E63]/15 rounded-xl pl-6 pr-3 py-3 text-xs focus:outline-none focus:border-[#E91E63]" 
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-[#475569] uppercase">Default Keywords</label>
          <input 
            type="text" 
            value={preferences} 
            onChange={e => setPreferences(e.target.value)}
            placeholder="e.g. vintage shops, quiet temples, coffee alleys"
            className="w-full bg-[#FFF0F0] border border-[#E91E63]/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#E91E63]" 
          />
        </div>

        {/* Excluded Categories */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-[#475569] uppercase flex items-center gap-1">
            <ShieldAlert size={12} className="text-[#FF5252]" />
            <span>Excluded Categories (Red Flags)</span>
          </label>
          
          <div className="flex flex-wrap gap-2">
            {excludedCategories.map(cat => (
              <span 
                key={cat} 
                className="text-[10px] bg-[#FF5252]/10 text-[#FF5252] border border-[#FF5252]/20 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1"
              >
                <span>{cat}</span>
                <button 
                  type="button" 
                  onClick={() => handleRemoveExclusion(cat)}
                  className="hover:text-[#FF5252]/80 font-bold ml-1 bg-transparent border-0 cursor-pointer text-[10px] p-0"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 max-w-xs mt-2">
            <input 
              type="text" 
              placeholder="e.g. fast food, shopping malls" 
              value={newExclusion}
              onChange={e => setNewExclusion(e.target.value)}
              className="flex-1 bg-[#FFF0F0] border border-[#E91E63]/15 rounded-xl px-3 py-2 text-xs focus:outline-none"
            />
            <button 
              type="button" 
              onClick={handleAddExclusion}
              className="bg-[#1e293b] text-white text-xs px-3.5 rounded-xl hover:bg-[#1e293b]/90 border-0 cursor-pointer font-semibold"
            >
              Add
            </button>
          </div>
        </div>
        
        <button 
          type="submit"
          className="bg-gradient-premium text-white text-xs font-semibold py-2.5 px-4 rounded-xl cursor-pointer hover:shadow-md transition-shadow border-0 flex items-center gap-1.5"
        >
          <Save size={14} />
          <span>Save Preferences</span>
        </button>
      </form>
    </div>
  )
}

export default Profile
