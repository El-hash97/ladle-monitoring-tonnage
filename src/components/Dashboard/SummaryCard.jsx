import { Card, CardContent } from '../ui/Card'
import { clsx } from 'clsx'

const SummaryCard = ({ title, value, icon: Icon, color = 'red' }) => {
  const colorClasses = {
    red: {
      bg: 'from-red-500/20 to-rose-500/20',
      icon: 'from-red-600 to-red-800',
      text: 'text-red-400',
      glow: 'group-hover:shadow-[0_0_30px_rgba(220,38,38,0.3)]',
    },
    green: {
      bg: 'from-green-500/20 to-emerald-500/20',
      icon: 'from-green-500 to-emerald-500',
      text: 'text-green-400',
      glow: 'group-hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]',
    },
    orange: {
      bg: 'from-orange-500/20 to-red-500/20',
      icon: 'from-orange-500 to-red-500',
      text: 'text-orange-400',
      glow: 'group-hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]',
    },
    rose: {
      bg: 'from-rose-500/20 to-pink-500/20',
      icon: 'from-rose-500 to-pink-500',
      text: 'text-rose-400',
      glow: 'group-hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]',
    },
  }
  
  const colors = colorClasses[color] || colorClasses.red
  
  return (
    <Card 
      className={clsx(
        'group cursor-default transition-all duration-300',
        colors.glow
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              {title}
            </p>
            <p className="text-4xl font-black tracking-tight gradient-text">
              {value}
            </p>
          </div>
          <div className={clsx(
            'relative flex-shrink-0'
          )}>
            {/* Icon background glow */}
            <div className={clsx(
              'absolute inset-0 rounded-2xl blur-xl transition-opacity duration-300 opacity-50 group-hover:opacity-100',
              `bg-gradient-to-br ${colors.bg}`
            )} />
            
            {/* Icon */}
            <div className={clsx(
              'relative flex items-center justify-center w-16 h-16 rounded-2xl',
              `bg-gradient-to-br ${colors.icon}`,
              'shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6'
            )}>
              <Icon size={28} strokeWidth={2.5} className="text-white" />
            </div>
          </div>
        </div>
        
        {/* Bottom gradient line */}
        <div className={clsx(
          'mt-4 h-1 rounded-full',
          `bg-gradient-to-r ${colors.icon}`,
          'transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500'
        )} />
      </CardContent>
    </Card>
  )
}

export default SummaryCard
