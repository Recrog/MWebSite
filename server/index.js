const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const {
  initializeDatabase,
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  getCompany,
  updateCompany,
  getUserByEmail,
  getUserById,
  createUser
} = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Stripe = require('stripe');
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Auth utils
function signToken(user) {
  const payload = { id: user.id, email: user.email, role: user.role };
  const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Yetkisiz' });
  try {
    const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Geçersiz token' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin yetkisi gerekli' });
  }
  next();
}

// Sample game data
let games = [
  {
    id: 1,
    title: "Cyber Quest 2077",
    genre: "RPG",
    description: "Gelecekte geçen açık dünya RPG oyunu. Siberpunk atmosferinde karakterinizi geliştirin ve dünyayı keşfedin.",
    releaseDate: "2024-06-15",
    price: 59.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    screenshots: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop"
    ],
    features: ["Açık Dünya", "Karakter Geliştirme", "Çok Oyunculu", "VR Desteği"],
    systemRequirements: {
      minimum: {
        os: "Windows 10",
        processor: "Intel Core i5-2500K",
        memory: "8 GB RAM",
        graphics: "NVIDIA GTX 970",
        storage: "50 GB"
      },
      recommended: {
        os: "Windows 10",
        processor: "Intel Core i7-8700K",
        memory: "16 GB RAM",
        graphics: "NVIDIA RTX 3070",
        storage: "50 GB SSD"
      }
    }
  },
  {
    id: 2,
    title: "Space Warriors",
    genre: "Action",
    description: "Uzayda geçen aksiyon oyunu. Farklı gezegenlerde savaşın ve uzaylı ırklarıyla mücadele edin.",
    releaseDate: "2024-03-20",
    price: 39.99,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    screenshots: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop"
    ],
    features: ["Uzay Savaşları", "Çok Oyunculu", "Özel Silahlar", "Gezegen Keşfi"],
    systemRequirements: {
      minimum: {
        os: "Windows 10",
        processor: "Intel Core i3-6100",
        memory: "6 GB RAM",
        graphics: "NVIDIA GTX 750",
        storage: "30 GB"
      },
      recommended: {
        os: "Windows 10",
        processor: "Intel Core i5-8400",
        memory: "12 GB RAM",
        graphics: "NVIDIA GTX 1060",
        storage: "30 GB SSD"
      }
    }
  },
  {
    id: 3,
    title: "Medieval Kingdom",
    genre: "Strategy",
    description: "Ortaçağda geçen strateji oyunu. Krallığınızı kurun, ordularınızı yönetin ve diğer krallıklarla savaşın.",
    releaseDate: "2024-09-10",
    price: 49.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    screenshots: [
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop"
    ],
    features: ["Strateji", "Kaynak Yönetimi", "Diplomasi", "Savaş Sistemi"],
    systemRequirements: {
      minimum: {
        os: "Windows 10",
        processor: "Intel Core i3-6100",
        memory: "4 GB RAM",
        graphics: "Intel HD 530",
        storage: "20 GB"
      },
      recommended: {
        os: "Windows 10",
        processor: "Intel Core i5-8400",
        memory: "8 GB RAM",
        graphics: "NVIDIA GTX 1050",
        storage: "20 GB SSD"
      }
    }
  },
  {
    id: 4,
    title: "Cyber Quest 2977",
    genre: "RPG",
    description: "Gelecekte geçen açık dünya RPG oyunu. Siberpunk atmosferinde karakterinizi geliştirin ve dünyayı keşfedin.",
    releaseDate: "2024-06-15",
    price: 59.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    screenshots: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop"
    ],
    features: ["Açık Dünya", "Karakter Geliştirme", "Çok Oyunculu", "VR Desteği"],
    systemRequirements: {
      minimum: {
        os: "Windows 10",
        processor: "Intel Core i5-2500K",
        memory: "8 GB RAM",
        graphics: "NVIDIA GTX 970",
        storage: "50 GB"
      },
      recommended: {
        os: "Windows 10",
        processor: "Intel Core i7-8700K",
        memory: "16 GB RAM",
        graphics: "NVIDIA RTX 3070",
        storage: "50 GB SSD"
      }
    }
  }
];

let companyInfo = {
  name: "GameStudio Pro",
  founded: "2018",
  employees: "150+",
  location: "İstanbul, Türkiye",
  description: "GameStudio Pro, oyun endüstrisinde yenilikçi ve kaliteli oyunlar geliştiren bir şirkettir. Modern teknolojiler kullanarak oyunculara unutulmaz deneyimler sunmayı hedefliyoruz.",
  vision: "Oyun endüstrisinde lider konuma gelmek ve global pazarda tanınan bir marka olmak.",
  mission: "Yaratıcı ve yenilikçi oyunlar geliştirerek oyunculara en iyi deneyimi sunmak.",
  achievements: [
    "2023'te En İyi RPG Oyunu Ödülü",
    "1M+ aktif oyuncu",
    "15+ başarılı oyun",
    "Global pazarda 50+ ülke"
  ],
  team: [
    {
      name: "Ahmet Yılmaz",
      position: "CEO & Kurucu",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
    },
    {
      name: "Zeynep Kaya",
      position: "Yaratıcı Direktör",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face"
    },
    {
      name: "Mehmet Demir",
      position: "Teknik Direktör",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
    }
  ]
};

// API Routes
app.get('/api/games', async (req, res) => {
  try {
    const list = await getGames();
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Oyunlar yüklenirken hata oluştu' });
  }
});

app.get('/api/games/:id', async (req, res) => {
  try {
    const gameId = parseInt(req.params.id);
    const game = await getGameById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Oyun bulunamadı' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Oyun yüklenirken hata oluştu' });
  }
});

app.get('/api/company', async (req, res) => {
  try {
    const company = await getCompany();
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Şirket bilgileri yüklenirken hata oluştu' });
  }
});

app.get('/api/featured-games', async (req, res) => {
  try {
    const list = await getGames();
    const featured = list.filter(game => game.rating >= 4.5);
    res.json(featured);
  } catch (error) {
    res.status(500).json({ message: 'Öne çıkan oyunlar yüklenirken hata oluştu' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server çalışıyor' });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email ve şifre gerekli' });
    const existing = await getUserByEmail(email);
    if (existing) return res.status(409).json({ message: 'Bu email zaten kayıtlı' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ email, passwordHash, name, role: 'user' });
    const token = signToken(user);
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(400).json({ message: 'Kayıt olunurken hata oluştu' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Geçersiz kimlik bilgileri' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Geçersiz kimlik bilgileri' });
    const token = signToken(user);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(400).json({ message: 'Giriş yapılırken hata oluştu' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (error) {
    res.status(400).json({ message: 'Profil alınırken hata oluştu' });
  }
});

// Payments - Stripe Checkout
app.post('/api/checkout', async (req, res) => {
  try {
    if (!stripe) return res.status(500).json({ message: 'Stripe yapılandırılmadı' });
    const { gameId, quantity = 1 } = req.body;
    const game = await getGameById(parseInt(gameId));
    if (!game) return res.status(404).json({ message: 'Oyun bulunamadı' });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'try',
            product_data: {
              name: game.title,
              description: game.description.substring(0, 200)
            },
            unit_amount: Math.round(Number(game.price) * 100)
          },
          quantity: Math.max(1, Number(quantity) || 1)
        }
      ],
      success_url: process.env.CHECKOUT_SUCCESS_URL || 'http://localhost:3000/?payment=success',
      cancel_url: process.env.CHECKOUT_CANCEL_URL || 'http://localhost:3000/?payment=cancel'
    });
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(400).json({ message: 'Ödeme başlatılırken hata oluştu' });
  }
});
// Admin API Routes
app.post('/api/admin/games', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const created = await createGame(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: 'Oyun eklenirken hata oluştu' });
  }
});

app.put('/api/admin/games/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const gameId = parseInt(req.params.id);
    const updated = await updateGame(gameId, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Oyun bulunamadı' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Oyun güncellenirken hata oluştu' });
  }
});

app.delete('/api/admin/games/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const gameId = parseInt(req.params.id);
    await deleteGame(gameId);
    res.json({ message: 'Oyun başarıyla silindi' });
  } catch (error) {
    res.status(400).json({ message: 'Oyun silinirken hata oluştu' });
  }
});

app.put('/api/admin/company', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const updated = await updateCompany(req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Şirket bilgileri güncellenirken hata oluştu' });
  }
});

// Start server after DB initialization with defaults
(async () => {
  try {
    await initializeDatabase(games, companyInfo);
    // Seed admin user if provided via env
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const existingAdmin = await getUserByEmail(process.env.ADMIN_EMAIL);
      if (!existingAdmin) {
        const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        await createUser({ email: process.env.ADMIN_EMAIL, passwordHash, name: 'Admin', role: 'admin' });
        console.log('Admin kullanıcısı oluşturuldu:', process.env.ADMIN_EMAIL);
      }
    }
    app.listen(PORT, () => {
      console.log(`Server ${PORT} portunda çalışıyor`);
    });
  } catch (error) {
    console.error('Veritabanı başlatılırken hata oluştu:', error);
    process.exit(1);
  }
})();
