import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import InputPage from './pages/InputPage'
import HistoryPage from './pages/HistoryPage'
import GlobalHistoryPage from './pages/GlobalHistoryPage'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="input" element={<InputPage />} />
        <Route path="history" element={<GlobalHistoryPage />} />
        <Route path="history/:ladleId" element={<HistoryPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
