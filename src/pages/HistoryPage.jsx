import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Wrench, Download, ToggleLeft, ToggleRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import useLadleStore from '../store/useLadleStore'
import { LADLE_STATUS, RECORD_TYPES } from '../constants/ladleConfig'
import { formatDate, formatNumber, calculatePercentage, getStatusEmoji, getStatusColor } from '../utils/formatters'
import { clsx } from 'clsx'

const HistoryPage = () => {
  const { ladleId } = useParams()
  const navigate = useNavigate()
  const [showReliningModal, setShowReliningModal] = useState(false)
  const [reliningDate, setReliningDate] = useState(new Date().toISOString().split('T')[0])
  const [reliningNotes, setReliningNotes] = useState('')
  
  const ladle = useLadleStore((state) => state.getLadleById(ladleId))
  const records = useLadleStore((state) => state.getRecordsByLadleId(ladleId))
  const performRelining = useLadleStore((state) => state.performRelining)
  const changeLadleStatus = useLadleStore((state) => state.changeLadleStatus)
  const isLoading = useLadleStore((state) => state.isLoading)
  
  if (!ladle) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Ladle tidak ditemukan</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          Kembali ke Dashboard
        </Button>
      </div>
    )
  }
  
  const percentage = calculatePercentage(ladle.currentTonnage, ladle.maxCapacity)
  const statusColor = getStatusColor(percentage)
  const emoji = getStatusEmoji(percentage)
  const isActive = ladle.status === LADLE_STATUS.ACTIVE
  
  const handleRelining = () => {
    performRelining(ladleId, reliningDate, reliningNotes)
    setShowReliningModal(false)
    setReliningNotes('')
  }
  
  const handleStatusToggle = () => {
    const newStatus = isActive ? LADLE_STATUS.MAINTENANCE : LADLE_STATUS.ACTIVE
    changeLadleStatus(ladleId, newStatus)
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">History Ladle {ladle.type}-{ladle.number}</h1>
            <p className="text-muted-foreground">
              Detail pemakaian dan riwayat maintenance
            </p>
          </div>
        </div>
      </div>
      
      {/* Ladle Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Current Status */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Status Saat Ini</h3>
                <span className="text-3xl">{emoji}</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-3xl font-bold">
                      {formatNumber(ladle.currentTonnage)}
                    </span>
                    <span className="text-muted-foreground">/ {formatNumber(ladle.maxCapacity)} kg</span>
                  </div>
                  
                  <div className="w-full bg-secondary rounded-full h-3">
                    <div
                      className={clsx(
                        'h-full rounded-full transition-all',
                        statusColor === 'normal' && 'bg-status-normal',
                        statusColor === 'caution' && 'bg-status-caution',
                        statusColor === 'warning' && 'bg-status-warning',
                        statusColor === 'critical' && 'bg-status-critical',
                        ladle.status === LADLE_STATUS.MAINTENANCE && 'bg-status-maintenance'
                      )}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm mt-1">
                    <span className="font-medium">{percentage}%</span>
                    <span className={clsx(
                      'font-medium',
                      statusColor === 'normal' && 'text-status-normal',
                      statusColor === 'caution' && 'text-status-caution',
                      statusColor === 'warning' && 'text-status-warning',
                      statusColor === 'critical' && 'text-status-critical',
                    )}>
                      {statusColor === 'normal' ? 'Normal' :
                        statusColor === 'caution' ? 'Perhatian' :
                        statusColor === 'warning' ? 'Mendekati Max' :
                        'Melebihi Max'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <div className={clsx(
                    'w-2 h-2 rounded-full',
                    isActive ? 'bg-status-normal' : 'bg-status-maintenance'
                  )} />
                  <span className="font-medium">
                    {isActive ? 'Active' : 'Maintenance'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Lifetime Stats */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Statistik Lifetime</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Total Shot</p>
                  <p className="text-2xl font-bold">{formatNumber(ladle.lifetimeShots)}</p>
                </div>
                
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Total Tonase</p>
                  <p className="text-2xl font-bold">{(ladle.lifetimeTonnage / 1000).toFixed(0)}T</p>
                </div>
                
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Relining Count</p>
                  <p className="text-2xl font-bold">{ladle.reliningCount}x</p>
                </div>
                
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Last Relining</p>
                  <p className="text-sm font-medium">{formatDate(ladle.lastReliningDate)}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 mt-6 pt-6 border-t">
            <Button
              onClick={() => setShowReliningModal(true)}
              disabled={!isActive}
              className="gap-2"
            >
              <Wrench size={18} />
              Relining
            </Button>
            
            <Button
              variant="outline"
              onClick={handleStatusToggle}
              className="gap-2"
            >
              {isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
              {isActive ? 'Set Maintenance' : 'Aktifkan'}
            </Button>
            
            <Button variant="outline" className="gap-2 ml-auto">
              <Download size={18} />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pemakaian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Tanggal</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm">Shot</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Tonase</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Akumulasi</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm">Tipe</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr
                    key={record.id}
                    className={clsx(
                      'border-b hover:bg-muted/50 transition-colors',
                      record.type === RECORD_TYPES.RELINING && 'bg-orange-500/5'
                    )}
                  >
                    <td className="py-3 px-4 text-sm">
                      {formatDate(record.date)}
                    </td>
                    <td className="py-3 px-4 text-sm text-center">
                      {record.type === RECORD_TYPES.USAGE ? record.shots : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-medium">
                      {record.type === RECORD_TYPES.USAGE && formatNumber(record.tonnage) + ' kg'}
                      {record.type === RECORD_TYPES.RELINING && (
                        <span className="text-orange-600 dark:text-orange-400">RESET</span>
                      )}
                      {record.type === RECORD_TYPES.INITIAL && (
                        <span className="text-red-600 dark:text-red-400">INITIAL</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-medium">
                      {record.type === RECORD_TYPES.USAGE && formatNumber(record.tonnageAfterInput) + ' kg'}
                      {record.type === RECORD_TYPES.RELINING && formatNumber(record.tonnageBeforeReset) + ' kg'}
                      {record.type === RECORD_TYPES.INITIAL && formatNumber(record.initialTonnage) + ' kg'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {record.type === RECORD_TYPES.USAGE && <span className="text-xl">📊</span>}
                      {record.type === RECORD_TYPES.RELINING && <span className="text-xl">🔧</span>}
                      {record.type === RECORD_TYPES.INITIAL && <span className="text-xl">⚙️</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {records.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                Belum ada data pemakaian
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Relining Modal */}
      {showReliningModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="text-orange-500" />
                Konfirmasi Relining
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ladle:</span>
                  <span className="font-medium">{ladle.type}-{ladle.number}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Tonase:</span>
                  <span className="font-medium">{formatNumber(ladle.currentTonnage)} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Lifetime:</span>
                  <span className="font-medium">{formatNumber(ladle.lifetimeTonnage)} kg</span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <p className="font-medium">Relining akan:</p>
                <ul className="space-y-1 ml-4">
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Reset current tonase ke 0 kg</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Simpan record di history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Status → Maintenance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Lifetime stats tetap berjalan</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tanggal Relining *</label>
                <input
                  type="date"
                  value={reliningDate}
                  onChange={(e) => setReliningDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Catatan</label>
                <textarea
                  value={reliningNotes}
                  onChange={(e) => setReliningNotes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background resize-none"
                  rows={3}
                  placeholder="Tambahkan catatan..."
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowReliningModal(false)}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleRelining}
                  disabled={isLoading}
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  {isLoading ? 'Memproses...' : 'Konfirmasi Relining'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default HistoryPage
