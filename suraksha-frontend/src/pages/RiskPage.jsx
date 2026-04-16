import React, { useState, useEffect, useCallback } from 'react'
import { weatherAPI, mlAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

const CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat']

const TRIGGERS = [
  { key: 'rain', label: 'Rainfall', unit: 'mm', icon: '🌧️', thresholds: [{ val: 80, label: 'Trigger Level', color: 'amber' }, { val: 120, label: 'Extreme', color: 'rose' }] },
  { key: 'temp', label: 'Temperature', unit: '°C', icon: '🌡️', thresholds: [{ val: 45, label: 'Heatwave', color: 'amber' }] },
  { key: 'aqi', label: 'Air Quality', unit: 'AQI', icon: '💨', thresholds: [{ val: 300, label: 'Unhealthy', color: 'amber' }, { val: 400, label: 'Trigger Level', color: 'rose' }] },
]

export default function RiskPage() {
  const { user } = useAuth()
  const [selectedCity, setSelectedCity] = useState(user?.city || 'Delhi')
  const [weather, setWeather] = useState(null)
  const [loadingWeather, setLoadingWeather] = useState(false)
  const [income, setIncome] = useState(null)
  const [loadingIncome, setLoadingIncome] = useState(false)
  const [incomeParams, setIncomeParams] = useState({
    hoursWorked: user?.workingHours || 6,
    completedOrders: 12,
    avgOrderValue: 100,
  })

  const fetchWeather = useCallback(async (city) => {
    setLoadingWeather(true)
    setWeather(null)
    try {
      const res = await weatherAPI.getByCity(city)
      setWeather(res.data.data)
    } catch { }
    finally { setLoadingWeather(false) }
  }, [])

  const fetchIncome = useCallback(async (weatherData) => {
    if (!weatherData) return
    setLoadingIncome(true)
    try {
      const res = await mlAPI.predictIncome({
        hoursWorked: Number(incomeParams.hoursWorked),
        completedOrders: Number(incomeParams.completedOrders),
        avgOrderValue: Number(incomeParams.avgOrderValue),
        rain: weatherData.rain,
        temp: weatherData.temp,
        aqi: weatherData.aqi,
      })
      setIncome(res.data.expectedIncome)
    } catch { setIncome(null) }
    finally { setLoadingIncome(false) }
  }, [incomeParams])

  useEffect(() => { fetchWeather(selectedCity) }, [selectedCity, fetchWeather])
  useEffect(() => { if (weather) fetchIncome(weather) }, [weather, fetchIncome])

  const riskScore = weather
    ? Math.min(Math.round((weather.rain / 2) + (weather.aqi / 20) + Math.max(0, weather.temp - 35) * 3), 100)
    : null

  const activeTriggers = weather ? TRIGGERS.filter(t => {
    const val = weather[t.key]
    return t.thresholds.some(th => val >= th.val)
  }) : []

  const getRiskColor = (score) => {
    if (score >= 70) return { bar: 'bg-rose-500', text: 'text-rose-400', label: 'HIGH RISK' }
    if (score >= 40) return { bar: 'bg-amber-500', text: 'text-amber-400', label: 'MEDIUM RISK' }
    return { bar: 'bg-emerald-500', text: 'text-emerald-400', label: 'LOW RISK' }
  }
  const riskStyle = riskScore !== null ? getRiskColor(riskScore) : null

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="section-title">Risk & Weather</h1>
        <p className="text-slate-500 text-sm mt-1">Live conditions · Parametric trigger status · Income forecast</p>
      </div>

      {/* City selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-slate-400 text-sm font-body">City:</span>
        <div className="flex flex-wrap gap-2">
          {CITIES.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all duration-150 border
                ${selectedCity === c
                  ? 'bg-amber-500/10 border-amber-500/60 text-amber-400'
                  : 'bg-navy-900 border-navy-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Active trigger alert */}
      {activeTriggers.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/40 rounded-xl p-4 animate-slide-up">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-rose-400 text-lg">🚨</span>
            <p className="font-display font-bold text-rose-300 uppercase tracking-wide">
              {activeTriggers.length} Parametric Trigger{activeTriggers.length > 1 ? 's' : ''} Active
            </p>
          </div>
          <p className="text-rose-400/70 text-sm">
            {activeTriggers.map(t => t.label).join(', ')} exceed threshold levels.
            Auto-payouts will be processed for policy holders.
          </p>
        </div>
      )}

      {/* Live weather + risk */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Weather metrics */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-slate-200 uppercase tracking-wide">
              Live Conditions · {selectedCity}
            </h3>
            <button
              onClick={() => fetchWeather(selectedCity)}
              disabled={loadingWeather}
              className="text-slate-500 hover:text-amber-400 text-xs font-mono transition-colors"
            >
              {loadingWeather ? 'Loading...' : '↻ Refresh'}
            </button>
          </div>

          {loadingWeather ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="shimmer-line h-16 rounded-lg" />)}
            </div>
          ) : weather ? (
            <div className="space-y-3">
              {TRIGGERS.map(trigger => {
                const value = weather[trigger.key] ?? 0
                const maxTh = trigger.thresholds[trigger.thresholds.length - 1].val
                const pct = Math.min((value / (maxTh * 1.5)) * 100, 100)
                const triggered = trigger.thresholds.some(th => value >= th.val)
                const activeTh = [...trigger.thresholds].reverse().find(th => value >= th.val)

                return (
                  <div key={trigger.key} className={`rounded-lg p-3 border ${triggered ? 'bg-rose-500/5 border-rose-500/30' : 'bg-navy-900 border-navy-700'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span>{trigger.icon}</span>
                        <span className="text-slate-300 text-sm font-body font-medium">{trigger.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {activeTh && (
                          <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${activeTh.color === 'rose' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            ⚡ {activeTh.label}
                          </span>
                        )}
                        <span className={`font-display font-bold text-lg ${triggered ? 'text-rose-400' : 'text-slate-100'}`}>
                          {value}<span className="text-xs font-body ml-0.5">{trigger.unit}</span>
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${triggered ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      {trigger.thresholds.map(th => (
                        <span key={th.val} className="text-slate-600 text-xs font-mono">{th.label}: {th.val}{trigger.unit}</span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-slate-500 text-sm text-center py-6">Weather service unavailable</p>
          )}
        </div>

        {/* Risk score + income forecast */}
        <div className="space-y-4">
          {/* Risk score card */}
          <div className="card">
            <h3 className="font-display text-base font-bold text-slate-200 uppercase tracking-wide mb-4">Risk Score</h3>
            {riskScore !== null ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-display font-extrabold text-5xl ${riskStyle.text}`}>{riskScore}</span>
                  <div className="text-right">
                    <span className={`font-mono text-sm font-bold ${riskStyle.text}`}>{riskStyle.label}</span>
                    <p className="text-slate-600 text-xs mt-1">out of 100</p>
                  </div>
                </div>
                <div className="h-2 bg-navy-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${riskStyle.bar}`}
                    style={{ width: `${riskScore}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-center font-mono">
                  <div className="text-emerald-400">0–39<br /><span className="text-slate-600">Low</span></div>
                  <div className="text-amber-400">40–69<br /><span className="text-slate-600">Medium</span></div>
                  <div className="text-rose-400">70–100<br /><span className="text-slate-600">High</span></div>
                </div>
              </>
            ) : loadingWeather ? (
              <div className="shimmer-line h-20 rounded" />
            ) : (
              <p className="text-slate-500 text-sm">Select a city to see risk score</p>
            )}
          </div>

          {/* Income forecast */}
          <div className="card">
            <h3 className="font-display text-base font-bold text-slate-200 uppercase tracking-wide mb-4">
              Income Forecast
            </h3>
            <div className="space-y-3 mb-4">
              {[
                { key: 'hoursWorked', label: 'Hours Planned', min: 1, max: 16 },
                { key: 'completedOrders', label: 'Expected Orders', min: 1, max: 50 },
                { key: 'avgOrderValue', label: 'Avg Order (₹)', min: 50, max: 500 },
              ].map(f => (
                <div key={f.key}>
                  <div className="flex justify-between mb-1">
                    <label className="label mb-0">{f.label}</label>
                    <span className="text-amber-400 text-xs font-mono font-medium">{incomeParams[f.key]}</span>
                  </div>
                  <input
                    type="range"
                    min={f.min}
                    max={f.max}
                    value={incomeParams[f.key]}
                    onChange={e => setIncomeParams(p => ({ ...p, [f.key]: Number(e.target.value) }))}
                    className="w-full h-1.5 bg-navy-700 rounded-full appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
              ))}
              <button
                onClick={() => weather && fetchIncome(weather)}
                disabled={loadingIncome || !weather}
                className="w-full text-center text-xs text-amber-400 hover:text-amber-300 font-mono transition-colors py-1"
              >
                {loadingIncome ? 'Calculating...' : '↻ Recalculate'}
              </button>
            </div>

            {loadingIncome ? (
              <div className="shimmer-line h-16 rounded-lg" />
            ) : income ? (
              <div className="bg-navy-900 rounded-xl p-4 border border-navy-700">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: 'Expected', value: `₹${Math.round(income)}`, color: 'text-slate-100' },
                    { label: 'Risk Adj.', value: `₹${Math.round(income * 0.82)}`, color: 'text-amber-400' },
                    { label: 'Potential Loss', value: `₹${Math.round(income * 0.18)}`, color: 'text-rose-400' },
                  ].map(s => (
                    <div key={s.label}>
                      <p className={`font-display font-bold text-base ${s.color}`}>{s.value}</p>
                      <p className="text-slate-600 text-xs font-mono mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-slate-700 text-xs font-mono text-center mt-3">ML model · Based on current conditions</p>
              </div>
            ) : !weather ? (
              <p className="text-slate-600 text-xs font-mono text-center py-2">Select a city with weather data to enable forecast</p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Trigger reference table */}
      <div className="card">
        <h3 className="font-display text-base font-bold text-slate-200 uppercase tracking-wide mb-4">Parametric Trigger Reference</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="text-slate-500 font-mono text-xs uppercase pb-3 pr-4">Event</th>
                <th className="text-slate-500 font-mono text-xs uppercase pb-3 pr-4">Threshold</th>
                <th className="text-slate-500 font-mono text-xs uppercase pb-3 pr-4">Status</th>
                <th className="text-slate-500 font-mono text-xs uppercase pb-3">Current</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700">
              {[
                { event: '🌧️ Heavy Rain', threshold: '> 80mm', key: 'rain', limit: 80 },
                { event: '🌧️ Extreme Rain', threshold: '> 120mm', key: 'rain', limit: 120 },
                { event: '🌡️ Heatwave', threshold: '> 45°C', key: 'temp', limit: 45 },
                { event: '💨 Severe Pollution', threshold: '> 400 AQI', key: 'aqi', limit: 400 },
              ].map(row => {
                const currentVal = weather ? weather[row.key] : null
                const triggered = currentVal !== null && currentVal > row.limit
                return (
                  <tr key={row.event + row.limit}>
                    <td className="py-3 pr-4 text-slate-300 font-body">{row.event}</td>
                    <td className="py-3 pr-4 text-slate-400 font-mono">{row.threshold}</td>
                    <td className="py-3 pr-4">
                      {currentVal !== null ? (
                        <span className={triggered ? 'badge-danger' : 'badge-success'}>
                          {triggered ? '⚡ TRIGGERED' : '✓ OK'}
                        </span>
                      ) : (
                        <span className="text-slate-600 text-xs font-mono">—</span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className={`font-mono text-sm font-medium ${triggered ? 'text-rose-400' : 'text-slate-400'}`}>
                        {currentVal !== null ? `${currentVal}${row.key === 'rain' ? 'mm' : row.key === 'temp' ? '°C' : ''}` : '—'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
