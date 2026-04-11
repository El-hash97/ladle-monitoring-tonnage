export const LADLE_CONFIG = {
  FC: {
    numbers: [10, 11, 12, 13, 14, 15, 16, 17, 18],
    kgPerShot: 1270,
    maxCapacity: 600000,
    label: 'FC',
  },
  FCD: {
    numbers: [19, 20, 21],
    kgPerShot: 800,
    maxCapacity: 500000,
    label: 'FCD',
  },
}

export const LADLE_TYPES = {
  FC: 'FC',
  FCD: 'FCD',
}

export const RECORD_TYPES = {
  INITIAL: 'initial',
  USAGE: 'usage',
  RELINING: 'relining',
}

export const LADLE_STATUS = {
  ACTIVE: 'active',
  MAINTENANCE: 'maintenance',
}

export const STATUS_COLORS = {
  normal: '#10b981',
  caution: '#f59e0b',
  warning: '#fb923c',
  critical: '#ef4444',
  maintenance: '#6b7280',
}

// Get ladle type from number
export const getLadleType = (number) => {
  if (LADLE_CONFIG.FC.numbers.includes(number)) return LADLE_TYPES.FC
  if (LADLE_CONFIG.FCD.numbers.includes(number)) return LADLE_TYPES.FCD
  return null
}

// Get all ladles
export const getAllLadles = () => {
  const ladles = []
  
  LADLE_CONFIG.FC.numbers.forEach(num => {
    ladles.push({
      id: `FC-${num}`,
      type: LADLE_TYPES.FC,
      number: num,
      kgPerShot: LADLE_CONFIG.FC.kgPerShot,
      maxCapacity: LADLE_CONFIG.FC.maxCapacity,
    })
  })
  
  LADLE_CONFIG.FCD.numbers.forEach(num => {
    ladles.push({
      id: `FCD-${num}`,
      type: LADLE_TYPES.FCD,
      number: num,
      kgPerShot: LADLE_CONFIG.FCD.kgPerShot,
      maxCapacity: LADLE_CONFIG.FCD.maxCapacity,
    })
  })
  
  return ladles
}
