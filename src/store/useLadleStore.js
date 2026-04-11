import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { generateMockLadles, generateMockRecords, generateEmptyLadles } from '../data/mockData'
import { LADLE_STATUS, RECORD_TYPES } from '../constants/ladleConfig'

const useLadleStore = create(
  persist(
    (set, get) => ({
      // State
      ladles: generateEmptyLadles(),
      records: {},
      isLoading: false,
      error: null,
      
      // Actions
      
      // Get summary stats for dashboard
      getSummaryStats: () => {
        const { ladles, records } = get()
        const today = new Date().toDateString()
        
        let todayShots = 0
        Object.values(records).forEach(ladleRecords => {
          ladleRecords.forEach(record => {
            if (record.type === RECORD_TYPES.USAGE && new Date(record.date).toDateString() === today) {
              todayShots += record.shots
            }
          })
        })
        
        const activeLadles = ladles.filter(l => l.status === LADLE_STATUS.ACTIVE).length
        const ladlesNeedingAttention = ladles.filter(l => (l.currentTonnage / l.maxCapacity) >= 0.8).length
        const avgUsage = Math.round(ladles.reduce((acc, l) => acc + (l.currentTonnage / l.maxCapacity * 100), 0) / ladles.length) || 0
        
        return {
          todayShots,
          activeLadles,
          ladlesNeedingAttention,
          avgUsage
        }
      },
      
      // Get chart data for trend
      getTrendData: () => {
        const { records } = get()
        const data = []
        const today = new Date()
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today)
          date.setDate(date.getDate() - i)
          const dateStr = date.toDateString()
          const label = date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
          
          let dayShots = 0
          Object.values(records).forEach(ladleRecords => {
            ladleRecords.forEach(record => {
              if (record.type === RECORD_TYPES.USAGE && new Date(record.date).toDateString() === dateStr) {
                dayShots += record.shots
              }
            })
          })
          
          data.push({
            date: label,
            shots: dayShots
          })
        }
        
        return data
      },
      
      // Get comparison data for bar chart
      getComparisonData: () => {
        const { ladles } = get()
        return ladles
          .sort((a, b) => b.currentTonnage - a.currentTonnage)
          .slice(0, 6)
          .map(ladle => ({
            name: `${ladle.type}-${ladle.number}`,
            tonnage: ladle.currentTonnage / 1000,
            percentage: Math.round((ladle.currentTonnage / ladle.maxCapacity) * 100)
          }))
      },
  
  // Get ladle by ID
  getLadleById: (id) => {
    return get().ladles.find(ladle => ladle.id === id)
  },
  
  // Get records for a ladle
  getRecordsByLadleId: (ladleId) => {
    return get().records[ladleId] || []
  },
  
  // Get all records (for global history)
  getAllRecords: (ladleId) => {
    return get().getRecordsByLadleId(ladleId)
  },
  
  // Delete record
  deleteRecord: (ladleId, recordId) => {
    set((state) => {
      const ladleRecords = state.records[ladleId] || []
      const record = ladleRecords.find(r => r.id === recordId)
      
      if (!record || record.type === RECORD_TYPES.INITIAL) {
        // Can't delete initial records
        return state
      }
      
      // Remove the record
      const newRecords = ladleRecords.filter(r => r.id !== recordId)
      
      // Recalculate ladle tonnage if it's a usage record
      const ladle = state.ladles.find(l => l.id === ladleId)
      if (!ladle) return state
      
      let newCurrentTonnage = ladle.currentTonnage
      let newCurrentShots = ladle.currentShots
      let newLifetimeTonnage = ladle.lifetimeTonnage
      let newLifetimeShots = ladle.lifetimeShots
      
      if (record.type === RECORD_TYPES.USAGE) {
        newCurrentTonnage -= record.tonnage
        newCurrentShots -= record.shots
        newLifetimeTonnage -= record.tonnage
        newLifetimeShots -= record.shots
      }
      
      return {
        records: {
          ...state.records,
          [ladleId]: newRecords,
        },
        ladles: state.ladles.map(l =>
          l.id === ladleId
            ? {
                ...l,
                currentTonnage: Math.max(0, newCurrentTonnage),
                currentShots: Math.max(0, newCurrentShots),
                lifetimeTonnage: Math.max(0, newLifetimeTonnage),
                lifetimeShots: Math.max(0, newLifetimeShots),
                updatedAt: new Date().toISOString(),
              }
            : l
        ),
      }
    })
  },
  
  // Add initial tonnage
  addInitialTonnage: (ladleId, tonnage, date, notes) => {
    set({ isLoading: true })
    
    setTimeout(() => {
      const newRecord = {
        id: `initial-${ladleId}-${Date.now()}`,
        ladleId,
        type: RECORD_TYPES.INITIAL,
        date: new Date(date).toISOString(),
        initialTonnage: tonnage,
        notes,
        createdAt: new Date().toISOString(),
      }
      
      // Update ladle
      set((state) => ({
        ladles: state.ladles.map(ladle =>
          ladle.id === ladleId
            ? {
                ...ladle,
                currentTonnage: tonnage,
                currentShots: Math.floor(tonnage / ladle.kgPerShot),
                lifetimeTonnage: tonnage,
                lifetimeShots: Math.floor(tonnage / ladle.kgPerShot),
                status: LADLE_STATUS.ACTIVE,
                initialTonnageDate: new Date(date).toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : ladle
        ),
        records: {
          ...state.records,
          [ladleId]: [newRecord, ...(state.records[ladleId] || [])],
        },
        isLoading: false,
      }))
    }, 500)
  },
  
  // Add usage record
  addUsageRecord: (ladleId, shots, date) => {
    set({ isLoading: true })
    
    setTimeout(() => {
      const ladle = get().getLadleById(ladleId)
      if (!ladle) return
      
      const tonnage = shots * ladle.kgPerShot
      const tonnageBeforeInput = ladle.currentTonnage
      const tonnageAfterInput = tonnageBeforeInput + tonnage
      
      const newRecord = {
        id: `usage-${ladleId}-${Date.now()}`,
        ladleId,
        type: RECORD_TYPES.USAGE,
        date: new Date(date).toISOString(),
        shots,
        tonnage,
        tonnageBeforeInput,
        tonnageAfterInput,
        createdAt: new Date().toISOString(),
      }
      
      // Update ladle
      set((state) => ({
        ladles: state.ladles.map(l =>
          l.id === ladleId
            ? {
                ...l,
                currentTonnage: tonnageAfterInput,
                currentShots: l.currentShots + shots,
                lifetimeTonnage: l.lifetimeTonnage + tonnage,
                lifetimeShots: l.lifetimeShots + shots,
                lastUsedDate: new Date(date).toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : l
        ),
        records: {
          ...state.records,
          [ladleId]: [newRecord, ...(state.records[ladleId] || [])],
        },
        isLoading: false,
      }))
    }, 500)
  },
  
  // Perform relining
  performRelining: (ladleId, date, notes) => {
    set({ isLoading: true })
    
    setTimeout(() => {
      const ladle = get().getLadleById(ladleId)
      if (!ladle) return
      
      const newRecord = {
        id: `relining-${ladleId}-${Date.now()}`,
        ladleId,
        type: RECORD_TYPES.RELINING,
        date: new Date(date).toISOString(),
        tonnageBeforeReset: ladle.currentTonnage,
        notes,
        createdAt: new Date().toISOString(),
      }
      
      // Update ladle
      set((state) => ({
        ladles: state.ladles.map(l =>
          l.id === ladleId
            ? {
                ...l,
                currentTonnage: 0,
                currentShots: 0,
                reliningCount: l.reliningCount + 1,
                status: LADLE_STATUS.MAINTENANCE,
                lastReliningDate: new Date(date).toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : l
        ),
        records: {
          ...state.records,
          [ladleId]: [newRecord, ...(state.records[ladleId] || [])],
        },
        isLoading: false,
      }))
    }, 500)
  },
  
  // Change ladle status
  changeLadleStatus: (ladleId, status) => {
    set((state) => ({
      ladles: state.ladles.map(ladle =>
        ladle.id === ladleId
          ? {
              ...ladle,
              status,
              updatedAt: new Date().toISOString(),
            }
          : ladle
      ),
    }))
  },
  
      // Reset store (for development)
      resetStore: () => {
        set({
          ladles: generateEmptyLadles(),
          records: {},
          isLoading: false,
          error: null,
        })
      },
    }),
    {
      name: 'ladle-monitoring-v5', // Changed to v5 to clear usage history without mock generation
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useLadleStore
