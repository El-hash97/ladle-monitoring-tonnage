import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-xl text-muted-foreground">Halaman tidak ditemukan</p>
        <Link to="/">
          <Button>Kembali ke Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
