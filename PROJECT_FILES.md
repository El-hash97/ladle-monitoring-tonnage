# 📂 Project Files Overview

## 📋 Root Files

- **package.json** - Dependencies dan scripts
- **vite.config.js** - Vite configuration
- **tailwind.config.js** - Tailwind CSS config dengan custom colors
- **postcss.config.js** - PostCSS configuration
- **jsconfig.json** - Path alias configuration
- **.eslintrc.cjs** - ESLint rules
- **.gitignore** - Git ignore patterns
- **index.html** - HTML entry point
- **README.md** - Project documentation
- **DEVELOPMENT_GUIDE.md** - Development guide lengkap

## 🎨 Source Files (src/)

### Main Files
- **main.jsx** - React entry point
- **App.jsx** - Main app component dengan routing
- **index.css** - Global styles dan Tailwind imports

### Pages (src/pages/)
- **Dashboard.jsx** - Dashboard utama dengan ladle grid
- **InputPage.jsx** - Form input tonase awal dan shot harian
- **HistoryPage.jsx** - History per ladle dengan relining feature
- **NotFound.jsx** - 404 page

### Components

#### Layout (src/components/Layout/)
- **Layout.jsx** - Main layout wrapper
- **Navbar.jsx** - Navigation bar dengan routing

#### Dashboard (src/components/Dashboard/)
- **LadleCard.jsx** - Card component untuk display ladle
- **SummaryCard.jsx** - Summary statistics card

#### UI (src/components/ui/)
- **Button.jsx** - Reusable button component
- **Card.jsx** - Card components (Card, CardHeader, CardTitle, etc)

### State Management (src/store/)
- **useLadleStore.js** - Zustand store untuk global state management

### Constants (src/constants/)
- **ladleConfig.js** - Ladle configuration (FC/FCD specs)

### Utils (src/utils/)
- **formatters.js** - Formatting functions (number, date, percentage, dll)

### Data (src/data/)
- **mockData.js** - Mock data untuk development (temporary)

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 📦 Key Dependencies

### Core
- react ^18.2.0
- react-dom ^18.2.0
- react-router-dom ^6.22.0

### State & Forms
- zustand ^4.5.0
- react-hook-form ^7.50.0
- zod ^3.22.4
- @hookform/resolvers ^3.3.4

### UI & Styling
- tailwindcss ^3.4.1
- lucide-react ^0.338.0
- clsx ^2.1.0
- tailwind-merge ^2.2.1

### Utilities
- date-fns ^3.3.1
- recharts ^2.12.0 (untuk charts)
- @tanstack/react-table ^8.12.0 (untuk tables)

## 🎯 Next Steps

1. **Setup**: Run `npm install`
2. **Development**: Run `npm run dev`
3. **Customize**: Sesuaikan colors di `tailwind.config.js`
4. **Backend**: Siapkan API endpoints (lihat DEVELOPMENT_GUIDE.md)
5. **Deploy**: Build dan deploy ke hosting pilihan

## 📝 Notes

- Semua mock data ada di `src/data/mockData.js`
- Store state akan reset saat page refresh
- Untuk production, replace mock data dengan API calls
- Sudah responsive untuk mobile, tablet, dan desktop
- Color scheme industrial: Blue, Green, Orange, Red

## 🔄 Migration to Backend

Saat ready untuk backend integration:
1. Buat API service di `src/services/api.js`
2. Update Zustand store actions untuk call API
3. Add loading states dan error handling
4. Implement authentication (JWT)
5. Add environment variables untuk API URL

Lihat detail lengkap di **DEVELOPMENT_GUIDE.md**

---

Total Files: 30+ files
Total Lines: 3000+ lines of code
