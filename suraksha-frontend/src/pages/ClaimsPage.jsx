import React, { useState, useEffect, useCallback } from 'react'
import { claimsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function ClaimsPage() {
  const { user } = useAuth()
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [formError, setFormError] = useState('')

  const [form, setForm] = useState({
    actualIncome: '',
    hoursWorked: user?.workingHours || '6',
    completedOrders: '10',
    avgOrderValue: '120',
    rain: '100',
    temp: '32',
    aqi: '150',
    distance: '30',
    speed: '25',
  })

  const userId = user?._id || localStorage.getItem('userId')

  const fetchClaims = useCallback(async () => {
    if (!userId) { setLoading(false); return }
    try {
      const res = await claimsAPI.getByUser(userId)
      setClaims(Array.isArray(res.data) ? res.data : [])
    } catch { }
    finally { setLoading(false) }
  }, [userId])

  useEffect(() => { fetchClaims() }, [fetchClaims])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setResult(null)
    if (!form.actualIncome) { setFormError('Enter your actual income for this period'); return }
    setSubmitting(true)
    try {
      const res = await claimsAPI.submit({
        actualIncome: Number(form.actualIncome),
        userData: {
          hoursWorked: Number(form.hoursWorked),
          completedOrders: Number(form.completedOrders),
          avgOrderValue: Number(form.avgOrderValue),
          rain: Number(form.rain),
          temp: Number(form.temp),
          aqi: Number(form.aqi),
          distance: Number(form.distance),
          speed: Number(form.speed),
          past_income: 500,
          time_of_day: new Date().getHours(),
          route_variance: 0.2,
          order_rate: 0.8,
          session_time: 120,
        },
      })
      setResult(res.data)
      await fetchClaims()
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to submit claim. Make sure you have an active policy.')
    } finally {
      setSubmitting(false)
    }
  }

  const totalPayout = claims
    .filter(c => c.status === 'Approved')
    .reduce((sum, c) => sum + (c.payout || c.triggerValue || 0), 0)

  const approvedCount = claims.filter(c => c.status === 'Approved').length
  const pendingCount = claims.filter(c => c.status === 'Pending').length
  const flaggedCount = claims.filter(c => c.status === 'Flagged').length

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Claims</h1>
          <p className="text-slate-500 text-sm mt-1">Submit income loss claims · Track auto-payouts</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setResult(null); setFormError('') }}
          className="btn-secondary text-sm px-4 py-2 w-auto"
        >
          {showForm ? '✕ Cancel' : '+ File Claim'}
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="stat-card text-center">
          <p className="font-display font-bold text-2xl text-emerald-400">₹{Math.round(totalPayout).toLocaleString('en-IN')}</p>
          <p className="text-slate-500 text-xs font-mono mt-1">TOTAL PAID OUT</p>
        </div>
        <div className="stat-card text-center">
          <p className="font-display font-bold text-2xl text-slate-100">{approvedCount}</p>
          <p className="text-slate-500 text-xs font-mono mt-1">APPROVED</p>
        </div>
        <div className="stat-card text-center">
          <p className={`font-display font-bold text-2xl ${flaggedCount > 0 ? 'text-rose-400' : 'text-slate-500'}`}>{flaggedCount}</p>
          <p className="text-slate-500 text-xs font-mono mt-1">FLAGGED</p>
        </div>
      </div>

      {/* Claim result card */}
      {result && (
        <div className={`card animate-slide-up border ${result.status === 'Approved' ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-rose-500/40 bg-rose-500/5'}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{result.status === 'Approved' ? '✅' : '🚫'}</span>
            <div>
              <p className="font-display font-bold text-lg uppercase tracking-wide text-slate-100">
                Claim {result.status}
              </p>
              <p className="text-slate-500 text-sm">{result.reason || 'Processing complete'}</p>
            </div>
          </div>
          {result.status === 'Approved' && (
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Expected Income', value: `₹${result.expectedIncome}`, color: 'text-slate-200' },
                { label: 'Actual Income', value: `₹${result.actualIncome}`, color: 'text-amber-400' },
                { label: 'Payout Approved', value: `₹${Math.round(result.payout)}`, color: 'text-emerald-400' },
              ].map(s => (
                <div key={s.label} className="bg-navy-900 rounded-lg p-3">
                  <p className={`font-display font-bold text-lg ${s.color}`}>{s.value}</p>
                  <p className="text-slate-500 text-xs font-mono mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Claim form */}
      {showForm && !result && (
        <div className="card animate-slide-up">
          <h3 className="font-display text-lg font-bold text-slate-100 uppercase tracking-wide mb-1">Submit Claim</h3>
          <p className="text-slate-500 text-sm mb-5">
            Provide your actual income and working conditions. Our ML model will calculate expected income and approve the difference.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Key field */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
              <label className="label text-amber-500/80">Actual Income Earned (₹) *</label>
              <input
                type="number"
                className="input-field text-lg font-display font-bold"
                placeholder="e.g. 600"
                value={form.actualIncome}
                onChange={e => setForm(f => ({ ...f, actualIncome: e.target.value }))}
                min="0"
                required
              />
              <p className="text-amber-500/60 text-xs font-mono mt-1.5">Enter what you actually earned during the affected period</p>
            </div>

            {/* Work context */}
            <div>
              <p className="label mb-3">Work Context (helps ML model)</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'hoursWorked', label: 'Hours Worked', placeholder: '6' },
                  { key: 'completedOrders', label: 'Completed Orders', placeholder: '10' },
                  { key: 'avgOrderValue', label: 'Avg Order Value (₹)', placeholder: '120' },
                  { key: 'distance', label: 'Distance (km)', placeholder: '30' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="label">{f.label}</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder={f.placeholder}
                      value={form[f.key]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      min="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Weather conditions */}
            <div>
              <p className="label mb-3">Weather Conditions During Shift</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'rain', label: 'Rainfall (mm)', icon: '🌧️', alert: Number(form.rain) > 80 },
                  { key: 'temp', label: 'Temperature (°C)', icon: '🌡️', alert: Number(form.temp) > 45 },
                  { key: 'aqi', label: 'AQI', icon: '💨', alert: Number(form.aqi) > 400 },
                ].map(f => (
                  <div key={f.key}>
                    <label className={`label ${f.alert ? 'text-amber-500/80' : ''}`}>
                      {f.icon} {f.label}
                    </label>
                    <input
                      type="number"
                      className={`input-field ${f.alert ? 'border-amber-500/50' : ''}`}
                      value={form[f.key]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      min="0"
                    />
                    {f.alert && <p className="text-amber-400 text-xs mt-1 font-mono">⚡ Trigger level</p>}
                  </div>
                ))}
              </div>
            </div>

            {formError && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm px-4 py-3 rounded-lg">
                ⚠ {formError}
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                  Processing Claim via ML...
                </span>
              ) : 'Submit Claim'}
            </button>
          </form>
        </div>
      )}

      {/* Claims history */}
      <div>
        <h3 className="font-display text-base font-bold text-slate-400 uppercase tracking-wide mb-3">
          Claims History
          {claims.length > 0 && <span className="text-slate-600 ml-2">({claims.length})</span>}
        </h3>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => <div key={i} className="shimmer-line h-20 rounded-xl" />)}
          </div>
        ) : claims.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-3xl mb-3">📋</p>
            <p className="text-slate-400 font-medium text-sm">No claims yet</p>
            <p className="text-slate-600 text-xs mt-1">Claims are auto-created during extreme weather events, or you can file manually above</p>
          </div>
        ) : (
          <div className="space-y-2">
            {claims.map(claim => (
              <ClaimDetailRow key={claim._id} claim={claim} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ClaimDetailRow({ claim }) {
  const [expanded, setExpanded] = useState(false)
  const payout = claim.payout || claim.triggerValue || 0
  const statusStyles = {
    Approved: { badge: 'badge-success', dot: 'bg-emerald-400' },
    Pending: { badge: 'badge-warning', dot: 'bg-amber-400' },
    Flagged: { badge: 'badge-danger', dot: 'bg-rose-400' },
  }
  const s = statusStyles[claim.status] || statusStyles.Pending

  return (
    <div className="card-hover cursor-pointer" onClick={() => setExpanded(!expanded)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">
            {claim.triggerType === 'Rain' ? '🌧️' : claim.triggerType === 'Heat' ? '🌡️' : claim.triggerType === 'Pollution' ? '💨' : '📋'}
          </span>
          <div>
            <p className="text-slate-200 text-sm font-body font-medium">{claim.triggerType || 'Income Loss Claim'}</p>
            <p className="text-slate-600 text-xs font-mono">
              {new Date(claim.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={s.badge}>{claim.status}</span>
          {payout > 0 && (
            <span className="text-emerald-400 font-display font-bold text-sm font-mono">+₹{Math.round(payout)}</span>
          )}
          <span className="text-slate-600 text-xs">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-navy-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm animate-fade-in">
          {[
            { label: 'Expected Income', value: claim.expectedIncome ? `₹${claim.expectedIncome}` : '—' },
            { label: 'Actual Income', value: claim.actualIncome ? `₹${claim.actualIncome}` : '—' },
            { label: 'Payout', value: payout ? `₹${Math.round(payout)}` : '₹0' },
            { label: 'Fraud Check', value: claim.fraud ? '⚠ Flagged' : '✓ Clear' },
          ].map(d => (
            <div key={d.label} className="stat-card text-center">
              <p className="text-slate-300 font-body font-medium text-sm">{d.value}</p>
              <p className="text-slate-600 text-xs font-mono mt-0.5">{d.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
