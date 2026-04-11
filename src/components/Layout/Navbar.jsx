import { Link, useLocation } from 'react-router-dom'
import { PlusCircle, History, LayoutDashboard, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'
import Button from '../ui/Button'
import logo from '../../assets/logo.png'

const Navbar = () => {
  const location = useLocation()
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme')
    if (stored) return stored === 'dark'
    return true // default dark
  })
  
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])
  
  const isActive = (path) => {
    return location.pathname === path
  }
  
  return (
    <nav className="sticky top-0 z-50 glass-strong border-b border-border">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-12 h-12 overflow-hidden rounded-xl bg-black border border-white/10 group-hover:border-red-500/50 transition-all duration-300 shadow-lg">
              <img src={logo} alt="Ladle Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold">PT TMMIN</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-tighter">Ladle Monitoring</p>
            </div>
          </Link>
          
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                size="sm"
                className={isActive('/') ? 'bg-gradient-to-r from-red-600 to-red-800 hover:opacity-90' : ''}
              >
                <LayoutDashboard size={18} />
                <span className="hidden sm:inline ml-2">Dashboard</span>
              </Button>
            </Link>
            
            <Link to="/input">
              <Button
                variant={isActive('/input') ? 'default' : 'ghost'}
                size="sm"
                className={isActive('/input') ? 'bg-gradient-to-r from-red-600 to-red-800 hover:opacity-90' : ''}
              >
                <PlusCircle size={18} />
                <span className="hidden sm:inline ml-2">Input</span>
              </Button>
            </Link>
            
            <Link to="/history">
              <Button
                variant={isActive('/history') ? 'default' : 'ghost'}
                size="sm"
                className={isActive('/history') ? 'bg-gradient-to-r from-red-600 to-red-800 hover:opacity-90' : ''}
              >
                <History size={18} />
                <span className="hidden sm:inline ml-2">History</span>
              </Button>
            </Link>
            
            {/* Theme Toggle */}
            <div className="ml-2 border-l border-border pl-2">
              <button
                onClick={() => setIsDark(!isDark)}
                className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-muted transition-all duration-300 active:scale-90"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? (
                  <Sun size={18} className="text-yellow-400 transition-transform duration-300 hover:rotate-45" />
                ) : (
                  <Moon size={18} className="text-slate-600 transition-transform duration-300 hover:-rotate-12" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
