import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'

const PLATFORMS = ['Swiggy', 'Zomato', 'Dunzo', 'Blinkit', 'BigBasket', 'Other']
const CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat']

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 2-step form
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    city: '', platform: '',
    avgWeeklyIncome: '', workingHours: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleStep1 = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) return
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setError('')
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authAPI.register({
        name: form.name,
        email: form.email,
        password: form.password,
        city: form.city,
        platform: form.platform,
        avgWeeklyIncome: Number(form.avgWeeklyIncome),
        workingHours: Number(form.workingHours)
      })
      // Register endpoint returns {user} not {token,user} — so we log in after
      const loginRes = await authAPI.login(form.email, form.password)
      const { token, user } = loginRes.data
      login(token, user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.msg || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 bg-grid-pattern bg-grid flex items-center justify-center px-4 py-8">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20">
            <span className="text-navy-950 font-display font-extrabold text-xl">SS</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-slate-100 tracking-wide uppercase">Join SurakshaSetu</h1>
          <p className="text-slate-500 text-sm font-body mt-1">Protect your gig income in minutes</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-5 px-1">
          {[1, 2].map(s => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-1.5 ${s === step ? 'text-amber-400' : s < step ? 'text-emerald-400' : 'text-slate-600'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-medium border
                  ${s === step ? 'border-amber-500 bg-amber-500/10' : s < step ? 'border-emerald-500 bg-emerald-500/10' : 'border-navy-600 bg-navy-800'}`}>
                  {s < step ? '✓' : s}
                </div>
                <span className="text-xs font-body hidden sm:block">
                  {s === 1 ? 'Account' : 'Work Details'}
                </span>
              </div>
              {s < 2 && <div className={`flex-1 h-px ${step > s ? 'bg-emerald-500/40' : 'bg-navy-600'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="card">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm px-4 py-3 rounded-lg mb-4 flex items-start gap-2">
              <span className="flex-shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4 animate-fade-in">
              <div>
                <h2 className="font-display text-xl font-bold text-slate-200 uppercase tracking-wide mb-4">Create Account</h2>
              </div>
              <div>
                <label className="label">Full Name</label>
                <input type="text" name="name" className="input-field" placeholder="Rahul Sharma" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Email Address</label>
                <input type="email" name="email" className="input-field" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
              </div>
              <div>
                <label className="label">Password</label>
                <input type="password" name="password" className="input-field" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
              </div>
              <button type="submit" className="btn-primary mt-2">
                Continue →
              </button>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
              <div>
                <h2 className="font-display text-xl font-bold text-slate-200 uppercase tracking-wide mb-4">Work Details</h2>
              </div>
              <div>
                <label className="label">Delivery Platform</label>
                <select name="platform" className="input-field" value={form.platform} onChange={handleChange} required>
                  <option value="">Select platform</option>
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Your City</label>
                <select name="city" className="input-field" value={form.city} onChange={handleChange} required>
                  <option value="">Select city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Weekly Income (₹)</label>
                  <input type="number" name="avgWeeklyIncome" className="input-field" placeholder="e.g. 3000" value={form.avgWeeklyIncome} onChange={handleChange} min="0" required />
                </div>
                <div>
                  <label className="label">Hours / Day</label>
                  <input type="number" name="workingHours" className="input-field" placeholder="e.g. 8" value={form.workingHours} onChange={handleChange} min="1" max="24" required />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">
                  ← Back
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </span>
                  ) : 'Create Account'}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-slate-500 text-sm mt-5">
            Already registered?{' '}
            <Link to="/login" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
