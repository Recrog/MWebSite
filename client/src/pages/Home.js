import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPlay, FaStar, FaArrowRight, FaGamepad, FaUsers, FaTrophy } from 'react-icons/fa';
import axios from 'axios';

const HomeContainer = styled.div`
  padding-top: 80px;
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(10, 10, 10, 0.9) 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop') center/cover;
    opacity: 0.3;
    z-index: -1;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
  z-index: 1;
`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: #a0a0a0;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const HeroButtons = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &.primary {
    background: #6366f1;
    color: white;

    &:hover {
      background: #4f46e5;
      transform: translateY(-2px);
    }
  }

  &.secondary {
    background: transparent;
    color: #ffffff;
    border-color: #6366f1;

    &:hover {
      background: #6366f1;
      transform: translateY(-2px);
    }
  }
`;

const FeaturedSection = styled.section`
  padding: 4rem 0;
  background: #0a0a0a;
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: #ffffff;
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
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

const GameTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #ffffff;
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
  margin: 0.5rem 0;
  color: #ffd700;
`;

const GameDescription = styled.p`
  color: #a0a0a0;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const StatsSection = styled.section`
  padding: 4rem 0;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
`;

const StatCard = styled(motion.div)`
  padding: 2rem;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 16px;
  border: 1px solid rgba(99, 102, 241, 0.2);
`;

const StatIcon = styled.div`
  font-size: 3rem;
  color: #6366f1;
  margin-bottom: 1rem;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #a0a0a0;
  font-size: 1rem;
`;

const Home = () => {
  const [featuredGames, setFeaturedGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedGames = async () => {
      try {
        const response = await axios.get('/api/featured-games');
        setFeaturedGames(response.data);
      } catch (error) {
        console.error('Öne çıkan oyunlar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedGames();
  }, []);

  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Oyun Dünyasının Geleceği
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            GameStudio Pro olarak, oyunculara unutulmaz deneyimler sunan yenilikçi oyunlar geliştiriyoruz.
            Modern teknolojiler ve yaratıcı tasarımlarla oyun dünyasının sınırlarını zorluyoruz.
          </HeroSubtitle>
          <HeroButtons
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button to="/games" className="primary">
              <FaPlay />
              Oyunları Keşfet
            </Button>
            <Button to="/about" className="secondary">
              <FaArrowRight />
              Hakkımızda
            </Button>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <FeaturedSection>
        <SectionContainer>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Öne Çıkan Oyunlar
          </SectionTitle>
          
          {loading ? (
            <div style={{ textAlign: 'center', color: '#a0a0a0' }}>Yükleniyor...</div>
          ) : (
            <GamesGrid>
              {featuredGames.map((game, index) => (
                <GameCard
                  key={game.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <GameImage image={game.image}>
                    <GameOverlay>
                      <PlayButton>
                        <FaPlay />
                      </PlayButton>
                    </GameOverlay>
                  </GameImage>
                  <GameInfo>
                    <GameTitle>{game.title}</GameTitle>
                    <GameGenre>{game.genre}</GameGenre>
                    <GameRating>
                      <FaStar />
                      {game.rating}/5.0
                    </GameRating>
                    <GameDescription>
                      {game.description.substring(0, 100)}...
                    </GameDescription>
                    <Button to={`/games/${game.id}`} className="primary">
                      Detayları Gör
                    </Button>
                  </GameInfo>
                </GameCard>
              ))}
            </GamesGrid>
          )}
        </SectionContainer>
      </FeaturedSection>

      <StatsSection>
        <SectionContainer>
          <StatsGrid>
            <StatCard
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <StatIcon>
                <FaGamepad />
              </StatIcon>
              <StatNumber>15+</StatNumber>
              <StatLabel>Başarılı Oyun</StatLabel>
            </StatCard>
            
            <StatCard
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <StatIcon>
                <FaUsers />
              </StatIcon>
              <StatNumber>1M+</StatNumber>
              <StatLabel>Aktif Oyuncu</StatLabel>
            </StatCard>
            
            <StatCard
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <StatIcon>
                <FaTrophy />
              </StatIcon>
              <StatNumber>50+</StatNumber>
              <StatLabel>Ödül</StatLabel>
            </StatCard>
            
            <StatCard
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <StatIcon>
                <FaUsers />
              </StatIcon>
              <StatNumber>150+</StatNumber>
              <StatLabel>Çalışan</StatLabel>
            </StatCard>
          </StatsGrid>
        </SectionContainer>
      </StatsSection>
    </HomeContainer>
  );
};

export default Home;
