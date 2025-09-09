# GameStudio Pro * SunFall - Oyun Şirketi Web Sitesi

Modern, karanlık tema ile tasarlanmış oyun şirketi web sitesi. React frontend ve Node.js backend kullanılarak geliştirilmiştir.

## 🎮 Özellikler

### Frontend (React)
- **Modern UI/UX**: Karanlık tema ile etkileyici tasarım
- **Responsive Design**: Mobil ve masaüstü uyumlu
- **Animasyonlar**: Framer Motion ile smooth geçişler
- **SPA Yapısı**: Tek sayfa uygulama
- **Dinamik İçerik**: Backend API'den veri çekme

### Backend (Node.js)
- **REST API**: Express.js ile API endpoints
- **CORS Desteği**: Cross-origin istekler
- **Güvenlik**: Helmet middleware
- **Logging**: Morgan ile request logları

### Sayfalar
- **Ana Sayfa**: Hero section, öne çıkan oyunlar, istatistikler
- **Oyunlar**: Tüm oyunların listesi, filtreleme ve arama
- **Oyun Detayı**: Trailer, ekran görüntüleri, sistem gereksinimleri
- **Hakkımızda**: Şirket bilgileri, ekip, başarılar

## 🚀 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd game-company-website
```

2. **Tüm dependencies'leri yükleyin**
```bash
npm run install-all
```

3. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

Bu komut hem backend (port 5000) hem de frontend (port 3000) sunucularını başlatacaktır.

### Manuel Kurulum

Eğer otomatik kurulum çalışmazsa:

```bash
# Ana dependencies
npm install

# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install
```

## 📁 Proje Yapısı

```
game-company-website/
├── package.json              # Ana proje konfigürasyonu
├── server/                   # Backend
│   ├── index.js             # Express server
│   └── package.json         # Backend dependencies
├── client/                   # Frontend
│   ├── public/              # Static dosyalar
│   ├── src/                 # React kaynak kodları
│   │   ├── components/      # Yeniden kullanılabilir bileşenler
│   │   ├── pages/           # Sayfa bileşenleri
│   │   ├── App.js           # Ana uygulama
│   │   └── index.js         # Giriş noktası
│   └── package.json         # Frontend dependencies
└── README.md                # Bu dosya
```(.env dosyasında admin bilgilerini verirsin  )

## 🛠️ Teknolojiler

### Frontend
- **React 18**: Modern React hooks ve functional components
- **React Router**: Sayfa yönlendirme
- **Styled Components**: CSS-in-JS styling
- **Framer Motion**: Animasyonlar
- **React Icons**: İkon kütüphanesi
- **Axios**: HTTP istekleri

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **CORS**: Cross-origin resource sharing
- **Helmet**: Güvenlik middleware
- **Morgan**: HTTP request logger
- **SQLite**: DataBase

## 🎨 Tasarım Özellikleri

- **Karanlık Tema**: Göz yormayan koyu renk paleti
- **Gradient Efektler**: Modern görsel efektler
- **Hover Animasyonları**: İnteraktif kullanıcı deneyimi
- **Responsive Grid**: Esnek layout sistemi
- **Modern Typography**: Inter font ailesi

## 📱 Responsive Tasarım

- **Desktop**: 1200px+ genişlik
- **Tablet**: 768px - 1199px genişlik
- **Mobile**: 767px ve altı genişlik

## 🔧 API Endpoints

### Oyunlar
- `GET /api/games` - Tüm oyunları listele
- `GET /api/games/:id` - Belirli oyun detayı
- `GET /api/featured-games` - Öne çıkan oyunlar

### Şirket Bilgileri
- `GET /api/company` - Şirket bilgileri

### Sağlık Kontrolü
- `GET /api/health` - Server durumu

## 🎯 MVP Özellikleri

✅ **Tamamlanan**
- Oyun listeleme ve detay sayfaları
- Şirket hakkında sayfası
- Responsive tasarım
- Karanlık tema
- Backend API
- Dinamik içerik yönetimi
- Arama ve filtreleme
- Animasyonlu geçişler
- Admin paneli
- Oyun satın alma sistemi

🔄 **Gelecek Eklemeler**
- Blog/haber bölümü
- Sosyal medya paylaşımı
- Kullanıcı yorumları


## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
```

### Backend (Heroku/Railway)
```bash
cd server
npm start
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👥 Ekip

- **GameStudio Pro** - Oyun geliştirme şirketi
- **150+** çalışan
- **15+** başarılı oyun
- **1M+** aktif oyuncu

## 📞 İletişim

- **Website**: [game-studio-pro.com](https://game-studio-pro.com)
- **Email**: info@gamestudiopro.com
- **Konum**: İstanbul, Türkiye

---
**Live Deployment**
**sunfall-nv0o9lag8-receps-projects-915c7845.vercel.app**
**GameStudio Pro** - Oyun dünyasının geleceğini şekillendiriyoruz! 🎮✨
