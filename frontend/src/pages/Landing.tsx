import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Compass, TrendingUp, ArrowRight } from 'lucide-react'

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF5F5] relative overflow-hidden flex flex-col justify-between">
      {/* Travel-themed background decorations */}
      {/* Soft gradient blobs */}
      <div className="absolute top-[-100px] left-[-80px] w-[500px] h-[500px] bg-[#E91E63]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-60px] w-[450px] h-[450px] bg-[#FF8A65]/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#EC407A]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* SVG Travel Doodles — hand-drawn feel */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        {/* Airplane path */}
        <path d="M 80 120 Q 200 60 400 150 T 750 80 T 1100 200" fill="none" stroke="#E91E63" strokeWidth="2" strokeDasharray="8 6"/>
        {/* Mountain range */}
        <path d="M -20 650 L 120 500 L 200 580 L 300 450 L 380 560 L 480 420 L 560 550 L 700 400 L 820 580 L 920 480 L 1050 600 L 1200 460 L 1400 650" fill="none" stroke="#E91E63" strokeWidth="2.5"/>
        {/* Compass rose */}
        <circle cx="1350" cy="150" r="35" fill="none" stroke="#E91E63" strokeWidth="1.5"/>
        <line x1="1350" y1="110" x2="1350" y2="190" stroke="#E91E63" strokeWidth="1.5"/>
        <line x1="1310" y1="150" x2="1390" y2="150" stroke="#E91E63" strokeWidth="1.5"/>
        <polygon points="1350,115 1345,135 1355,135" fill="#E91E63" opacity="0.6"/>
        {/* Hot air balloon */}
        <ellipse cx="250" cy="280" rx="28" ry="34" fill="none" stroke="#E91E63" strokeWidth="1.5"/>
        <line x1="225" y1="308" x2="230" y2="330" stroke="#E91E63" strokeWidth="1"/>
        <line x1="275" y1="308" x2="270" y2="330" stroke="#E91E63" strokeWidth="1"/>
        <rect x="232" y="328" width="36" height="16" rx="3" fill="none" stroke="#E91E63" strokeWidth="1"/>
        {/* Dotted travel path */}
        <path d="M 900 600 Q 950 500 1000 550 T 1100 450 T 1250 520" fill="none" stroke="#E91E63" strokeWidth="1.5" strokeDasharray="4 4"/>
        {/* Map pin icons */}
        <g transform="translate(680, 250)">
          <path d="M 0 -15 C -10 -15 -15 -8 -15 0 C -15 12 0 25 0 25 C 0 25 15 12 15 0 C 15 -8 10 -15 0 -15 Z" fill="none" stroke="#E91E63" strokeWidth="1.5"/>
          <circle cx="0" cy="-2" r="5" fill="none" stroke="#E91E63" strokeWidth="1"/>
        </g>
        <g transform="translate(1050, 350)">
          <path d="M 0 -15 C -10 -15 -15 -8 -15 0 C -15 12 0 25 0 25 C 0 25 15 12 15 0 C 15 -8 10 -15 0 -15 Z" fill="none" stroke="#E91E63" strokeWidth="1.5"/>
          <circle cx="0" cy="-2" r="5" fill="none" stroke="#E91E63" strokeWidth="1"/>
        </g>
        {/* Small stars */}
        <g transform="translate(150, 450)" opacity="0.5">
          <polygon points="0,-8 2,-2 8,-2 3,2 5,8 0,4 -5,8 -3,2 -8,-2 -2,-2" fill="#E91E63"/>
        </g>
        <g transform="translate(1300, 500)" opacity="0.5">
          <polygon points="0,-8 2,-2 8,-2 3,2 5,8 0,4 -5,8 -3,2 -8,-2 -2,-2" fill="#E91E63"/>
        </g>
        <g transform="translate(500, 100)" opacity="0.4">
          <polygon points="0,-6 1.5,-1.5 6,-1.5 2.3,1.5 3.8,6 0,3 -3.8,6 -2.3,1.5 -6,-1.5 -1.5,-1.5" fill="#E91E63"/>
        </g>
      </svg>

      {/* Floating travel emoji decorations */}
      <div className="absolute top-[15%] right-[12%] text-3xl opacity-20 pointer-events-none" style={{animation: 'float 6s ease-in-out infinite'}}>✈️</div>
      <div className="absolute top-[60%] left-[8%] text-2xl opacity-15 pointer-events-none" style={{animation: 'floatSlow 8s ease-in-out infinite'}}>🗺️</div>
      <div className="absolute bottom-[25%] right-[20%] text-2xl opacity-15 pointer-events-none" style={{animation: 'float 7s ease-in-out infinite', animationDelay: '2s'}}>🌍</div>
      <div className="absolute top-[35%] left-[18%] text-xl opacity-10 pointer-events-none" style={{animation: 'floatSlow 9s ease-in-out infinite', animationDelay: '1s'}}>🧭</div>
      <div className="absolute bottom-[40%] left-[45%] text-xl opacity-10 pointer-events-none" style={{animation: 'float 10s ease-in-out infinite', animationDelay: '3s'}}>📍</div>

      {/* Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-premium flex items-center justify-center text-white font-bold shadow-lg shadow-[#E91E63]/20">S</div>
          <span className="text-xl font-bold tracking-tight text-[#1E293B]">Sroute</span>
          <span className="text-[9px] uppercase font-bold bg-[#E91E63]/10 text-[#E91E63] px-1.5 py-0.5 rounded-md ml-0.5">AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-[#475569] hover:text-[#E91E63] transition-colors no-underline">
            Login
          </Link>
          <Link 
            to="/signup" 
            className="bg-[#1e293b] text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1e293b]/90 transition-all no-underline shadow-sm hover:shadow-md"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero section — minimal text */}
      <main className="w-full max-w-7xl mx-auto px-6 py-10 flex-1 flex flex-col lg:flex-row items-center gap-12 relative z-10">
        <div className="flex-1 space-y-5 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 bg-[#E91E63]/8 border border-[#E91E63]/15 px-3 py-1.5 rounded-full text-xs font-semibold text-[#E91E63]">
            <Sparkles size={14} />
            <span>AI-Powered Travel</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-[#1E293B] leading-[1.1]">
            Skip the traps.<br />
            Find the <span className="text-transparent bg-clip-text bg-gradient-premium">real gems</span>.
          </h1>
          <p className="text-base text-[#64748B] max-w-md mx-auto lg:mx-0 leading-relaxed">
            AI routes that locals actually love. No tourist traps, just authentic experiences.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
            <Link 
              to="/dashboard" 
              className="w-full sm:w-auto bg-gradient-premium text-white font-semibold text-sm px-7 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-[#E91E63]/20 hover:-translate-y-0.5 transition-all no-underline cursor-pointer"
            >
              <span>Start Exploring</span>
              <ArrowRight size={16} />
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto bg-white/60 border border-[#E91E63]/15 text-[#1e293b] font-semibold text-sm px-7 py-3.5 rounded-xl flex items-center justify-center gap-1.5 hover:bg-white/80 hover:border-[#E91E63]/25 transition-all no-underline backdrop-blur-sm"
            >
              <span>Plan a Trip</span>
            </Link>
          </div>
        </div>

        {/* Hero Visual — route preview card */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
          <div className="glass-panel p-6 rounded-3xl shadow-xl relative overflow-hidden bg-white/70 border border-[#E91E63]/8 backdrop-blur-md">
            <div className="flex justify-between items-center border-b border-[#E91E63]/8 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5252]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFB74D]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#66BB6A]" />
              </div>
              <span className="text-[10px] uppercase font-bold text-[#E91E63] tracking-wider bg-[#E91E63]/8 px-2 py-0.5 rounded">Live Route</span>
            </div>

            <div className="space-y-3">
              <div className="glass-card p-4 rounded-2xl border border-[#E91E63]/8 space-y-1.5 bg-white/40 hover:bg-white/60 transition-colors">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] uppercase font-bold text-[#E91E63] bg-[#E91E63]/8 px-1.5 py-0.5 rounded">☕ Morning</span>
                  <span className="text-xs font-bold text-[#22C55E]">98%</span>
                </div>
                <h4 className="text-sm font-bold text-[#1e293b] m-0">Hidden Garden Café</h4>
                <p className="text-[11px] text-[#64748B] m-0">Local favorite, no tourist menus</p>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-[#E91E63]/8 space-y-1.5 bg-white/40 hover:bg-white/60 transition-colors">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] uppercase font-bold text-[#E91E63] bg-[#E91E63]/8 px-1.5 py-0.5 rounded">🍜 Lunch</span>
                  <span className="text-xs font-bold text-[#22C55E]">96%</span>
                </div>
                <h4 className="text-sm font-bold text-[#1e293b] m-0">Backstreet Noodle Bar</h4>
                <p className="text-[11px] text-[#64748B] m-0">Standing counter, 16-hour broth</p>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-[#E91E63]/8 space-y-1.5 bg-white/40 hover:bg-white/60 transition-colors">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] uppercase font-bold text-[#E91E63] bg-[#E91E63]/8 px-1.5 py-0.5 rounded">🌅 Evening</span>
                  <span className="text-xs font-bold text-[#22C55E]">94%</span>
                </div>
                <h4 className="text-sm font-bold text-[#1e293b] m-0">Rooftop Sunset Spot</h4>
                <p className="text-[11px] text-[#64748B] m-0">Known only to residents</p>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-[#E91E63]/8 flex justify-between items-center text-[10px] text-[#64748B]">
              <span className="flex items-center gap-1">📍 3 stops verified</span>
              <span className="text-[#E91E63] font-bold">2.1km walk</span>
            </div>
          </div>
          
          {/* Floating badge */}
          <div className="absolute -top-3 -right-3 bg-white border border-[#E91E63]/10 rounded-2xl p-3 shadow-lg flex items-center gap-2" style={{animation: 'float 4s ease-in-out infinite'}}>
            <span className="text-lg">🛡️</span>
            <div>
              <p className="text-[9px] text-[#64748B] uppercase font-bold m-0">AI Verified</p>
              <p className="text-xs font-bold text-[#1e293b] m-0">Trap-Free</p>
            </div>
          </div>
        </div>
      </main>

      {/* Feature cards — concise */}
      <section className="w-full max-w-7xl mx-auto px-6 py-10 relative z-10 border-t border-[#E91E63]/8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="glass-panel p-5 rounded-2xl space-y-2.5 bg-white/50 border border-[#E91E63]/8 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#E91E63]/8 flex items-center justify-center text-[#E91E63]">
              <Compass size={20} />
            </div>
            <h3 className="text-sm font-bold text-[#1e293b] m-0">Smart Routing</h3>
            <p className="text-xs text-[#64748B] m-0 leading-relaxed">
              Optimized walking paths stitched from real local geography data.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl space-y-2.5 bg-white/50 border border-[#E91E63]/8 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#FF8A65]/10 flex items-center justify-center text-[#FF8A65]">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-sm font-bold text-[#1e293b] m-0">Authenticity Score</h3>
            <p className="text-xs text-[#64748B] m-0 leading-relaxed">
              Every place rated on real visitor data — not sponsored reviews.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl space-y-2.5 bg-white/50 border border-[#E91E63]/8 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#EC407A]/10 flex items-center justify-center text-[#EC407A]">
              <Sparkles size={20} />
            </div>
            <h3 className="text-sm font-bold text-[#1e293b] m-0">AI Co-Pilot</h3>
            <p className="text-xs text-[#64748B] m-0 leading-relaxed">
              Chat to swap stops, adjust routes, or discover hidden alternatives.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full text-center py-5 text-[10px] text-[#94A3B8] relative z-10 border-t border-[#E91E63]/6">
        &copy; {new Date().getFullYear()} Sroute Technologies. Built for authentic explorers.
      </footer>
    </div>
  )
}

export default Landing
