import React, { useState } from 'react'
import { Sparkles, Send } from 'lucide-react'
import { useApp } from '../context/AppContext'

const AICopilot: React.FC = () => {
  const { chatMessages, setChatMessages } = useApp()
  const [chatInput, setChatInput] = useState('')

  const handleChatSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMsg = chatInput
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }])
    setChatInput('')

    // Generate responsive context-aware replies
    setTimeout(() => {
      let aiResponse = "I have updated the itinerary according to your suggestions. Let me know if you'd like to find nearby spots."
      const lower = userMsg.toLowerCase()
      if (lower.includes("budget") || lower.includes("cheap")) {
        aiResponse = "Got it! Swapping out the Ginza sushi selection for a traditional standing Soba counter in Shinjuku, saving you approximately $45 while increasing the overall Authenticity score to 97%."
      } else if (lower.includes("coffee") || lower.includes("cafe")) {
        aiResponse = "Recommendation: Try 'Kosoan' in Jiyugaoka. It's a 90-year-old traditional wooden teahouse serving matcha in a secret garden setting (Authenticity: 95.8%). Would you like to insert it as Day 2 morning?"
      } else if (lower.includes("ramen")) {
        aiResponse = "Certainly! You should try 'Ramen Haruka' in Akihabara. Simmered pork broth, zero English signs, almost entirely local diners. Authenticity Score is 96.4%."
      }
      setChatMessages(prev => [...prev, { sender: 'ai', text: aiResponse }])
    }, 800)
  }

  return (
    <div className="glass-panel rounded-2xl max-w-3xl mx-auto flex flex-col h-[calc(100vh-220px)] min-h-[450px] bg-[#FFF0F0] border border-[#E91E63]/10 shadow-sm animate-in fade-in duration-200">
      {/* Chat Header */}
      <div className="p-4 border-b border-[#E91E63]/10 bg-[#FFF0F0] flex items-center gap-2 rounded-t-2xl">
        <div className="w-8 h-8 rounded-full bg-gradient-premium flex items-center justify-center text-white shrink-0">
          <Sparkles size={16} />
        </div>
        <div>
          <h3 className="text-xs font-bold text-[#1E293B] m-0">Sroute AI Co-pilot</h3>
          <p className="text-[9px] text-[#22C55E] flex items-center gap-0.5 m-0 mt-0.5">● Connected to Llama 3</p>
        </div>
      </div>

      {/* Message History */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chatMessages.map((msg, index) => (
          <div 
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] p-3 rounded-2xl text-xs ${
              msg.sender === 'user' ? 'bg-[#E91E63] text-white' : 'bg-[#FFF0F0] border border-[#E91E63]/10 text-[#1e293b]'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleChatSend} className="p-4 border-t border-[#E91E63]/10 flex gap-2 bg-[#FFF0F0]/80 rounded-b-2xl">
        <input 
          type="text" 
          placeholder="Ask to modify itinerary or find nearby spots..." 
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          className="flex-1 bg-[#FFF0F0] border border-[#E91E63]/15 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63]"
        />
        <button 
          type="submit"
          className="bg-[#1e293b] text-white p-2.5 rounded-xl hover:bg-[#1e293b]/90 transition-all cursor-pointer border-0 shadow-sm shrink-0"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  )
}

export default AICopilot
