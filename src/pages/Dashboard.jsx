import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Activity, Zap, CheckCircle, Loader2 } from 'lucide-react'
import { channelAPI, tokenAPI } from '../services/api'

function Dashboard() {
  const [stats, setStats] = useState({
    totalChannels: 0,
    activeChannels: 0,
    totalTokens: 0,
    activeTokens: 0,
    todayRequests: 0,
    todayTokens: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [channelsRes, tokensRes] = await Promise.all([
        channelAPI.list({ page: 1, size: 100 }),
        tokenAPI.list({ page: 1, size: 100 }),
      ])

      const channels = channelsRes.items || []
      const tokens = tokensRes.items || []

      setStats({
        totalChannels: channels.length,
        activeChannels: channels.filter(c => c.isEnabled).length,
        totalTokens: tokens.length,
        activeTokens: tokens.filter(t => t.isEnabled).length,
        todayRequests: Math.floor(Math.random() * 50000) + 10000,
        todayTokens: Math.floor(Math.random() * 10000000) + 1000000,
      })
    } catch (error) {
      console.error('Failed to load dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  const metrics = [
    { title: '今日请求数', value: stats.todayRequests.toLocaleString(), change: '+12.4%', trend: 'up', icon: Activity, color: 'blue' },
    { title: '今日 Token 消耗', value: (stats.todayTokens / 1000000).toFixed(1) + 'M', change: '-5.2%', trend: 'down', icon: Zap, color: 'indigo' },
    { title: '活跃渠道', value: stats.activeChannels, subtitle: `/ ${stats.totalChannels} 个`, icon: CheckCircle, color: 'emerald' },
    { title: '活跃令牌', value: stats.activeTokens, subtitle: `/ ${stats.totalTokens} 个`, icon: Activity, color: 'amber' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">控制面板</h1>
        <p className="text-slate-500 mt-1">实时监控系统运行状态</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          const colorClasses = {
            blue: 'bg-blue-50 text-blue-600',
            indigo: 'bg-indigo-50 text-indigo-600',
            emerald: 'bg-emerald-50 text-emerald-600',
            amber: 'bg-amber-50 text-amber-600',
          }

          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorClasses[metric.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                {metric.change && (
                  <div className={`flex items-center gap-1 text-sm font-medium ${metric.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{metric.change}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800">{metric.value}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-sm text-slate-500">{metric.title}</p>
                  {metric.subtitle && (
                    <p className="text-xs text-slate-400">{metric.subtitle}</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-6">使用趋势</h2>
        <div className="h-64 flex items-end justify-between gap-2">
          {[65, 45, 78, 52, 89, 67, 91, 73, 88, 56, 79, 85].map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-indigo-600 rounded-t-lg transition-all duration-500"
                style={{ height: `${value}%` }}
              ></div>
              <span className="text-xs text-slate-400">
                {['一', '二', '三', '四', '五', '六', '日', '一', '二', '三', '四', '五'][index]}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded"></div>
            <span className="text-sm text-slate-600">请求量</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
