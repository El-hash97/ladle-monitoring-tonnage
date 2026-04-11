import { LADLE_STATUS, RECORD_TYPES, getAllLadles } from '../constants/ladleConfig'

// Generate empty ladles with zeroed data
export const generateEmptyLadles = () => {
  const allLadles = getAllLadles()
  
  return allLadles.map((ladle) => {
    return {
      ...ladle,
      currentTonnage: 0,
      currentShots: 0,
      lifetimeTonnage: 0,
      lifetimeShots: 0,
      reliningCount: 0,
      status: LADLE_STATUS.ACTIVE,
      lastUsedDate: null,
      lastReliningDate: null,
      initialTonnageDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  })
}

// Generate mock ladles with initial data (for demo/development)
export const generateMockLadles = () => {
  const allLadles = getAllLadles()
  
  return allLadles.map((ladle, index) => {
    // Vary the current tonnage for demo
    const percentages = [25, 45, 78, 92, 68, 30, 95, 60, 15, 85, 72, 55]
    const percentage = percentages[index % percentages.length]
    const currentTonnage = Math.floor((percentage / 100) * ladle.maxCapacity)
    
    return {
      ...ladle,
      currentTonnage,
      currentShots: Math.floor(currentTonnage / ladle.kgPerShot),
      lifetimeTonnage: currentTonnage + Math.floor(Math.random() * 500000),
      lifetimeShots: Math.floor((currentTonnage + Math.random() * 500000) / ladle.kgPerShot),
      reliningCount: Math.floor(Math.random() * 5),
      status: percentage > 90 ? LADLE_STATUS.MAINTENANCE : LADLE_STATUS.ACTIVE,
      lastUsedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      lastReliningDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      initialTonnageDate: new Date('2024-02-01').toISOString(),
      createdAt: new Date('2024-02-01').toISOString(),
      updatedAt: new Date().toISOString(),
    }
  })
}

// Generate mock records for a ladle
export const generateMockRecords = (ladleId, count = 30) => {
  const records = []
  const ladle = generateMockLadles().find(l => l.id === ladleId)
  
  if (!ladle) return []
  
  let accumulatedTonnage = 0
  const startDate = new Date('2024-02-01')
  
  // Initial record
  records.push({
    id: `initial-${ladleId}`,
    ladleId,
    type: RECORD_TYPES.INITIAL,
    date: startDate.toISOString(),
    initialTonnage: Math.floor(Math.random() * 200000),
    createdAt: startDate.toISOString(),
  })
  
  accumulatedTonnage = records[0].initialTonnage
  
  // Generate usage records
  for (let i = 0; i < count; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i + 1)
    
    // Random relining every 10-15 records
    if (i > 0 && i % 12 === 0 && Math.random() > 0.5) {
      records.push({
        id: `relining-${ladleId}-${i}`,
        ladleId,
        type: RECORD_TYPES.RELINING,
        date: date.toISOString(),
        tonnageBeforeReset: accumulatedTonnage,
        notes: 'Scheduled maintenance',
        createdAt: date.toISOString(),
      })
      accumulatedTonnage = 0
    } else {
      const shots = Math.floor(Math.random() * 20) + 5
      const tonnage = shots * ladle.kgPerShot
      const tonnageBeforeInput = accumulatedTonnage
      accumulatedTonnage += tonnage
      
      records.push({
        id: `usage-${ladleId}-${i}`,
        ladleId,
        type: RECORD_TYPES.USAGE,
        date: date.toISOString(),
        shots,
        tonnage,
        tonnageBeforeInput,
        tonnageAfterInput: accumulatedTonnage,
        createdAt: date.toISOString(),
      })
    }
  }
  
  return records.reverse() // Most recent first
}

// Get today's total shots across all ladles
export const getTodayTotalShots = (ladles) => {
  // Mock: random total shots for today
  return Math.floor(Math.random() * 200) + 100
}

// Get active ladles count
export const getActiveLadlesCount = (ladles) => {
  return ladles.filter(l => l.status === LADLE_STATUS.ACTIVE).length
}

// Get ladles needing attention (>80%)
export const getLadlesNeedingAttention = (ladles) => {
  return ladles.filter(l => {
    const percentage = (l.currentTonnage / l.maxCapacity) * 100
    return percentage >= 80
  }).length
}

// Generate chart data for last 7 days
export const generateChartData = () => {
  const data = []
  const today = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    data.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }),
      shots: Math.floor(Math.random() * 100) + 80,
      tonnage: Math.floor(Math.random() * 150000) + 100000,
    })
  }
  
  return data
}
