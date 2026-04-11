# 🏭 Ladle Monitoring System

Sistem monitoring dan tracking pemakaian tonase ladle FC dan FCD untuk proses foundry.

## 🎯 Features

### ✅ Sudah Tersedia
- **Dashboard Monitoring** - Overview real-time semua ladle dengan status visual
- **Input Tonase Awal** - Setup initial tonnage untuk ladle yang sudah dipakai
- **Input Shot Harian** - Catat pemakaian harian dengan auto-calculate tonnage
- **History Per Ladle** - Riwayat lengkap pemakaian dan maintenance
- **Relining Management** - Fitur reset tonnage saat maintenance
- **Status Management** - Toggle status Active/Maintenance
- **Visual Indicators** - Color-coded progress bars dan alert system
- **Responsive Design** - Mobile-friendly interface

### 🔜 Roadmap (Backend Integration)
- Export ke Excel/CSV
- User Authentication
- Advanced Filtering & Search
- Charts & Analytics
- Bulk Input
- Predictive Maintenance

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Framework
- **Vite** - Build tool & dev server
- **React Router v6** - Navigation
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **date-fns** - Date formatting

## 📋 Ladle Configuration

| Tipe | Nomor       | Kg/Shot | Max Capacity |
|------|-------------|---------|--------------|
| FC   | 10-18 (9x)  | 1,270   | 600,000 kg   |
| FCD  | 19-21 (3x)  | 800     | 500,000 kg   |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Run development server**
```bash
npm run dev
```

3. **Open browser**
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

Output akan ada di folder `dist/`

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
ladle-monitoring-app/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Layout.jsx
│   │   │   └── Navbar.jsx
│   │   ├── Dashboard/
│   │   │   ├── LadleCard.jsx
│   │   │   └── SummaryCard.jsx
│   │   └── ui/
│   │       ├── Button.jsx
│   │       └── Card.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── InputPage.jsx
│   │   ├── HistoryPage.jsx
│   │   └── NotFound.jsx
│   ├── store/
│   │   └── useLadleStore.js
│   ├── constants/
│   │   └── ladleConfig.js
│   ├── utils/
│   │   └── formatters.js
│   ├── data/
│   │   └── mockData.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Design System

### Color Scheme
- **Primary**: Blue (#2563eb) - Industrial theme
- **Success**: Green (#10b981) - Normal status
- **Warning**: Orange (#f59e0b) - Caution/Warning
- **Danger**: Red (#ef4444) - Critical status
- **Maintenance**: Gray (#6b7280) - Maintenance mode

### Typography
- **Headings**: Barlow (Bold, Industrial)
- **Body**: Work Sans (Clean, Readable)

### Status Colors
- 🟢 **0-70%**: Normal (Green)
- 🟡 **71-85%**: Perhatian (Yellow)
- 🟠 **86-100%**: Mendekati Max (Orange)
- 🔴 **>100%**: Melebihi Max (Red)
- 🔧 **Maintenance**: Gray

## 💾 State Management

Menggunakan **Zustand** untuk state management yang simple dan performant.

### Store Actions
- `getLadleById(id)` - Get ladle by ID
- `getRecordsByLadleId(id)` - Get records for a ladle
- `addInitialTonnage(...)` - Add initial tonnage
- `addUsageRecord(...)` - Add daily usage
- `performRelining(...)` - Perform relining
- `changeLadleStatus(...)` - Change ladle status
- `resetStore()` - Reset to initial state (dev only)

## 🔌 Backend Integration (Next Phase)

Frontend ini siap untuk diintegrasikan dengan backend API. Berikut struktur API yang direkomendasikan:

### API Endpoints

```
GET    /api/ladles              # Get all ladles
GET    /api/ladles/:id          # Get ladle detail
POST   /api/ladles/:id/initial  # Add initial tonnage
POST   /api/ladles/:id/usage    # Add usage record
POST   /api/ladles/:id/relining # Perform relining
PATCH  /api/ladles/:id/status   # Change status
GET    /api/records             # Get all records (with filters)
GET    /api/records/:ladleId    # Get records by ladle
```

### Integration Steps
1. Ganti mock data di `src/data/mockData.js` dengan API calls
2. Update Zustand store actions untuk call API
3. Add error handling & loading states
4. Implement authentication (JWT)

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (1 column)
- **Tablet**: 640px - 1024px (2 columns)
- **Desktop**: > 1024px (3-4 columns)

## 🧪 Development Notes

### Mock Data
Saat ini menggunakan mock data yang di-generate di:
- `src/data/mockData.js`
- `src/store/useLadleStore.js`

Data akan persists selama session browser (in-memory state).

### Reset Data
Untuk reset semua data saat development, panggil:
```javascript
useLadleStore.getState().resetStore()
```

## 🤝 Contributing

Untuk berkontribusi:
1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

Copyright © 2024. All rights reserved.

## 👥 Team

- Frontend Developer
- Backend Developer (Next Phase)
- UI/UX Designer

## 📞 Support

For support, email support@yourcompany.com

---

Built with ❤️ for better foundry operations
