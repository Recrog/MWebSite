import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaGamepad, FaBuilding, FaUsers } from 'react-icons/fa';
import axios from 'axios';

const AdminContainer = styled.div`
  padding-top: 120px;
  min-height: 100vh;
  background: #0a0a0a;
`;

const AdminContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PageSubtitle = styled.p`
  color: #a0a0a0;
  font-size: 1.1rem;
`;

const AdminTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #333;
`;

const TabButton = styled.button`
  background: ${props => props.active ? '#6366f1' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : '#a0a0a0'};
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${props => props.active ? '#6366f1' : '#333'};
    color: #ffffff;
  }
`;

const Section = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #333;
`;

const SectionTitle = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const GameCard = styled.div`
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
`;

const GameImage = styled.div`
  height: 150px;
  background: url(${props => props.image}) center/cover;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const GameTitle = styled.h3`
  color: #ffffff;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const GameGenre = styled.span`
  color: #6366f1;
  font-size: 0.9rem;
  font-weight: 500;
`;

const GamePrice = styled.div`
  color: #10b981;
  font-weight: 600;
  margin: 0.5rem 0;
`;

const GameActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  background: ${props => props.variant === 'edit' ? '#6366f1' : props.variant === 'delete' ? '#ef4444' : '#10b981'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const AddGameButton = styled.button`
  background: #6366f1;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;

  &:hover {
    background: #4f46e5;
    transform: translateY(-2px);
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  label {
    display: block;
    color: #a0a0a0;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }

  input, textarea, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #333;
    border-radius: 8px;
    background: #0a0a0a;
    color: #ffffff;
    font-size: 0.9rem;

    &:focus {
      outline: none;
      border-color: #6366f1;
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }
`;

const FullWidthGroup = styled(FormGroup)`
  grid-column: 1 / -1;
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  grid-column: 1 / -1;
`;

const CompanyForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #a0a0a0;
  font-size: 1.1rem;
  padding: 3rem;
`;

const Message = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: ${props => props.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  border: 1px solid ${props => props.type === 'success' ? '#10b981' : '#ef4444'};
  color: ${props => props.type === 'success' ? '#10b981' : '#ef4444'};
`;

const Admin = () => {
  const [activeTab, setActiveTab] = useState('games');
  const [games, setGames] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGameForm, setShowGameForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form states
  const [gameForm, setGameForm] = useState({
    title: '',
    genre: '',
    description: '',
    releaseDate: '',
    price: '',
    rating: '',
    image: '',
    trailer: '',
    screenshots: ['', '', ''],
    features: ['', '', '', ''],
    systemRequirements: {
      minimum: { os: '', processor: '', memory: '', graphics: '', storage: '' },
      recommended: { os: '', processor: '', memory: '', graphics: '', storage: '' }
    }
  });

  const [companyForm, setCompanyForm] = useState({
    name: '',
    founded: '',
    employees: '',
    location: '',
    description: '',
    vision: '',
    mission: '',
    achievements: ['', '', '', ''],
    team: [
      { name: '', position: '', image: '' },
      { name: '', position: '', image: '' },
      { name: '', position: '', image: '' }
    ]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [gamesRes, companyRes] = await Promise.all([
        axios.get('/api/games'),
        axios.get('/api/company')
      ]);
      setGames(gamesRes.data);
      setCompanyInfo(companyRes.data);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGameSubmit = async (e) => {
    e.preventDefault();
    try {
      const gameData = {
        ...gameForm,
        price: parseFloat(gameForm.price),
        rating: parseFloat(gameForm.rating),
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
      };

      if (editingGame) {
        await axios.put(`/api/admin/games/${editingGame.id}`, gameData);
      } else {
        await axios.post('/api/admin/games', gameData);
      }
      await fetchData();
      setShowGameForm(false);
      setEditingGame(null);
      setGameForm({
        title: '', genre: '', description: '', releaseDate: '', price: '', rating: '',
        image: '', trailer: '', screenshots: ['', '', ''], features: ['', '', '', ''],
        systemRequirements: {
          minimum: { os: '', processor: '', memory: '', graphics: '', storage: '' },
          recommended: { os: '', processor: '', memory: '', graphics: '', storage: '' }
        }
      });
      setMessage({ type: 'success', text: editingGame ? 'Oyun başarıyla güncellendi!' : 'Oyun başarıyla eklendi!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Oyun kaydedilirken hata:', error);
      setMessage({ type: 'error', text: 'Oyun kaydedilirken hata oluştu!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/admin/company', companyForm);
      await fetchData();
      setShowCompanyForm(false);
      setMessage({ type: 'success', text: 'Şirket bilgileri başarıyla güncellendi!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Şirket bilgileri kaydedilirken hata:', error);
      setMessage({ type: 'error', text: 'Şirket bilgileri kaydedilirken hata oluştu!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleEditGame = (game) => {
    setEditingGame(game);
    setGameForm({
      title: game.title,
      genre: game.genre,
      description: game.description,
      releaseDate: game.releaseDate,
      price: game.price.toString(),
      rating: game.rating.toString(),
      image: game.image,
      trailer: game.trailer,
      screenshots: [...game.screenshots],
      features: [...game.features],
      systemRequirements: { ...game.systemRequirements }
    });
    setShowGameForm(true);
  };

  const handleDeleteGame = async (gameId) => {
    if (window.confirm('Bu oyunu silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`/api/admin/games/${gameId}`);
        await fetchData();
        setMessage({ type: 'success', text: 'Oyun başarıyla silindi!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } catch (error) {
        console.error('Oyun silinirken hata:', error);
        setMessage({ type: 'error', text: 'Oyun silinirken hata oluştu!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    }
  };

  const handleEditCompany = () => {
    setCompanyForm({
      name: companyInfo.name,
      founded: companyInfo.founded,
      employees: companyInfo.employees,
      location: companyInfo.location,
      description: companyInfo.description,
      vision: companyInfo.vision,
      mission: companyInfo.mission,
      achievements: [...companyInfo.achievements],
      team: [...companyInfo.team]
    });
    setShowCompanyForm(true);
  };

  if (loading) {
    return (
      <AdminContainer>
        <AdminContent>
          <LoadingMessage>Yükleniyor...</LoadingMessage>
        </AdminContent>
      </AdminContainer>
    );
  }

  return (
    <AdminContainer>
      <AdminContent>
        <PageHeader>
          <PageTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Admin Paneli
          </PageTitle>
          <PageSubtitle>
            Oyunları ve şirket bilgilerini yönetin
          </PageSubtitle>
        </PageHeader>

        <AdminTabs>
          <TabButton
            active={activeTab === 'games'}
            onClick={() => setActiveTab('games')}
          >
            <FaGamepad />
            Oyunlar
          </TabButton>
          <TabButton
            active={activeTab === 'company'}
            onClick={() => setActiveTab('company')}
          >
            <FaBuilding />
            Şirket Bilgileri
          </TabButton>
        </AdminTabs>

        {message.text && (
          <Message type={message.type}>
            {message.text}
          </Message>
        )}

        {activeTab === 'games' && (
          <Section>
            <SectionTitle>
              <FaGamepad />
              Oyun Yönetimi
            </SectionTitle>

            {!showGameForm && (
              <AddGameButton onClick={() => setShowGameForm(true)}>
                <FaPlus />
                Yeni Oyun Ekle
              </AddGameButton>
            )}

            {showGameForm && (
              <Form onSubmit={handleGameSubmit}>
                <FormGroup>
                  <label>Oyun Adı</label>
                  <input
                    type="text"
                    value={gameForm.title}
                    onChange={(e) => setGameForm({...gameForm, title: e.target.value})}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>Tür</label>
                  <select
                    value={gameForm.genre}
                    onChange={(e) => setGameForm({...gameForm, genre: e.target.value})}
                    required
                  >
                    <option value="">Tür Seçin</option>
                    <option value="RPG">RPG</option>
                    <option value="Action">Action</option>
                    <option value="Strategy">Strategy</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Sports">Sports</option>
                  </select>
                </FormGroup>

                <FullWidthGroup>
                  <label>Açıklama</label>
                  <textarea
                    value={gameForm.description}
                    onChange={(e) => setGameForm({...gameForm, description: e.target.value})}
                    required
                  />
                </FullWidthGroup>

                <FormGroup>
                  <label>Çıkış Tarihi</label>
                  <input
                    type="date"
                    value={gameForm.releaseDate}
                    onChange={(e) => setGameForm({...gameForm, releaseDate: e.target.value})}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>Fiyat</label>
                  <input
                    type="number"
                    step="0.01"
                    value={gameForm.price}
                    onChange={(e) => setGameForm({...gameForm, price: e.target.value})}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>Puan</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={gameForm.rating}
                    onChange={(e) => setGameForm({...gameForm, rating: e.target.value})}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>Ana Görsel URL</label>
                  <input
                    type="url"
                    value={gameForm.image}
                    onChange={(e) => setGameForm({...gameForm, image: e.target.value})}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>Trailer URL</label>
                  <input
                    type="url"
                    value={gameForm.trailer}
                    onChange={(e) => setGameForm({...gameForm, trailer: e.target.value})}
                    required
                  />
                </FormGroup>

                <FullWidthGroup>
                  <label>Ekran Görüntüleri (URL'ler, virgülle ayırın)</label>
                  <textarea
                    value={gameForm.screenshots.join(', ')}
                    onChange={(e) => setGameForm({
                      ...gameForm, 
                      screenshots: e.target.value.split(',').map(url => url.trim()).filter(url => url)
                    })}
                    placeholder="https://example.com/screenshot1.jpg, https://example.com/screenshot2.jpg"
                  />
                </FullWidthGroup>

                <FullWidthGroup>
                  <label>Özellikler (virgülle ayırın)</label>
                  <textarea
                    value={gameForm.features.join(', ')}
                    onChange={(e) => setGameForm({
                      ...gameForm, 
                      features: e.target.value.split(',').map(feature => feature.trim()).filter(feature => feature)
                    })}
                    placeholder="Açık Dünya, Çok Oyunculu, VR Desteği"
                  />
                </FullWidthGroup>

                <FormActions>
                  <ActionButton type="submit" variant="save">
                    <FaSave />
                    {editingGame ? 'Güncelle' : 'Ekle'}
                  </ActionButton>
                  <ActionButton
                    type="button"
                    variant="delete"
                    onClick={() => {
                      setShowGameForm(false);
                      setEditingGame(null);
                    }}
                  >
                    <FaTimes />
                    İptal
                  </ActionButton>
                </FormActions>
              </Form>
            )}

            <GamesGrid>
              {games.map((game) => (
                <GameCard key={game.id}>
                  <GameImage image={game.image} />
                  <GameTitle>{game.title}</GameTitle>
                  <GameGenre>{game.genre}</GameGenre>
                  <GamePrice>₺{game.price}</GamePrice>
                  <GameActions>
                    <ActionButton
                      variant="edit"
                      onClick={() => handleEditGame(game)}
                    >
                      <FaEdit />
                      Düzenle
                    </ActionButton>
                    <ActionButton
                      variant="delete"
                      onClick={() => handleDeleteGame(game.id)}
                    >
                      <FaTrash />
                      Sil
                    </ActionButton>
                  </GameActions>
                </GameCard>
              ))}
            </GamesGrid>
          </Section>
        )}

        {activeTab === 'company' && (
          <Section>
            <SectionTitle>
              <FaBuilding />
              Şirket Bilgileri
            </SectionTitle>

            {!showCompanyForm && (
              <div>
                <ActionButton onClick={handleEditCompany}>
                  <FaEdit />
                  Şirket Bilgilerini Düzenle
                </ActionButton>
                
                <div style={{ marginTop: '2rem', color: '#a0a0a0' }}>
                  <h3 style={{ color: '#ffffff', marginBottom: '1rem' }}>Mevcut Bilgiler:</h3>
                  <p><strong>Şirket Adı:</strong> {companyInfo.name}</p>
                  <p><strong>Kuruluş Yılı:</strong> {companyInfo.founded}</p>
                  <p><strong>Çalışan Sayısı:</strong> {companyInfo.employees}</p>
                  <p><strong>Konum:</strong> {companyInfo.location}</p>
                  <p><strong>Açıklama:</strong> {companyInfo.description}</p>
                </div>
              </div>
            )}

            {showCompanyForm && (
              <CompanyForm onSubmit={handleCompanySubmit}>
                <FormGroup>
                  <label>Şirket Adı</label>
                  <input
                    type="text"
                    value={companyForm.name}
                    onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>Kuruluş Yılı</label>
                  <input
                    type="text"
                    value={companyForm.founded}
                    onChange={(e) => setCompanyForm({...companyForm, founded: e.target.value})}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>Çalışan Sayısı</label>
                  <input
                    type="text"
                    value={companyForm.employees}
                    onChange={(e) => setCompanyForm({...companyForm, employees: e.target.value})}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>Konum</label>
                  <input
                    type="text"
                    value={companyForm.location}
                    onChange={(e) => setCompanyForm({...companyForm, location: e.target.value})}
                    required
                  />
                </FormGroup>

                <FullWidthGroup>
                  <label>Açıklama</label>
                  <textarea
                    value={companyForm.description}
                    onChange={(e) => setCompanyForm({...companyForm, description: e.target.value})}
                    required
                  />
                </FullWidthGroup>

                <FullWidthGroup>
                  <label>Vizyon</label>
                  <textarea
                    value={companyForm.vision}
                    onChange={(e) => setCompanyForm({...companyForm, vision: e.target.value})}
                    required
                  />
                </FullWidthGroup>

                <FullWidthGroup>
                  <label>Misyon</label>
                  <textarea
                    value={companyForm.mission}
                    onChange={(e) => setCompanyForm({...companyForm, mission: e.target.value})}
                    required
                  />
                </FullWidthGroup>

                <FormActions>
                  <ActionButton type="submit" variant="save">
                    <FaSave />
                    Kaydet
                  </ActionButton>
                  <ActionButton
                    type="button"
                    variant="delete"
                    onClick={() => setShowCompanyForm(false)}
                  >
                    <FaTimes />
                    İptal
                  </ActionButton>
                </FormActions>
              </CompanyForm>
            )}
          </Section>
        )}
      </AdminContent>
    </AdminContainer>
  );
};

export default Admin;
