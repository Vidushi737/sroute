import React from 'react'
import { TrendingUp, BarChart3, PieChart, Shield } from 'lucide-react'

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Upper overview header */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFF0F0] border border-[#E91E63]/10 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-[#1e293b] m-0">Authentic Routing Analysis</h3>
          <p className="text-xs text-[#475569] m-0">A verification score computed across NLP sentiments, local crowd indexing, and pricing vectors.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] text-[#475569] block font-bold uppercase">Consolidated Authenticity</span>
            <span className="text-2xl font-extrabold text-[#E91E63]">94.2%</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#E91E63]/10 flex items-center justify-center text-[#E91E63]">
            <Shield size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Spend Chart */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 bg-[#FFF0F0] border border-[#E91E63]/10 shadow-sm">
          <h3 className="text-sm font-bold text-[#1E293B] m-0 flex items-center gap-1.5">
            <BarChart3 size={16} className="text-[#E91E63]" />
            <span>Daily Budget Efficiency</span>
          </h3>
          <div className="h-48 flex items-end gap-3 pt-6 border-b border-[#E91E63]/15">
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-[#E91E63]/20 rounded-t-lg h-24 relative">
                <div className="absolute bottom-0 w-full bg-[#E91E63] rounded-t-lg h-16" />
              </div>
              <span className="text-[10px] text-[#475569]">Day 1</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-[#E91E63]/20 rounded-t-lg h-24 relative">
                <div className="absolute bottom-0 w-full bg-[#E91E63] rounded-t-lg h-10" />
              </div>
              <span className="text-[10px] text-[#475569]">Day 2</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-[#E91E63]/20 rounded-t-lg h-24 relative">
                <div className="absolute bottom-0 w-full bg-[#E91E63] rounded-t-lg h-20" />
              </div>
              <span className="text-[10px] text-[#475569]">Day 3</span>
            </div>
          </div>
          <p className="text-[10px] text-[#475569] m-0">
            Solid bar represents spent money; light bar represents allocated daily budget ($100).
          </p>
        </div>

        {/* Authenticity Distribution */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 bg-[#FFF0F0] border border-[#E91E63]/10 shadow-sm">
          <h3 className="text-sm font-bold text-[#1E293B] m-0 flex items-center gap-1.5">
            <PieChart size={16} className="text-[#E91E63]" />
            <span>Authenticity Breakdown</span>
          </h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-semibold text-[#1e293b]">
                <span>Local Ratio Index</span>
                <span>92.4%</span>
              </div>
              <div className="w-full bg-[#FFF0F0] rounded-full h-2 border border-[#E91E63]/5">
                <div className="bg-[#E91E63] h-2 rounded-full" style={{ width: '92.4%' }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-semibold text-[#1e293b]">
                <span>NLP Sentiment Analysis</span>
                <span>95.0%</span>
              </div>
              <div className="w-full bg-[#FFF0F0] rounded-full h-2 border border-[#E91E63]/5">
                <div className="bg-[#EC407A] h-2 rounded-full" style={{ width: '95.0%' }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-semibold text-[#1e293b]">
                <span>Price Anomaly Score</span>
                <span>85.0%</span>
              </div>
              <div className="w-full bg-[#FFF0F0] rounded-full h-2 border border-[#E91E63]/5">
                <div className="bg-[#FF8A65] h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
