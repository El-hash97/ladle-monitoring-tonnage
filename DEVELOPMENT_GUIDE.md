# 📚 Development Guide - Ladle Monitoring System

Panduan lengkap untuk development aplikasi monitoring tonase ladle.

## 🎯 Getting Started

### 1. Setup Project

```bash
# Clone repository (jika dari git)
git clone <repository-url>
cd ladle-monitoring-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### 2. Struktur Folder

```
src/
├── components/          # Reusable components
│   ├── Layout/         # Layout components (Navbar, etc)
│   ├── Dashboard/      # Dashboard-specific components
│   └── ui/             # Basic UI components (Button, Card, etc)
├── pages/              # Page components (routed)
├── store/              # State management (Zustand)
├── constants/          # Configuration & constants
├── utils/              # Utility functions
└── data/               # Mock data (temporary)
```

## 🔨 Adding New Features

### Menambah Component Baru

1. **Buat component di folder yang sesuai**

```jsx
// src/components/Dashboard/NewComponent.jsx
const NewComponent = ({ prop1, prop2 }) => {
  return (
    <div>
      {/* Your component */}
    </div>
  )
}

export default NewComponent
```

2. **Import dan gunakan**

```jsx
import NewComponent from '@/components/Dashboard/NewComponent'
```

### Menambah Page Baru

1. **Buat page component**

```jsx
// src/pages/NewPage.jsx
const NewPage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">New Page</h1>
      {/* Page content */}
    </div>
  )
}

export default NewPage
```

2. **Tambahkan route di App.jsx**

```jsx
import NewPage from './pages/NewPage'

<Route path="/new-page" element={<NewPage />} />
```

3. **Tambahkan navigation di Navbar**

```jsx
<Link to="/new-page">
  <Button variant="ghost">New Page</Button>
</Link>
```

## 🗄️ State Management

### Menggunakan Zustand Store

```jsx
import useLadleStore from '@/store/useLadleStore'

const MyComponent = () => {
  // Get state
  const ladles = useLadleStore((state) => state.ladles)
  const isLoading = useLadleStore((state) => state.isLoading)
  
  // Get actions
  const addUsageRecord = useLadleStore((state) => state.addUsageRecord)
  
  // Use in component
  const handleSubmit = () => {
    addUsageRecord(ladleId, shots, date)
  }
  
  return (
    // Component JSX
  )
}
```

### Menambah Action Baru

Edit `src/store/useLadleStore.js`:

```javascript
const useLadleStore = create((set, get) => ({
  // State
  someNewState: [],
  
  // Actions
  newAction: (param1, param2) => {
    set((state) => ({
      // Update state
      someNewState: [...state.someNewState, newItem]
    }))
  },
}))
```

## 🎨 Styling Guide

### Menggunakan Tailwind Classes

```jsx
// Spacing
className="p-4 space-y-6"

// Colors
className="bg-primary text-primary-foreground"

// Responsive
className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"

// Hover & Transitions
className="hover:bg-accent transition-colors"

// Custom animations
className="animate-fade-in animate-pulse-glow"
```

### Custom Colors (Status)

```jsx
// Defined in tailwind.config.js
className="text-status-normal"    // Green
className="text-status-caution"   // Yellow
className="text-status-warning"   // Orange
className="text-status-critical"  // Red
className="text-status-maintenance" // Gray
```

### Conditional Styling dengan clsx

```jsx
import { clsx } from 'clsx'

<div className={clsx(
  'base-class',
  condition && 'conditional-class',
  status === 'active' ? 'active-class' : 'inactive-class'
)}>
```

## 🔧 Utilities

### Formatters

```javascript
import { 
  formatNumber,
  formatTonnage,
  formatDate,
  calculatePercentage,
  getStatusColor,
  getStatusEmoji 
} from '@/utils/formatters'

// Format number with thousand separator
formatNumber(1234567)  // "1.234.567"

// Format tonnage
formatTonnage(450000)  // "450.000 kg"

// Format date
formatDate(new Date()) // "18/02/2024"

// Calculate percentage
calculatePercentage(450000, 600000) // 75

// Get status color
getStatusColor(75) // "normal" | "caution" | "warning" | "critical"

// Get status emoji
getStatusEmoji(75) // "🟢" | "🟡" | "🟠" | "🔴"
```

## 📝 Forms dengan React Hook Form

```jsx
import { useForm } from 'react-hook-form'

const MyForm = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      field1: '',
      field2: '',
    }
  })
  
  const onSubmit = (data) => {
    console.log(data)
    // Process form data
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('field1', { 
          required: 'Field is required',
          min: { value: 0, message: 'Must be positive' }
        })}
      />
      {errors.field1 && <p>{errors.field1.message}</p>}
      
      <button type="submit">Submit</button>
    </form>
  )
}
```

## 🔌 Persiapan Backend Integration

### 1. Create API Service

```javascript
// src/services/api.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const ladleAPI = {
  getAllLadles: () => api.get('/ladles'),
  getLadleById: (id) => api.get(`/ladles/${id}`),
  addInitialTonnage: (id, data) => api.post(`/ladles/${id}/initial`, data),
  addUsageRecord: (id, data) => api.post(`/ladles/${id}/usage`, data),
  performRelining: (id, data) => api.post(`/ladles/${id}/relining`, data),
  changeLadleStatus: (id, status) => api.patch(`/ladles/${id}/status`, { status }),
}

export const recordAPI = {
  getAllRecords: (filters) => api.get('/records', { params: filters }),
  getRecordsByLadle: (ladleId) => api.get(`/records/${ladleId}`),
}
```

### 2. Update Zustand Store

```javascript
// src/store/useLadleStore.js
import { ladleAPI } from '@/services/api'

const useLadleStore = create((set, get) => ({
  ladles: [],
  
  // Fetch ladles from API
  fetchLadles: async () => {
    set({ isLoading: true })
    try {
      const { data } = await ladleAPI.getAllLadles()
      set({ ladles: data, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },
  
  // Add usage with API
  addUsageRecord: async (ladleId, shots, date) => {
    set({ isLoading: true })
    try {
      const { data } = await ladleAPI.addUsageRecord(ladleId, { shots, date })
      // Update local state
      set((state) => ({
        ladles: state.ladles.map(l => 
          l.id === ladleId ? data.ladle : l
        ),
        isLoading: false
      }))
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },
}))
```

### 3. Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Ladle Monitoring System
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL
```

## 🧪 Testing

### Testing Component

```jsx
// Install: npm install -D @testing-library/react @testing-library/jest-dom vitest

// src/components/Dashboard/__tests__/LadleCard.test.jsx
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import LadleCard from '../LadleCard'

describe('LadleCard', () => {
  const mockLadle = {
    id: 'FC-10',
    type: 'FC',
    number: 10,
    currentTonnage: 450000,
    maxCapacity: 600000,
    status: 'active',
  }
  
  it('renders ladle information', () => {
    render(
      <BrowserRouter>
        <LadleCard ladle={mockLadle} />
      </BrowserRouter>
    )
    
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('FC')).toBeInTheDocument()
  })
})
```

## 🐛 Debugging

### React Developer Tools

Install extension:
- Chrome: React Developer Tools
- Firefox: React Developer Tools

### Zustand DevTools

```javascript
import { devtools } from 'zustand/middleware'

const useLadleStore = create(
  devtools((set, get) => ({
    // store implementation
  }), { name: 'LadleStore' })
)
```

### Console Logging

```javascript
// Log store state
console.log(useLadleStore.getState())

// Log props in component
console.log({ ladle, percentage, statusColor })
```

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
```

Output di folder `dist/`

### Preview Production Build

```bash
npm run preview
```

### Deploy ke Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy ke Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

## 🔍 Common Issues & Solutions

### Issue: Module not found

**Solution**: Check import path dan file location
```javascript
// Use @ alias
import Component from '@/components/Component'
```

### Issue: State not updating

**Solution**: Make sure immutable update in Zustand
```javascript
// Wrong
set({ ladles: state.ladles.push(newLadle) })

// Correct
set((state) => ({ ladles: [...state.ladles, newLadle] }))
```

### Issue: Tailwind classes not working

**Solution**: 
1. Check `tailwind.config.js` content paths
2. Restart dev server
3. Clear browser cache

## 📚 Resources

- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Zustand Docs](https://docs.pmnd.rs/zustand/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/)
- [React Hook Form](https://react-hook-form.com/)

## 🤝 Best Practices

1. **Component Organization**: Keep components small and focused
2. **State Management**: Use Zustand for global state, local state for component-specific
3. **Naming**: Use clear, descriptive names (camelCase for variables, PascalCase for components)
4. **Comments**: Add comments for complex logic
5. **Formatting**: Use consistent formatting (Prettier recommended)
6. **Git Commits**: Write clear commit messages
7. **Performance**: Use React.memo for expensive components
8. **Accessibility**: Add proper labels and ARIA attributes

---

Happy Coding! 🚀
