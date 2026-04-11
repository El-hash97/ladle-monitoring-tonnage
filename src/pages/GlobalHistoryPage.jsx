import { useState, useMemo } from 'react'
import { Trash2, Filter, Download, Search } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import Button from '../components/ui/Button'
import useLadleStore from '../store/useLadleStore'
import { RECORD_TYPES } from '../constants/ladleConfig'
import { formatDate, formatNumber } from '../utils/formatters'
import { clsx } from 'clsx'

const GlobalHistoryPage = () => {
  const [filterType, setFilterType] = useState('all')
  const [filterLadle, setFilterLadle] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [recordToDelete, setRecordToDelete] = useState(null)
  
  const ladles = useLadleStore((state) => state.ladles)
  const getAllRecords = useLadleStore((state) => state.getAllRecords)
  const deleteRecord = useLadleStore((state) => state.deleteRecord)
  
  // Get all records from all ladles
  const allRecords = useMemo(() => {
    const records = []
    ladles.forEach(ladle => {
      const ladleRecords = getAllRecords(ladle.id)
      ladleRecords.forEach(record => {
        records.push({
          ...record,
          ladle,
        })
      })
    })
    return records.sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [ladles, getAllRecords])
  
  // Filter records
  const filteredRecords = useMemo(() => {
    return allRecords.filter(record => {
      // Filter by type
      if (filterType !== 'all' && record.type !== filterType) return false
      
      // Filter by ladle
      if (filterLadle !== 'all' && record.ladleId !== filterLadle) return false
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchLadle = record.ladleId.toLowerCase().includes(query)
        const matchDate = formatDate(record.date).toLowerCase().includes(query)
        const matchNotes = record.notes?.toLowerCase().includes(query)
        if (!matchLadle && !matchDate && !matchNotes) return false
      }
      
      return true
    })
  }, [allRecords, filterType, filterLadle, searchQuery])
  
  const handleDeleteClick = (record) => {
    setRecordToDelete(record)
    setShowDeleteModal(true)
  }
  
  const confirmDelete = () => {
    if (recordToDelete) {
      deleteRecord(recordToDelete.ladleId, recordToDelete.id)
      setShowDeleteModal(false)
      setRecordToDelete(null)
    }
  }
  
  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl glass-strong border border-border p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 via-accent/20 to-transparent rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-4xl font-black gradient-text mb-2">
            Usage History
          </h1>
          <p className="text-lg text-muted-foreground">
            Complete record of all ladle operations
          </p>
        </div>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-2 block text-muted-foreground">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ladle, date, or notes..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg glass border border-border bg-transparent focus:border-primary/50 focus:outline-none transition-colors"
                />
              </div>
            </div>
            
            {/* Type Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block text-muted-foreground">Record Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass border border-border bg-transparent focus:border-primary/50 focus:outline-none transition-colors"
              >
                <option value="all" className="bg-card">All Types</option>
                <option value="usage" className="bg-card">Usage</option>
                <option value="relining" className="bg-card">Relining</option>
                <option value="initial" className="bg-card">Initial</option>
              </select>
            </div>
            
            {/* Ladle Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block text-muted-foreground">Ladle</label>
              <select
                value={filterLadle}
                onChange={(e) => setFilterLadle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass border border-border bg-transparent focus:border-primary/50 focus:outline-none transition-colors"
              >
                <option value="all" className="bg-card">All Ladles</option>
                {ladles.map(ladle => (
                  <option key={ladle.id} value={ladle.id} className="bg-card">
                    {ladle.type}-{ladle.number}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-bold text-foreground">{filteredRecords.length}</span> of <span className="font-bold text-foreground">{allRecords.length}</span> records
            </p>
            <Button variant="outline" size="sm" className="gap-2">
              <Download size={16} />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Records Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-6 font-semibold text-sm text-muted-foreground">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-sm text-muted-foreground">Ladle</th>
                  <th className="text-center py-4 px-6 font-semibold text-sm text-muted-foreground">Type</th>
                  <th className="text-right py-4 px-6 font-semibold text-sm text-muted-foreground">Shots</th>
                  <th className="text-right py-4 px-6 font-semibold text-sm text-muted-foreground">Tonnage</th>
                  <th className="text-right py-4 px-6 font-semibold text-sm text-muted-foreground">Accumulated</th>
                  <th className="text-center py-4 px-6 font-semibold text-sm text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, index) => (
                  <tr
                    key={record.id}
                    className={clsx(
                      'border-b border-border hover:glass transition-colors group',
                      record.type === RECORD_TYPES.RELINING && 'bg-orange-500/5',
                      record.type === RECORD_TYPES.INITIAL && 'bg-red-500/5',
                      index % 2 === 0 && 'bg-white/[0.02]'
                    )}
                  >
                    <td className="py-4 px-6 text-sm font-mono">
                      {formatDate(record.date)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-xs font-bold text-white">
                          {record.ladle.number}
                        </div>
                        <span className="text-sm font-medium">{record.ladle.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {record.type === RECORD_TYPES.USAGE && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-500/10 text-red-400 text-xs font-medium">
                          📊 Usage
                        </span>
                      )}
                      {record.type === RECORD_TYPES.RELINING && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-500/10 text-orange-400 text-xs font-medium">
                          🔧 Relining
                        </span>
                      )}
                      {record.type === RECORD_TYPES.INITIAL && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-rose-500/10 text-rose-400 text-xs font-medium">
                          ⚙️ Initial
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-sm">
                      {record.type === RECORD_TYPES.USAGE ? record.shots : '-'}
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-sm">
                      {record.type === RECORD_TYPES.USAGE && formatNumber(record.tonnage) + ' kg'}
                      {record.type === RECORD_TYPES.RELINING && (
                        <span className="text-orange-400">RESET</span>
                      )}
                      {record.type === RECORD_TYPES.INITIAL && (
                        <span className="text-rose-400">INITIAL</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-sm font-mono">
                      {record.type === RECORD_TYPES.USAGE && formatNumber(record.tonnageAfterInput) + ' kg'}
                      {record.type === RECORD_TYPES.RELINING && formatNumber(record.tonnageBeforeReset) + ' kg'}
                      {record.type === RECORD_TYPES.INITIAL && formatNumber(record.initialTonnage) + ' kg'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(record)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredRecords.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Filter size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">No records found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && recordToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="max-w-md w-full animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-destructive">
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <Trash2 size={24} />
                </div>
                Delete Record
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 glass rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ladle:</span>
                  <span className="font-medium">{recordToDelete.ladle.type}-{recordToDelete.ladle.number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{formatDate(recordToDelete.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium capitalize">{recordToDelete.type}</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete this record? This action cannot be undone.
              </p>
              
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDelete}
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default GlobalHistoryPage
