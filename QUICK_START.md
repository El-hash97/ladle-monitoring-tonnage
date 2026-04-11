# ⚡ Quick Start Guide

Langkah cepat untuk menjalankan aplikasi Ladle Monitoring System.

## 🏃 Super Quick Start (3 Langkah)

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open browser
# http://localhost:5173
```

Selesai! 🎉

## 📱 Apa yang Bisa Dicoba?

### 1. **Dashboard** (/)
- Lihat overview semua ladle FC (10-18) dan FCD (19-21)
- Status real-time dengan color coding
- Click pada ladle card untuk lihat history

### 2. **Input Data** (/input)
#### Tab "Input Shot Harian"
- Pilih ladle (hanya yang active)
- Input jumlah shot (misal: 15)
- Lihat auto-calculate tonase
- Simpan data

#### Tab "Input Tonase Awal"
- Untuk setup ladle yang sudah dipakai sebelumnya
- Input tonase awal
- Set tanggal mulai tracking
- Simpan

### 3. **History** (Click ladle card)
- Lihat detail ladle (current tonnage, lifetime stats)
- Table riwayat pemakaian
- Fitur Relining (reset tonnage)
- Toggle status Active/Maintenance

## 🎨 UI Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Color-coded status indicators
  - 🟢 0-70%: Normal (Hijau)
  - 🟡 71-85%: Perhatian (Kuning)
  - 🟠 86-100%: Mendekati Max (Orange)
  - 🔴 >100%: Melebihi Max (Merah)
- ✅ Smooth animations
- ✅ Real-time calculations
- ✅ Warning alerts

## 🔧 Configuration

### Ladle Config (sudah setup)
```javascript
FC:  10-18 (9 ladles) - 1,270 kg/shot - Max 600,000 kg
FCD: 19-21 (3 ladles) - 800 kg/shot  - Max 500,000 kg
```

### Mock Data
- Dashboard menampilkan 12 ladles dengan varied tonnage
- Setiap ladle punya history ~30 records
- Data akan reset saat page refresh (in-memory state)

## 📂 Project Structure (Simplified)

```
ladle-monitoring-app/
├── src/
│   ├── pages/           → Dashboard, Input, History
│   ├── components/      → UI components
│   ├── store/           → State management (Zustand)
│   └── utils/           → Helper functions
├── package.json         → Dependencies
└── README.md            → Full documentation
```

## 🎯 Development Scripts

```bash
# Development (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🐛 Troubleshooting

### Port sudah digunakan?
```bash
# Vite akan otomatis mencoba port lain
# Atau set custom port:
npm run dev -- --port 3000
```

### Dependencies error?
```bash
# Delete node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tailwind tidak jalan?
```bash
# Restart dev server
# Ctrl+C untuk stop, lalu npm run dev lagi
```

## 🚀 Next Steps

1. ✅ Explore UI dan features
2. ✅ Test input data dan relining
3. ✅ Baca **README.md** untuk detail lengkap
4. ✅ Baca **DEVELOPMENT_GUIDE.md** untuk development
5. ⏳ Setup backend API (Phase 2)
6. ⏳ Deploy to production

## 📚 Documentation Files

- **README.md** - Complete project documentation
- **DEVELOPMENT_GUIDE.md** - Development guide & best practices
- **PROJECT_FILES.md** - File structure overview
- **QUICK_START.md** - This file!

## 💡 Tips

- Data currently stored in-memory (will reset on refresh)
- Use browser DevTools to inspect state
- All ladles start with mock data for demo
- Ready for backend API integration
- Mobile-responsive, test on different screen sizes

## 🎨 Customization

Mau ganti warna? Edit `tailwind.config.js`:
```javascript
colors: {
  primary: "217 91% 60%",  // Change this
  // ... more colors
}
```

Mau ganti fonts? Edit `src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=YourFont...');
```

## 🤝 Need Help?

- Check **DEVELOPMENT_GUIDE.md** for detailed guides
- Check browser console for errors
- Check **README.md** for complete documentation

---

Selamat coding! 🚀

Built with ❤️ using React + Vite + Tailwind CSS
