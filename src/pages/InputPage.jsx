import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Plus, Info, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card'
import Button from '../components/ui/Button'
import useLadleStore from '../store/useLadleStore'
import { getAllLadles, LADLE_STATUS } from '../constants/ladleConfig'
import { formatNumber, calculatePercentage, getStatusEmoji, getStatusColor } from '../utils/formatters'
import { clsx } from 'clsx'

const InputPage = () => {
  const navigate = useNavigate()
  const [inputMode, setInputMode] = useState('usage') // 'initial' or 'usage'
  
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-1">PT TMMIN</p>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Input Data Ladle</h1>
        <p className="text-muted-foreground">
          Catat pemakaian ladle atau input tonase awal
        </p>
      </div>
      
      {/* Mode Selector */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg">
        <button
          onClick={() => setInputMode('usage')}
          className={clsx(
            'flex-1 px-4 py-2 rounded-md font-medium transition-all',
            inputMode === 'usage'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Input Shot Harian
        </button>
        <button
          onClick={() => setInputMode('initial')}
          className={clsx(
            'flex-1 px-4 py-2 rounded-md font-medium transition-all',
            inputMode === 'initial'
              ? 'bg-red-600 text-white shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Input Tonase Awal
        </button>
      </div>
      
      {/* Forms */}
      {inputMode === 'usage' ? <UsageForm navigate={navigate} /> : <InitialTonnageForm navigate={navigate} />}
    </div>
  )
}

// Water Glass Card Component – shows ladle as a glass filling with liquid
const LadleSelectCard = ({ ladle, isSelected, onClick, showTonnage = false }) => {
  const percentage = showTonnage ? calculatePercentage(ladle.currentTonnage, ladle.maxCapacity) : 0
  const statusColor = showTonnage ? getStatusColor(percentage) : 'normal'
  
  const waterColor = {
    normal:   { from: 'rgba(16,185,129,0.7)',  to: 'rgba(5,150,105,0.9)'  },
    caution:  { from: 'rgba(251,191,36,0.7)',  to: 'rgba(245,158,11,0.9)' },
    warning:  { from: 'rgba(251,146,60,0.7)',  to: 'rgba(234,88,12,0.9)'  },
    critical: { from: 'rgba(239,68,68,0.7)',   to: 'rgba(185,28,28,0.9)'  },
  }
  const colors = waterColor[statusColor] || waterColor.normal
  const fillHeight = showTonnage ? Math.min(percentage, 100) : 0

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'relative w-full rounded-2xl border-2 overflow-hidden transition-all duration-300 group flex flex-col items-center',
        isSelected
          ? 'border-red-500 shadow-lg shadow-red-500/20 scale-[1.03]'
          : 'border-border hover:border-red-500/50'
      )}
      style={{ height: '160px' }}
    >
      {/* Glass background */}
      <div className="absolute inset-0 bg-card" />

      {/* Water fill */}
      <div
        className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out"
        style={{ height: `${fillHeight}%` }}
      >
        {/* Wave layer 1 */}
        <svg
          className="absolute left-0 w-[200%] animate-water-wave"
          viewBox="0 0 1200 30"
          preserveAspectRatio="none"
          style={{ height: '12px', top: '-6px' }}
        >
          <path
            d="M0,15 C150,0 350,30 600,15 C850,0 1050,30 1200,15 L1200,30 L0,30 Z"
            fill={colors.from}
          />
        </svg>
        {/* Wave layer 2 */}
        <svg
          className="absolute left-0 w-[200%] animate-water-wave-reverse"
          viewBox="0 0 1200 30"
          preserveAspectRatio="none"
          style={{ height: '8px', top: '-3px', opacity: 0.6 }}
        >
          <path
            d="M0,15 C200,30 400,0 600,15 C800,30 1000,0 1200,15 L1200,30 L0,30 Z"
            fill={colors.to}
          />
        </svg>
        {/* Filled area - seamless fill */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${colors.from}, ${colors.to})`
          }}
        />
      </div>

      {/* Glass shine overlay */}
      <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white/10 to-transparent pointer-events-none rounded-l-2xl" />

      {/* Content – always on top */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-2 py-3">
        {/* Ladle number */}
        <span className={clsx(
          'text-2xl font-black font-mono drop-shadow-lg transition-colors',
          fillHeight > 55 ? 'text-white' : 'text-foreground'
        )}>
          {ladle.number}
        </span>
        {/* Type label */}
        <span className={clsx(
          'text-[10px] font-mono uppercase tracking-widest mt-0.5 drop-shadow',
          fillHeight > 55 ? 'text-white/80' : 'text-muted-foreground'
        )}>
          {ladle.type}
        </span>
        
        {/* Percentage */}
        {showTonnage && (
          <span className={clsx(
            'text-lg font-bold font-mono mt-2 drop-shadow-lg',
            fillHeight > 40 ? 'text-white' : 'text-foreground'
          )}>
            {percentage}%
          </span>
        )}

        {/* Selected checkmark */}
        {isSelected && (
          <div className="absolute top-2 right-2">
            <CheckCircle2 size={18} className="text-red-500 drop-shadow-lg" />
          </div>
        )}
      </div>

      {/* Bottom label */}
      {!showTonnage && (
        <div className={clsx(
          'absolute bottom-2 text-[9px] font-mono text-muted-foreground',
        )}>
          Max: {(ladle.maxCapacity / 1000).toFixed(0)}T
        </div>
      )}
    </button>
  )
}

// Initial Tonnage Form
const InitialTonnageForm = ({ navigate }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      ladleId: '',
      tonnage: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    }
  })
  
  const addInitialTonnage = useLadleStore((state) => state.addInitialTonnage)
  const ladles = useLadleStore((state) => state.ladles)
  const isLoading = useLadleStore((state) => state.isLoading)
  
  const selectedLadleId = watch('ladleId')
  const inputTonnage = watch('tonnage')
  
  const selectedLadle = ladles.find(l => l.id === selectedLadleId)
  const percentage = selectedLadle && inputTonnage ? 
    calculatePercentage(Number(inputTonnage), selectedLadle.maxCapacity) : 0
  const statusColor = getStatusColor(percentage)
  const emoji = getStatusEmoji(percentage)
  
  const onSubmit = (data) => {
    addInitialTonnage(data.ladleId, Number(data.tonnage), data.date, data.notes)
    setTimeout(() => {
      navigate('/')
    }, 600)
  }
  
  const allLadles = getAllLadles()
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info size={24} className="text-red-500" />
          Input Tonase Awal
        </CardTitle>
        <CardDescription>
          Input tonase awal untuk ladle yang sudah digunakan sebelum sistem ini aktif
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {/* Ladle Selection - Card Grid */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Pilih Ladle <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {allLadles.map((ladle) => (
                <LadleSelectCard
                  key={ladle.id}
                  ladle={ladle}
                  isSelected={selectedLadleId === ladle.id}
                  onClick={() => setValue('ladleId', ladle.id, { shouldValidate: true })}
                />
              ))}
            </div>
            <input type="hidden" {...register('ladleId', { required: 'Pilih ladle' })} />
            {errors.ladleId && (
              <p className="text-sm text-destructive">{errors.ladleId.message}</p>
            )}
          </div>
          
          {/* Tonnage Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Tonase Awal (kg) <span className="text-destructive">*</span>
            </label>
            <input
              type="number"
              {...register('tonnage', { 
                required: 'Masukkan tonase',
                min: { value: 0, message: 'Tonase harus positif' }
              })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background focus:border-red-500/50 focus:outline-none transition-colors"
              placeholder="Contoh: 450000"
            />
            {errors.tonnage && (
              <p className="text-sm text-destructive">{errors.tonnage.message}</p>
            )}
          </div>
          
          {/* Status Display */}
          {selectedLadle && inputTonnage && (
            <div className="p-4 bg-muted rounded-lg space-y-3 animate-fade-in">
              <h3 className="font-semibold flex items-center gap-2">
                📊 Status
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Kapasitas:</span>
                  <span className="font-medium">{formatNumber(selectedLadle.maxCapacity)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Input:</span>
                  <span className="font-medium">{formatNumber(Number(inputTonnage))} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Persentase:</span>
                  <span className={clsx(
                    'font-medium',
                    statusColor === 'normal' && 'text-status-normal',
                    statusColor === 'caution' && 'text-status-caution',
                    statusColor === 'warning' && 'text-status-warning',
                    statusColor === 'critical' && 'text-status-critical',
                  )}>
                    {emoji} {percentage}%
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Tanggal Mulai Tracking <span className="text-destructive">*</span>
            </label>
            <input
              type="date"
              {...register('date', { required: true })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background focus:border-red-500/50 focus:outline-none transition-colors"
            />
          </div>
          
          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Catatan (opsional)
            </label>
            <textarea
              {...register('notes')}
              className="w-full px-3 py-2 border border-border rounded-md bg-background resize-none focus:border-red-500/50 focus:outline-none transition-colors"
              rows={3}
              placeholder="Tambahkan catatan jika diperlukan..."
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/')}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : 'Simpan Data'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

// Usage Form (Daily Shots)
const UsageForm = ({ navigate }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      ladleId: '',
      shots: '',
      date: new Date().toISOString().split('T')[0],
    }
  })
  
  const addUsageRecord = useLadleStore((state) => state.addUsageRecord)
  const ladles = useLadleStore((state) => state.ladles)
  const isLoading = useLadleStore((state) => state.isLoading)
  
  const selectedLadleId = watch('ladleId')
  const shots = watch('shots')
  
  const selectedLadle = ladles.find(l => l.id === selectedLadleId)
  const tonnageFromShots = selectedLadle && shots ? shots * selectedLadle.kgPerShot : 0
  const newTonnage = selectedLadle ? selectedLadle.currentTonnage + tonnageFromShots : 0
  const percentage = selectedLadle ? calculatePercentage(newTonnage, selectedLadle.maxCapacity) : 0
  const statusColor = getStatusColor(percentage)
  const exceedsMax = percentage > 100
  
  const onSubmit = (data) => {
    addUsageRecord(data.ladleId, Number(data.shots), data.date)
    setTimeout(() => {
      navigate('/')
    }, 600)
  }
  
  // Filter only active ladles
  const activeLadles = ladles.filter(l => l.status === LADLE_STATUS.ACTIVE)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus size={24} className="text-red-500" />
          Input Shot Harian
        </CardTitle>
        <CardDescription>
          Catat jumlah shot pemakaian ladle hari ini
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {/* Ladle Selection - Card Grid */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Pilih Ladle <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {activeLadles.map((ladle) => (
                <LadleSelectCard
                  key={ladle.id}
                  ladle={ladle}
                  isSelected={selectedLadleId === ladle.id}
                  onClick={() => setValue('ladleId', ladle.id, { shouldValidate: true })}
                  showTonnage
                />
              ))}
            </div>
            <input type="hidden" {...register('ladleId', { required: 'Pilih ladle' })} />
            {errors.ladleId && (
              <p className="text-sm text-destructive">{errors.ladleId.message}</p>
            )}
            {selectedLadle && selectedLadle.status === LADLE_STATUS.MAINTENANCE && (
              <p className="text-sm text-orange-600 dark:text-orange-400">
                ⚠️ Ladle ini dalam status maintenance
              </p>
            )}
          </div>
          
          {/* Shots Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Total Shot (Hari Ini) <span className="text-destructive">*</span>
            </label>
            <input
              type="number"
              {...register('shots', { 
                required: 'Masukkan jumlah shot',
                min: { value: 1, message: 'Minimal 1 shot' }
              })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background focus:border-red-500/50 focus:outline-none transition-colors"
              placeholder="Contoh: 15"
            />
            {errors.shots && (
              <p className="text-sm text-destructive">{errors.shots.message}</p>
            )}
          </div>
          
          {/* Auto-calculation Display */}
          {selectedLadle && shots && (
            <div className="p-4 bg-muted rounded-lg space-y-3 animate-fade-in">
              <h3 className="font-semibold flex items-center gap-2">
                📊 Kalkulasi Otomatis
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shot Input:</span>
                  <span className="font-medium">{shots} shot</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tonase:</span>
                  <span className="font-medium">{formatNumber(tonnageFromShots)} kg</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sebelumnya:</span>
                  <span className="font-medium">{formatNumber(selectedLadle.currentTonnage)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Setelah Input:</span>
                  <span className="font-bold">{formatNumber(newTonnage)} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Progress:</span>
                  <span className={clsx(
                    'font-bold',
                    statusColor === 'normal' && 'text-status-normal',
                    statusColor === 'caution' && 'text-status-caution',
                    statusColor === 'warning' && 'text-status-warning',
                    statusColor === 'critical' && 'text-status-critical',
                  )}>
                    {percentage}%
                  </span>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-secondary rounded-full h-2.5">
                <div
                  className={clsx(
                    'h-full rounded-full transition-all',
                    statusColor === 'normal' && 'bg-status-normal',
                    statusColor === 'caution' && 'bg-status-caution',
                    statusColor === 'warning' && 'bg-status-warning',
                    statusColor === 'critical' && 'bg-status-critical',
                  )}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          )}
          
          {/* Warning if exceeds max */}
          {exceedsMax && (
            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-start gap-2">
              <AlertTriangle size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-orange-700 dark:text-orange-400">
                  Perhatian!
                </p>
                <p className="text-orange-600 dark:text-orange-300">
                  Tonase akan melebihi kapasitas maksimal. Pertimbangkan untuk relining setelah pemakaian ini.
                </p>
              </div>
            </div>
          )}
          
          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Tanggal <span className="text-destructive">*</span>
            </label>
            <input
              type="date"
              {...register('date', { required: true })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background focus:border-red-500/50 focus:outline-none transition-colors"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/')}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isLoading || !selectedLadle}>
            {isLoading ? 'Menyimpan...' : 'Simpan Data'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default InputPage
