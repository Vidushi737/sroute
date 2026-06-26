import React from 'react'
import { Bookmark, Star } from 'lucide-react'
import { useApp } from '../context/AppContext'

const SavedPlaces: React.FC = () => {
  const { bookmarks, setBookmarks } = useApp()

  const handleRemoveBookmark = (id: number) => {
    setBookmarks(prev => prev.filter(bm => bm.id !== id))
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {bookmarks.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 max-w-lg mx-auto bg-[#FFF0F0] border border-[#E91E63]/10 shadow-sm mt-12">
          <div className="w-16 h-16 rounded-full bg-[#E91E63]/10 flex items-center justify-center mx-auto text-[#E91E63]">
            <Bookmark size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#1e293b] m-0">No Saved Places Yet</h3>
          <p className="text-xs text-[#475569] m-0">
            Browse through itineraries or chat with the AI co-pilot, then click "Save" on any location to build your collections.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {bookmarks.map(bm => (
            <div key={bm.id} className="glass-panel p-5 rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow bg-[#FFF0F0] border border-[#E91E63]/10 shadow-sm">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] uppercase font-bold text-[#E91E63] bg-[#E91E63]/10 px-1.5 py-0.5 rounded">
                    {bm.category}
                  </span>
                  <span className="text-xs font-bold text-[#22C55E] flex items-center gap-0.5">
                    <Star size={12} className="fill-[#22C55E]" />
                    {bm.score}% Auth
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#1E293B] m-0 pt-1">{bm.name}</h3>
                <p className="text-[10px] text-[#475569] m-0">{bm.address}</p>
              </div>
              
              <div className="flex justify-between items-center mt-6 pt-2 border-t border-[#E91E63]/5">
                <div className="flex flex-wrap gap-1.5">
                  {bm.tags.map((t, idx) => (
                    <span key={idx} className="text-[9px] bg-[#FFF0F0] border border-[#E91E63]/10 px-1.5 py-0.5 rounded text-[#475569]">
                      {t}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => handleRemoveBookmark(bm.id)}
                  className="text-[10px] text-[#FF5252] hover:underline bg-transparent border-0 p-0 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SavedPlaces
