import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, User, ArrowRight, Loader2, AlertTriangle, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Signup: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Client-side validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }
    if (!email.includes('@')) {
      setError('Invalid email address')
      setIsLoading(false)
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            name: name.split(' ')[0]
          }
        }
      })

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      // Success
      setSuccess(true)
      setIsLoading(false)
      
      // Auto-redirect after 2 seconds
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF5F5] relative overflow-hidden flex items-center justify-center p-6">
      {/* Background glowing blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#E91E63]/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#FF8A65]/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating travel emojis */}
      <div className="absolute top-[15%] left-[12%] text-2xl opacity-15 pointer-events-none" style={{animation: 'float 7s ease-in-out infinite'}}>🗺️</div>
      <div className="absolute bottom-[20%] right-[10%] text-2xl opacity-15 pointer-events-none" style={{animation: 'floatSlow 9s ease-in-out infinite'}}>🧭</div>

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl bg-white/80 border border-[#E91E63]/10 shadow-xl relative z-10 space-y-6 backdrop-blur-md">
        <div className="text-center space-y-2">
          {/* Logo brand */}
          <Link to="/" className="inline-flex items-center gap-2 no-underline mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-premium flex items-center justify-center text-white font-bold shadow-md shadow-[#E91E63]/20">S</div>
            <span className="text-xl font-bold tracking-tight text-[#1E293B]">Sroute</span>
            <span className="text-[10px] uppercase font-semibold bg-[#E91E63]/10 text-[#E91E63] px-1.5 py-0.5 rounded ml-1">AI</span>
          </Link>
          <h2 className="text-xl font-bold text-[#1e293b] m-0">Create Explorer Account</h2>
          <p className="text-xs text-[#475569] m-0">Join Sroute to uncover hidden gems globally</p>
        </div>

        {error && (
          <div className="bg-[#FF5252]/10 border border-[#FF5252]/20 text-[#FF5252] text-xs p-3.5 rounded-xl flex items-center gap-2">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-[#2A9D8F]/10 border border-[#2A9D8F]/20 text-[#2A9D8F] text-xs p-3.5 rounded-xl flex items-center gap-2">
            <CheckCircle size={16} className="shrink-0" />
            <span>Account created successfully! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#475569] uppercase">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-[#475569]" size={16} />
              <input 
                type="text" 
                placeholder="Alex Rivera"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-[#FFF5F5] border border-[#E91E63]/15 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63]/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#475569] uppercase">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-[#475569]" size={16} />
              <input 
                type="email" 
                placeholder="alex@example.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#FFF5F5] border border-[#E91E63]/15 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#475569] uppercase">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-[#475569]" size={16} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#FFF5F5] border border-[#E91E63]/15 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63]/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#475569] uppercase">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-[#475569]" size={16} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#FFF5F5] border border-[#E91E63]/15 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#E91E63] focus:ring-1 focus:ring-[#E91E63]/20"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading || success}
            className="w-full bg-[#1e293b] text-white text-xs font-semibold py-3 rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#1e293b]/90 transition-all cursor-pointer border-0 shadow-sm mt-6 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={14} />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Begin Adventure</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-[#475569] m-0">
            Already have an account?{' '}
            <Link to="/login" className="text-[#E91E63] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
