import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaStar, FaFilter, FaSearch, FaPlay } from 'react-icons/fa';
import axios from 'axios';

const GamesContainer = styled.div`
  padding-top: 120px;
  min-height: 100vh;
  background: #0a0a0a;
`;

const GamesContent = styled.div`
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
  max-width: 600px;
  margin: 0 auto;
`;

const FiltersSection = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 3rem;
  border: 1px solid #333;
`;

const FiltersTitle = styled.h3`
  color: #ffffff;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const FilterGroup = styled.div`
  label {
    display: block;
    color: #a0a0a0;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }

  select, input {
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
`;

const SearchBox = styled.div`
  position: relative;
  grid-column: 1 / -1;

  input {
    padding-left: 2.5rem;
  }

  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
  }
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
`;

const GameCard = styled(motion.div)`
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #333;

  &:hover {
    transform: translateY(-8px);
    border-color: #6366f1;
    box-shadow: 0 20px 40px rgba(99, 102, 241, 0.2);
  }
`;

const GameImage = styled.div`
  height: 200px;
  background: url(${props => props.image}) center/cover;
  position: relative;
`;

const GameOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${GameCard}:hover & {
    opacity: 1;
  }
`;

const PlayButton = styled.button`
  background: #6366f1;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #4f46e5;
    transform: scale(1.05);
  }
`;

const GameInfo = styled.div`
  padding: 1.5rem;
`;

const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const GameTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const GameGenre = styled.span`
  color: #6366f1;
  font-size: 0.9rem;
  font-weight: 500;
`;

const GameRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffd700;
  font-weight: 600;
`;

const GameDescription = styled.p`
  color: #a0a0a0;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const GameMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const GamePrice = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #10b981;
`;

const GameReleaseDate = styled.div`
  color: #a0a0a0;
  font-size: 0.8rem;
`;

const ViewButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem;
  background: #6366f1;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: #4f46e5;
    transform: translateY(-2px);
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #a0a0a0;
  font-size: 1.1rem;
  padding: 3rem;
`;

const NoGamesMessage = styled.div`
  text-align: center;
  color: #a0a0a0;
  font-size: 1.1rem;
  padding: 3rem;
`;

const Games = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('/api/games');
        setGames(response.data);
        setFilteredGames(response.data);
      } catch (error) {
        console.error('Oyunlar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    let filtered = games;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(game =>
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Genre filter
    if (selectedGenre) {
      filtered = filtered.filter(game => game.genre === selectedGenre);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.price - b.price;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'releaseDate':
          return new Date(b.releaseDate) - new Date(a.releaseDate);
        default:
          return 0;
      }
    });

    setFilteredGames(filtered);
  }, [games, searchTerm, selectedGenre, sortBy]);

  const genres = [...new Set(games.map(game => game.genre))];

  if (loading) {
    return (
      <GamesContainer>
        <GamesContent>
          <LoadingMessage>Oyunlar yükleniyor...</LoadingMessage>
        </GamesContent>
      </GamesContainer>
    );
  }

  return (
    <GamesContainer>
      <GamesContent>
        <PageHeader>
          <PageTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Oyunlarımız
          </PageTitle>
          <PageSubtitle>
            Yenilikçi ve kaliteli oyunlarımızı keşfedin. Her türde oyuncuya hitap eden geniş oyun kütüphanemiz.
          </PageSubtitle>
        </PageHeader>

        <FiltersSection>
          <FiltersTitle>
            <FaFilter />
            Filtreler ve Arama
          </FiltersTitle>
          <FiltersGrid>
            <SearchBox>
              <FaSearch />
              <input
                type="text"
                placeholder="Oyun ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBox>
            
            <FilterGroup>
              <label>Tür</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="">Tüm Türler</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </FilterGroup>

            <FilterGroup>
              <label>Sıralama</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Puana Göre</option>
                <option value="price">Fiyata Göre</option>
                <option value="title">İsme Göre</option>
                <option value="releaseDate">Çıkış Tarihine Göre</option>
              </select>
            </FilterGroup>
          </FiltersGrid>
        </FiltersSection>

        {filteredGames.length === 0 ? (
          <NoGamesMessage>
            Arama kriterlerinize uygun oyun bulunamadı.
          </NoGamesMessage>
        ) : (
          <GamesGrid>
            {filteredGames.map((game, index) => (
              <GameCard
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GameImage image={game.image}>
                  <GameOverlay>
                    <PlayButton>
                      <FaPlay />
                    </PlayButton>
                  </GameOverlay>
                </GameImage>
                <GameInfo>
                  <GameHeader>
                    <div>
                      <GameTitle>{game.title}</GameTitle>
                      <GameGenre>{game.genre}</GameGenre>
                    </div>
                    <GameRating>
                      <FaStar />
                      {game.rating}
                    </GameRating>
                  </GameHeader>
                  
                  <GameDescription>
                    {game.description.substring(0, 120)}...
                  </GameDescription>
                  
                  <GameMeta>
                    <GamePrice>₺{game.price}</GamePrice>
                    <GameReleaseDate>
                      {new Date(game.releaseDate).toLocaleDateString('tr-TR')}
                    </GameReleaseDate>
                  </GameMeta>
                  
                  <ViewButton to={`/games/${game.id}`}>
                    Detayları Gör
                  </ViewButton>
                </GameInfo>
              </GameCard>
            ))}
          </GamesGrid>
        )}
      </GamesContent>
    </GamesContainer>
  );
};

export default Games;
