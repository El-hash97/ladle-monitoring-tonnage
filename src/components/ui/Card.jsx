import { clsx } from 'clsx'

const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={clsx(
        'rounded-2xl glass border border-border shadow-xl',
        hover && 'transition-all duration-300 hover:glass-strong hover:scale-[1.02] hover:shadow-2xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div
      className={clsx('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    >
      {children}
    </div>
  )
}

const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3
      className={clsx(
        'text-2xl font-semibold leading-none tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

const CardDescription = ({ children, className = '', ...props }) => {
  return (
    <p
      className={clsx('text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  )
}

const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={clsx('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  )
}

const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div
      className={clsx('flex items-center p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
