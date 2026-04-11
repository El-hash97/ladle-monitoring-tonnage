import { Activity, Zap, AlertTriangle, TrendingUp } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import useLadleStore from '../store/useLadleStore'
import LadleCard from '../components/Dashboard/LadleCard'
import SummaryCard from '../components/Dashboard/SummaryCard'
import { LADLE_CONFIG } from '../constants/ladleConfig'

const Dashboard = () => {
  const ladles = useLadleStore((state) => state.ladles)
  const stats = useLadleStore((state) => state.getSummaryStats())
  const trendData = useLadleStore((state) => state.getTrendData())
  const comparisonData = useLadleStore((state) => state.getComparisonData())
  
  const { todayShots, activeLadles, ladlesNeedingAttention, avgUsage } = stats
  
  // Separate FC and FCD ladles
  const fcLadles = ladles.filter(l => l.type === 'FC').sort((a, b) => a.number - b.number)
  const fcdLadles = ladles.filter(l => l.type === 'FCD').sort((a, b) => a.number - b.number)
  
  return (
    <div className="space-y-8 pb-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl glass-strong border border-border p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-600/20 via-red-900/20 to-transparent rounded-full blur-3xl" />
        <div className="relative z-10">
          <p className="text-sm font-semibold text-red-400 uppercase tracking-widest mb-2">PT Toyota Motor Manufacturing Indonesia</p>
          <h1 className="text-4xl md:text-5xl font-black gradient-text mb-3">
            Ladle Monitoring Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Real-time tracking and analytics for all FC and FCD ladles
          </p>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Shots Today"
          value={todayShots}
          icon={Activity}
          color="red"
        />
        <SummaryCard
          title="Active Ladles"
          value={`${activeLadles}/${ladles.length}`}
          icon={Zap}
          color="green"
        />
        <SummaryCard
          title="Needs Attention"
          value={ladlesNeedingAttention}
          icon={AlertTriangle}
          color={ladlesNeedingAttention > 0 ? 'orange' : 'green'}
        />
        <SummaryCard
          title="Avg Usage"
          value={`${avgUsage}%`}
          icon={TrendingUp}
          color="rose"
        />
      </div>
      
      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Trend Chart */}
        <div className="glass-strong rounded-2xl border border-border p-6 animate-slide-up">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-1">7-Day Usage Trend</h2>
            <p className="text-sm text-muted-foreground">Daily shot count across all ladles</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorShots" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="shots" 
                stroke="#dc2626" 
                strokeWidth={3}
                fill="url(#colorShots)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Comparison Chart */}
        <div className="glass-strong rounded-2xl border border-border p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-1">Top Ladles Comparison</h2>
            <p className="text-sm text-muted-foreground">Current tonnage distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={comparisonData}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Bar 
                dataKey="tonnage" 
                fill="url(#barGradient)" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Alert if any ladle needs attention */}
      {ladlesNeedingAttention > 0 && (
        <div className="glass-strong rounded-2xl border border-orange-500/30 p-6 flex items-start gap-4 animate-glow-pulse">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <AlertTriangle className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1 text-orange-400">
              Attention Required
            </h3>
            <p className="text-sm text-muted-foreground">
              {ladlesNeedingAttention} ladle{ladlesNeedingAttention > 1 ? 's' : ''} {ladlesNeedingAttention > 1 ? 'are' : 'is'} approaching or exceeding maximum capacity. 
              Consider performing relining soon.
            </p>
          </div>
        </div>
      )}
      
      {/* FC Ladles Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-12 rounded-full bg-gradient-to-b from-red-600 to-red-800" />
          <div>
            <h2 className="text-3xl font-bold">FC Ladles</h2>
            <p className="text-sm text-muted-foreground">
              {LADLE_CONFIG.FC.kgPerShot.toLocaleString()} kg/shot • Max {(LADLE_CONFIG.FC.maxCapacity / 1000).toLocaleString()}T
            </p>
          </div>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {fcLadles.map((ladle, index) => (
            <div 
              key={ladle.id} 
              className="animate-scale-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <LadleCard ladle={ladle} />
            </div>
          ))}
        </div>
      </div>
      
      {/* FCD Ladles Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-12 rounded-full bg-gradient-to-b from-red-500 to-rose-600" />
          <div>
            <h2 className="text-3xl font-bold">FCD Ladles</h2>
            <p className="text-sm text-muted-foreground">
              {LADLE_CONFIG.FCD.kgPerShot.toLocaleString()} kg/shot • Max {(LADLE_CONFIG.FCD.maxCapacity / 1000).toLocaleString()}T
            </p>
          </div>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fcdLadles.map((ladle, index) => (
            <div 
              key={ladle.id} 
              className="animate-scale-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <LadleCard ladle={ladle} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
