import React, { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, Loader2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000'

const AICopilot: React.FC = () => {
  const { chatMessages, setChatMessages } = useApp()
  const [chatInput, setChatInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleChatSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || isLoading) return

    const userMsg = chatInput
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }])
    setChatInput('')
    setIsLoading(true)

    try {
      const response = await fetch(`${AI_SERVICE_URL}/api/v1/chat/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: chatMessages.slice(-10).map(m => ({
            sender: m.sender,
            text: m.text
          })),
          context: null
        })
      })

      if (!response.ok) throw new Error(`AI service returned ${response.status}`)

      const data = await response.json()
      setChatMessages(prev => [...prev, { sender: 'ai', text: data.reply }])
    } catch (err) {
      console.error('AI chat error:', err)
      setChatMessages(prev => [...prev, {
        sender: 'ai',
        text: "I'm having trouble connecting right now. Please make sure the AI service is running and your GROQ_API_KEY is set."
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="glass-panel rounded-2xl max-w-3xl mx-auto flex flex-col h-[calc(100vh-220px)] min-h-[450px] bg-[#FFF0F0] border border-[#E91E63]/10 shadow-sm animate-in fade-in duration-200">
      <div className="p-4 border-b border-[#E91E63]/10 bg-[#FFF0F0] flex items-center gap-2 rounded-t-2xl">
        <div className="w-8 h-8 rounded-full bg-gradient-premium flex items-center justify-center text-white shrink-0">
          <Sparkles size={16} />
        </div>
        <div>
          <h3 className="text-xs font-bold text-[#1E293B] m-0">Sroute AI Co-pilot</h3>
          <p className="text-[9px] text-[#22C55E] flex items-center gap-0.5 m-0 mt-0.5">
            ● Powered by Llama 3 via Groq
          </p>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chatMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60">
            <Sparkles size={32} className="text-[#E91E63]" />
            <p className="text-xs text-[#475569] max-w-xs">
              Ask me anything about your trip — I can recommend hidden gems, adjust your budget, modify itineraries, and find authentic local spots.
            </p>
          </div>
        )}
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
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#FFF0F0] border border-[#E91E63]/10 p-3 rounded-2xl flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-[#E91E63]" />
              <span className="text-xs text-[#475569]">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleChatSend} className="p-4 border-t border-[#E91E63]/10 flex gap-2 bg-[#FFF0F0]/80 rounded-b-2xl">
        <input
          type="text"
          placeholder="Ask to modify itinerary or find nearby spots..."
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          disabled={isLoading}
          className="flex-1 bg-[#FFF0F0] border border-[#E91E63]/15 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#1e293b] text-white p-2.5 rounded-xl hover:bg-[#1e293b]/90 transition-all cursor-pointer border-0 shadow-sm shrink-0 disabled:opacity-50"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  )
}

export default AICopilot
