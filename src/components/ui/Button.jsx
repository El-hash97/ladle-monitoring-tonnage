import { clsx } from 'clsx'

const Button = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '',
  disabled = false,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95'
  
  const variants = {
    default: 'bg-gradient-to-r from-red-600 to-red-800 text-white hover:opacity-90 shadow-lg hover:shadow-xl glow',
    primary: 'bg-gradient-to-r from-red-600 to-red-800 text-white hover:opacity-90 shadow-lg hover:shadow-xl glow',
    secondary: 'glass hover:glass-strong text-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-border glass hover:glass-strong',
    ghost: 'hover:glass text-foreground/80 hover:text-foreground',
  }
  
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8 text-lg',
    icon: 'h-10 w-10',
  }
  
  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
