import React, { useState, useEffect, useCallback } from 'react'
import { policyAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

const POLICY_TYPES = ['Basic', 'Standard', 'Premium']
const CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat']

const PREMIUM_MAP = {
  Basic: 40,
  Standard: 65,
  Premium: 100,
}

const TYPE_INFO = {
  Basic: { icon: '🛡️', coverage: '₹200/shift', desc: 'Essential rain + heat cover', color: 'border-slate-600 hover:border-slate-500' },
  Standard: { icon: '⚡', coverage: '₹500/shift', desc: 'Full parametric coverage', color: 'border-amber-500/40 hover:border-amber-500' },
  Premium: { icon: '🚀', coverage: '₹1000/shift', desc: 'Max payout + pollution cover', color: 'border-emerald-500/30 hover:border-emerald-500' },
}

export default function PoliciesPage() {
  const { user } = useAuth()
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    type: 'Standard',
    city: user?.city || '',
    basePremium: PREMIUM_MAP['Standard'],
  })
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [pricingPreview, setPricingPreview] = useState(null)

  const fetchPolicies = useCallback(async () => {
    try {
      const res = await policyAPI.getAll()
      setPolicies(res.data.policies || [])
    } catch { }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchPolicies() }, [fetchPolicies])

  const handleTypeSelect = (type) => {
    setForm(f => ({ ...f, type, basePremium: PREMIUM_MAP[type] }))
    setPricingPreview(null)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')
    if (!form.city) { setFormError('Please select a city'); return }
    setCreating(true)
    try {
      const res = await policyAPI.create(form)
      setPricingPreview(res.data)
      setFormSuccess('Policy created successfully!')
      await fetchPolicies()
      setTimeout(() => {
        setShowForm(false)
        setFormSuccess('')
        setPricingPreview(null)
      }, 3000)
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to create policy. Try again.')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel this policy?')) return
    setDeletingId(id)
    try {
      await policyAPI.delete(id)
      setPolicies(p => p.filter(x => x._id !== id))
    } catch { }
    finally { setDeletingId(null) }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">My Policies</h1>
          <p className="text-slate-500 text-sm mt-1">Parametric income protection for your deliveries</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setFormError(''); setFormSuccess('') }}
          className="btn-secondary text-sm px-4 py-2 w-auto"
        >
          {showForm ? '✕ Cancel' : '+ New Policy'}
        </button>
      </div>

      {/* How it works banner */}
      {!showForm && policies.length === 0 && !loading && (
        <div className="card border-amber-500/20 bg-amber-500/5">
          <p className="font-display font-bold text-amber-400 text-lg uppercase tracking-wide mb-3">How SurakshaSetu Works</p>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            {[
              { step: '01', title: 'Choose a Plan', desc: 'Pick Basic, Standard, or Premium based on your income needs.' },
              { step: '02', title: 'Weather Triggers', desc: 'If rain >80mm, temp >45°C, or AQI >400 — payout triggers automatically.' },
              { step: '03', title: 'Instant Payout', desc: 'No forms. No waiting. Money credited within 24 hours.' },
            ].map(s => (
              <div key={s.step} className="flex gap-3">
                <span className="font-mono text-amber-500/60 font-bold text-lg flex-shrink-0">{s.step}</span>
                <div>
                  <p className="text-slate-200 font-medium">{s.title}</p>
                  <p className="text-slate-500 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <div className="card animate-slide-up space-y-5">
          <h3 className="font-display text-lg font-bold text-slate-100 uppercase tracking-wide">Create New Policy</h3>

          {/* Plan selector */}
          <div>
            <label className="label">Select Plan</label>
            <div className="grid grid-cols-3 gap-3 mt-1">
              {POLICY_TYPES.map(type => {
                const info = TYPE_INFO[type]
                const selected = form.type === type
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeSelect(type)}
                    className={`p-3 rounded-lg border text-left transition-all duration-150 
                      ${selected ? 'border-amber-500 bg-amber-500/10' : `bg-navy-900 ${info.color}`}`}
                  >
                    <div className="text-xl mb-1">{info.icon}</div>
                    <p className={`font-display font-bold text-sm uppercase ${selected ? 'text-amber-400' : 'text-slate-200'}`}>{type}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{info.coverage}</p>
                    <p className="text-xs text-slate-600 mt-0.5 hidden sm:block">{info.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">City</label>
                <select
                  className="input-field"
                  value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  required
                >
                  <option value="">Select your city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Weekly Premium (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  value={form.basePremium}
                  onChange={e => setForm(f => ({ ...f, basePremium: Number(e.target.value) }))}
                  min="40" max="200" required
                />
                <p className="text-slate-600 text-xs mt-1 font-mono">Recommended: ₹{PREMIUM_MAP[form.type]}</p>
              </div>
            </div>

            {/* Trigger reference */}
            <div className="bg-navy-900 rounded-lg p-3 border border-navy-700">
              <p className="text-slate-500 text-xs font-mono uppercase tracking-wider mb-2">Parametric Triggers</p>
              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                {[
                  { icon: '🌧️', label: 'Rain > 80mm' },
                  { icon: '🌡️', label: 'Temp > 45°C' },
                  { icon: '💨', label: 'AQI > 400' },
                ].map(t => (
                  <div key={t.label} className="bg-navy-800 rounded-md py-2 px-1">
                    <div className="text-base mb-0.5">{t.icon}</div>
                    <p className="text-slate-400 font-mono">{t.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {formError && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm px-4 py-3 rounded-lg">⚠ {formError}</div>
            )}
            {formSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm px-4 py-3 rounded-lg">✓ {formSuccess}</div>
            )}

            {pricingPreview && (
              <div className="bg-navy-900 rounded-lg p-3 border border-amber-500/20 animate-slide-up">
                <p className="text-amber-400 text-xs font-mono uppercase mb-2">Pricing Breakdown</p>
                <div className="space-y-1 text-sm">
                  {[
                    ['Base Premium', `₹${pricingPreview.pricingBreakdown?.basePremium}`],
                    ['Weather Risk', `+₹${pricingPreview.pricingBreakdown?.weatherRisk}`],
                    ['City Risk', `+₹${pricingPreview.pricingBreakdown?.cityRisk}`],
                    ['Discount', `-₹${pricingPreview.pricingBreakdown?.discount}`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-slate-400">
                      <span>{k}</span><span className="font-mono">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-slate-100 font-bold pt-1 border-t border-navy-700">
                    <span>Total Premium</span>
                    <span className="font-mono text-amber-400">₹{pricingPreview.pricingBreakdown?.totalPremium}</span>
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={creating} className="btn-primary">
              {creating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                  Creating Policy...
                </span>
              ) : 'Activate Protection'}
            </button>
          </form>
        </div>
      )}

      {/* Policies list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(i => <div key={i} className="shimmer-line h-28 rounded-xl" />)}
        </div>
      ) : policies.length === 0 && !showForm ? (
        <div className="card text-center py-12">
          <p className="text-4xl mb-3">🛡️</p>
          <p className="text-slate-400 font-body font-medium mb-1">No policies yet</p>
          <p className="text-slate-600 text-sm mb-5">Create your first policy to start protecting your income</p>
          <button onClick={() => setShowForm(true)} className="btn-primary w-auto px-10 mx-auto">
            Create Policy
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {policies.map(policy => (
            <PolicyCard key={policy._id} policy={policy} onDelete={handleDelete} deleting={deletingId === policy._id} />
          ))}
        </div>
      )}
    </div>
  )
}

function PolicyCard({ policy, onDelete, deleting }) {
  const typeInfo = TYPE_INFO[policy.type] || TYPE_INFO['Standard']
  return (
    <div className="card-hover animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-navy-900 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
            {typeInfo.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-display font-bold text-slate-100 text-base uppercase tracking-wide">{policy.type || 'Standard'} Plan</p>
              <span className="badge-success">ACTIVE</span>
            </div>
            <p className="text-slate-500 text-sm mt-0.5">{policy.city}</p>
          </div>
        </div>
        <button
          onClick={() => onDelete(policy._id)}
          disabled={deleting}
          className="btn-danger text-xs px-3 py-1.5 flex-shrink-0"
        >
          {deleting ? '...' : 'Cancel'}
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-4">
        {[
          { label: 'Base', value: `₹${policy.basePremium}` },
          { label: 'Weather', value: `+₹${policy.weatherRisk || 0}` },
          { label: 'City', value: `+₹${policy.cityRisk || 0}` },
          { label: 'Discount', value: `-₹${policy.discount || 0}` },
          { label: 'Total/wk', value: `₹${policy.totalPremium}`, highlight: true },
        ].map(({ label, value, highlight }) => (
          <div key={label} className={`rounded-md p-2 text-center ${highlight ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-navy-900'}`}>
            <p className={`font-display font-bold text-sm ${highlight ? 'text-amber-400' : 'text-slate-200'}`}>{value}</p>
            <p className="text-slate-600 text-xs font-mono mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <p className="text-slate-700 text-xs font-mono mt-3">
        Created {new Date(policy.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </p>
    </div>
  )
}
