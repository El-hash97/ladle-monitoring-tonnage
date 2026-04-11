import { Link } from 'react-router-dom'
import { Wrench, Zap } from 'lucide-react'
import { Card } from '../ui/Card'
import { calculatePercentage, formatNumber, getStatusEmoji, getStatusColor } from '../../utils/formatters'
import { LADLE_STATUS } from '../../constants/ladleConfig'
import { clsx } from 'clsx'

const LadleCard = ({ ladle }) => {
  const percentage = calculatePercentage(ladle.currentTonnage, ladle.maxCapacity)
  const statusColor = getStatusColor(percentage)
  const emoji = getStatusEmoji(percentage)
  const isMaintenace = ladle.status === LADLE_STATUS.MAINTENANCE
  
  return (
    <Link to={`/history/${ladle.id}`}>
      <Card
        hover={!isMaintenace}
        className={clsx(
          'cursor-pointer overflow-hidden group relative',
          isMaintenace && 'opacity-60'
        )}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-red-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Header */}
        <div className={clsx(
          'px-5 py-4 border-b border-border relative z-10',
          !isMaintenace && 'bg-gradient-to-r from-red-600/10 to-red-900/10'
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={clsx(
                'w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg',
                isMaintenace ? 'glass' : 'bg-gradient-to-br from-red-600 to-red-800 text-white shadow-lg'
              )}>
                {ladle.number}
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono">
                  {ladle.type}
                </p>
                {!isMaintenace && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Zap size={12} className="text-red-500" />
                    <span className="text-xs font-medium text-red-500">Active</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-3xl">
              {isMaintenace ? <Wrench className="text-muted-foreground" size={28} /> : emoji}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 space-y-4 relative z-10">
          {/* Tonnage Display */}
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-3xl font-black gradient-text font-mono">
                {formatNumber(ladle.currentTonnage)}
              </span>
              <span className="text-xs text-muted-foreground">kg</span>
            </div>
            <p className="text-xs text-muted-foreground font-mono">
              Max: {formatNumber(ladle.maxCapacity)} kg
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="relative w-full h-2 rounded-full overflow-hidden glass">
              <div
                className={clsx(
                  'h-full rounded-full transition-all duration-700 relative overflow-hidden',
                  statusColor === 'normal' && 'bg-gradient-to-r from-green-500 to-emerald-500',
                  statusColor === 'caution' && 'bg-gradient-to-r from-yellow-500 to-orange-400',
                  statusColor === 'warning' && 'bg-gradient-to-r from-orange-500 to-red-500',
                  statusColor === 'critical' && 'bg-gradient-to-r from-red-500 to-pink-600',
                  isMaintenace && 'bg-status-maintenance'
                )}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              >
                <div className="absolute inset-0 animate-shimmer" />
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold font-mono">{percentage}%</span>
              <span className={clsx(
                'font-semibold px-2 py-0.5 rounded-md',
                statusColor === 'normal' && 'text-green-400 bg-green-500/10',
                statusColor === 'caution' && 'text-yellow-400 bg-yellow-500/10',
                statusColor === 'warning' && 'text-orange-400 bg-orange-500/10',
                statusColor === 'critical' && 'text-red-400 bg-red-500/10',
                isMaintenace && 'text-gray-400 bg-gray-500/10'
              )}>
                {isMaintenace ? 'Maintenance' : 
                  statusColor === 'normal' ? 'Normal' :
                  statusColor === 'caution' ? 'Caution' :
                  statusColor === 'warning' ? 'Near Max' :
                  'Exceeded'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Hover indicator */}
        {!isMaintenace && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        )}
      </Card>
    </Link>
  )
}

export default LadleCard
