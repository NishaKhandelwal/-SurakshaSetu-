import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authAPI.login(form.email, form.password)
      const { token, user } = res.data
      login(token, user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.error || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 bg-grid-pattern bg-grid flex items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
            <span className="text-navy-950 font-display font-extrabold text-xl">SS</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-slate-100 tracking-wide uppercase">SurakshaSetu</h1>
          <p className="text-slate-500 text-sm font-body mt-1">Parametric Insurance for Gig Workers</p>
        </div>

        {/* Card */}
        <div className="card border-navy-600">
          <h2 className="font-display text-xl font-bold text-slate-200 uppercase tracking-wide mb-1">Welcome Back</h2>
          <p className="text-slate-500 text-sm mb-6">Sign in to manage your protection</p>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm px-4 py-3 rounded-lg mb-4 flex items-start gap-2">
              <span className="mt-0.5 flex-shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                name="email"
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                className="input-field"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : 'Sign In to Dashboard'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-5">
            New rider?{' '}
            <Link to="/register" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
              Create account
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-slate-600 text-xs mt-6 font-mono">
          Parametric payouts · No claim forms · Instant protection
        </p>
      </div>
    </div>
  )
}
