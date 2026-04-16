import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { weatherAPI, policyAPI, claimsAPI, mlAPI } from '../services/api'

export default function DashboardPage() {
  const { user } = useAuth()
  const [weather, setWeather] = useState(null)
  const [policies, setPolicies] = useState([])
  const [claims, setClaims] = useState([])
  const [income, setIncome] = useState(null)
  const [loadingWeather, setLoadingWeather] = useState(true)
  const [loadingPolicies, setLoadingPolicies] = useState(true)
  const [loadingClaims, setLoadingClaims] = useState(true)

  const city = user?.city || 'Delhi'
  const userId = user?._id || localStorage.getItem('userId')

  const fetchWeather = useCallback(async () => {
    try {
      const res = await weatherAPI.getByCity(city)
      setWeather(res.data.data)
    } catch { /* ML service may be offline — silent fail */ }
    finally { setLoadingWeather(false) }
  }, [city])

  const fetchPolicies = useCallback(async () => {
    try {
      const res = await policyAPI.getAll()
      setPolicies(res.data.policies || [])
    } catch { }
    finally { setLoadingPolicies(false) }
  }, [])

  const fetchClaims = useCallback(async () => {
    if (!userId) { setLoadingClaims(false); return }
    try {
      const res = await claimsAPI.getByUser(userId)
      setClaims(Array.isArray(res.data) ? res.data : [])
    } catch { }
    finally { setLoadingClaims(false) }
  }, [userId])

  const fetchIncome = useCallback(async () => {
    try {
      const res = await mlAPI.predictIncome({
        hoursWorked: user?.workingHours || 6,
        completedOrders: 12,
        avgOrderValue: 100,
        rain: weather?.rain || 0,
        temp: weather?.temp || 30,
        aqi: weather?.aqi || 100,
      })
      setIncome(res.data.expectedIncome)
    } catch { /* ML service optional */ }
  }, [user, weather])

  useEffect(() => { fetchWeather() }, [fetchWeather])
  useEffect(() => { fetchPolicies() }, [fetchPolicies])
  useEffect(() => { fetchClaims() }, [fetchClaims])
  useEffect(() => { if (weather) fetchIncome() }, [weather, fetchIncome])

  // Derived stats
  const activePolicy = policies.find(p => p) // first policy = active
  const approvedClaims = claims.filter(c => c.status === 'Approved')
  const totalPayout = approvedClaims.reduce((sum, c) => sum + (c.payout || c.triggerValue || 0), 0)
  const riskScore = weather
    ? Math.min(Math.round((weather.rain / 2) + (weather.aqi / 20) + Math.max(0, weather.temp - 35) * 3), 100)
    : null

  const getRiskLevel = (score) => {
    if (score === null) return { label: 'Unknown', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' }
    if (score >= 70) return { label: 'HIGH', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' }
    if (score >= 40) return { label: 'MEDIUM', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' }
    return { label: 'LOW', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' }
  }
  const risk = getRiskLevel(riskScore)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            {city && <span className="ml-2 text-slate-600">· {city}</span>}
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-slate-500 text-xs font-mono">Platform</p>
          <p className="text-amber-400 font-display font-bold text-base uppercase">{user?.platform || '—'}</p>
        </div>
      </div>

      {/* Weather alert banner */}
      {weather && (weather.rain > 60 || weather.temp > 40 || weather.aqi > 300) && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 flex items-center gap-3 animate-slide-up">
          <span className="text-rose-400 text-lg flex-shrink-0">🚨</span>
          <div>
            <p className="text-rose-300 font-body font-medium text-sm">Extreme Conditions Alert</p>
            <p className="text-rose-400/70 text-xs font-mono mt-0.5">
              {weather.rain > 60 && `Rain: ${weather.rain}mm `}
              {weather.temp > 40 && `Temp: ${weather.temp}°C `}
              {weather.aqi > 300 && `AQI: ${weather.aqi}`}
              — Parametric triggers active
            </p>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Active Policies"
          value={loadingPolicies ? null : policies.length}
          sub={activePolicy ? 'Protection ON' : 'No policy yet'}
          subColor={activePolicy ? 'text-emerald-400' : 'text-slate-500'}
          icon="🛡️"
        />
        <StatCard
          label="Total Payouts"
          value={loadingClaims ? null : `₹${totalPayout.toLocaleString('en-IN')}`}
          sub={`${approvedClaims.length} approved`}
          subColor="text-amber-400"
          icon="💸"
        />
        <StatCard
          label="Today's Risk"
          value={loadingWeather ? null : riskScore !== null ? `${riskScore}%` : 'N/A'}
          sub={risk.label}
          subColor={risk.color}
          icon="⚡"
        />
        <StatCard
          label="Est. Income"
          value={income ? `₹${Math.round(income).toLocaleString('en-IN')}` : loadingWeather ? null : '—'}
          sub="ML Prediction"
          subColor="text-slate-400"
          icon="📊"
        />
      </div>

      {/* Main grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Weather card */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-slate-200 uppercase tracking-wide">
              Live Conditions · {city}
            </h3>
            <Link to="/risk" className="text-amber-400 hover:text-amber-300 text-xs font-mono transition-colors">
              View Full →
            </Link>
          </div>
          {loadingWeather ? (
            <WeatherSkeleton />
          ) : weather ? (
            <div className="grid grid-cols-3 gap-3">
              <WeatherTile label="Rainfall" value={`${weather.rain}`} unit="mm" icon="🌧" alert={weather.rain > 80} />
              <WeatherTile label="Temperature" value={`${weather.temp}`} unit="°C" icon="🌡" alert={weather.temp > 45} />
              <WeatherTile label="AQI" value={`${weather.aqi}`} unit="" icon="💨" alert={weather.aqi > 400} />
            </div>
          ) : (
            <p className="text-slate-500 text-sm text-center py-4">Weather service unavailable</p>
          )}

          {weather && (
            <div className="pt-1 border-t border-navy-700">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">RISK SCORE</span>
                <span className={`font-mono font-medium ${risk.color}`}>{riskScore}% — {risk.label}</span>
              </div>
              <div className="mt-2 h-1.5 bg-navy-900 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${riskScore >= 70 ? 'bg-rose-500' : riskScore >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${riskScore}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Policy status card */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-slate-200 uppercase tracking-wide">My Protection</h3>
            <Link to="/policies" className="text-amber-400 hover:text-amber-300 text-xs font-mono transition-colors">
              Manage →
            </Link>
          </div>

          {loadingPolicies ? (
            <PolicySkeleton />
          ) : activePolicy ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-slow" />
                <span className="badge-success">ACTIVE</span>
                <span className="text-slate-500 text-xs font-mono ml-auto">{activePolicy.type || 'Standard'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="stat-card">
                  <p className="text-slate-500 text-xs font-mono mb-1">PREMIUM</p>
                  <p className="text-slate-100 font-display font-bold text-lg">₹{activePolicy.totalPremium}</p>
                </div>
                <div className="stat-card">
                  <p className="text-slate-500 text-xs font-mono mb-1">CITY RISK</p>
                  <p className="text-amber-400 font-display font-bold text-lg">+₹{activePolicy.cityRisk || 0}</p>
                </div>
              </div>
              <p className="text-slate-600 text-xs font-mono">
                Created {new Date(activePolicy.createdAt).toLocaleDateString('en-IN')}
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-slate-500 text-sm mb-4">No active policy. Start protecting your income.</p>
              <Link to="/policies" className="btn-primary inline-block w-auto px-8 py-2.5 text-sm">
                Get Protected
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent claims */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-base font-bold text-slate-200 uppercase tracking-wide">Recent Claims</h3>
          <Link to="/claims" className="text-amber-400 hover:text-amber-300 text-xs font-mono transition-colors">
            All Claims →
          </Link>
        </div>
        {loadingClaims ? (
          <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="shimmer-line h-12 rounded-lg" />)}</div>
        ) : claims.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-slate-500 text-sm">No claims yet</p>
            <p className="text-slate-600 text-xs mt-1 font-mono">Claims are auto-triggered during extreme weather</p>
          </div>
        ) : (
          <div className="space-y-2">
            {claims.slice(0, 4).map(claim => (
              <ClaimRow key={claim._id} claim={claim} />
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <QuickAction to="/policies" icon="🛡️" label="New Policy" sub="Start protection" />
        <QuickAction to="/claims" icon="📋" label="File Claim" sub="Submit income loss" />
        <QuickAction to="/risk" icon="🌩️" label="Risk Alerts" sub="Check conditions" />
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub, subColor, icon }) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xl">{icon}</span>
      </div>
      <div className="mt-1">
        {value === null ? (
          <div className="h-7 w-20 shimmer-line rounded mb-1" />
        ) : (
          <p className="font-display font-bold text-slate-100 text-xl leading-none">{value}</p>
        )}
        <p className="text-slate-500 text-xs font-mono uppercase tracking-wider mt-1">{label}</p>
        <p className={`text-xs mt-1 font-body ${subColor}`}>{sub}</p>
      </div>
    </div>
  )
}

function WeatherTile({ label, value, unit, icon, alert }) {
  return (
    <div className={`rounded-lg p-3 border ${alert ? 'bg-rose-500/10 border-rose-500/30' : 'bg-navy-900 border-navy-600'}`}>
      <div className="text-lg mb-1">{icon}</div>
      <p className={`font-display font-bold text-lg leading-none ${alert ? 'text-rose-400' : 'text-slate-100'}`}>
        {value}<span className="text-xs font-body ml-0.5">{unit}</span>
      </p>
      <p className="text-slate-500 text-xs font-mono mt-1">{label}</p>
      {alert && <p className="text-rose-400 text-xs mt-1">⚡ Trigger</p>}
    </div>
  )
}

function ClaimRow({ claim }) {
  const statusMap = {
    Approved: 'badge-success',
    Pending: 'badge-warning',
    Flagged: 'badge-danger',
  }
  const payout = claim.payout || claim.triggerValue || 0
  return (
    <div className="flex items-center justify-between py-2.5 px-3 bg-navy-900 rounded-lg border border-navy-700">
      <div className="flex items-center gap-3">
        <span className="text-base">{claim.triggerType === 'Rain' ? '🌧️' : claim.triggerType === 'Heat' ? '🌡️' : claim.triggerType === 'Pollution' ? '💨' : '📋'}</span>
        <div>
          <p className="text-slate-200 text-sm font-body font-medium">{claim.triggerType || 'Income Claim'}</p>
          <p className="text-slate-600 text-xs font-mono">{new Date(claim.createdAt).toLocaleDateString('en-IN')}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={statusMap[claim.status] || 'badge-warning'}>{claim.status}</span>
        {payout > 0 && <span className="text-emerald-400 font-display font-bold text-sm">+₹{Math.round(payout)}</span>}
      </div>
    </div>
  )
}

function QuickAction({ to, icon, label, sub }) {
  return (
    <Link to={to} className="card-hover flex items-center gap-3 group">
      <div className="w-10 h-10 bg-navy-900 rounded-lg flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-amber-500/10 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-slate-200 text-sm font-body font-medium">{label}</p>
        <p className="text-slate-500 text-xs">{sub}</p>
      </div>
    </Link>
  )
}

function WeatherSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[1,2,3].map(i => <div key={i} className="h-20 shimmer-line rounded-lg" />)}
    </div>
  )
}

function PolicySkeleton() {
  return (
    <div className="space-y-2">
      <div className="shimmer-line h-5 w-24 rounded" />
      <div className="grid grid-cols-2 gap-2">
        <div className="shimmer-line h-16 rounded-lg" />
        <div className="shimmer-line h-16 rounded-lg" />
      </div>
    </div>
  )
}
