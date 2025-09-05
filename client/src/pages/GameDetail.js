import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaStar, FaPlay, FaArrowLeft, FaCalendar, FaTag, FaDesktop, FaMemory, FaMicrochip, FaHdd } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const GameDetailContainer = styled.div`
  padding-top: 120px;
  min-height: 100vh;
  background: #0a0a0a;
`;

const GameDetailContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #6366f1;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 2rem;
  transition: color 0.3s ease;

  &:hover {
    color: #4f46e5;
  }
`;

const GameHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const GameImage = styled.div`
  height: 400px;
  background: url(${props => props.image}) center/cover;
  border-radius: 16px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 300px;
  }
`;

const GameInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const GameTitle = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #ffffff;
`;

const GameMeta = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #a0a0a0;
  font-size: 0.9rem;
`;

const GameRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffd700;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const GamePrice = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 1.5rem;
`;

const GameDescription = styled.p`
  color: #a0a0a0;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-size: 1rem;
`;

const GameFeatures = styled.div`
  margin-bottom: 2rem;
`;

const FeaturesTitle = styled.h3`
  color: #ffffff;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const FeaturesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FeatureTag = styled.span`
  background: rgba(99, 102, 241, 0.2);
  color: #6366f1;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const BuyButton = styled.button`
  background: #6366f1;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: fit-content;

  &:hover {
    background: #4f46e5;
    transform: translateY(-2px);
  }
`;

const GameSections = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const MainSection = styled.div``;

const SideSection = styled.div``;

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

const TrailerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 2rem;
`;

const TrailerIframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

const ScreenshotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Screenshot = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const RequirementsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RequirementsSection = styled.div`
  h4 {
    color: #6366f1;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }
`;

const RequirementItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #a0a0a0;

  svg {
    color: #6366f1;
    width: 16px;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #a0a0a0;
  font-size: 1.1rem;
  padding: 3rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #ef4444;
  font-size: 1.1rem;
  padding: 3rem;
`;

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/games/${id}`);
        setGame(response.data);
      } catch (error) {
        console.error('Oyun detayları yüklenirken hata:', error);
        setError('Oyun bulunamadı');
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  if (loading) {
    return (
      <GameDetailContainer>
        <GameDetailContent>
          <LoadingMessage>Oyun detayları yükleniyor...</LoadingMessage>
        </GameDetailContent>
      </GameDetailContainer>
    );
  }

  if (error || !game) {
    return (
      <GameDetailContainer>
        <GameDetailContent>
          <ErrorMessage>
            {error || 'Oyun bulunamadı'}
          </ErrorMessage>
        </GameDetailContent>
      </GameDetailContainer>
    );
  }

  return (
    <GameDetailContainer>
      <GameDetailContent>
        <BackButton to="/games">
          <FaArrowLeft />
          Oyunlara Dön
        </BackButton>

        <GameHeader>
          <GameImage image={game.image} />
          <GameInfo>
            <GameTitle
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {game.title}
            </GameTitle>
            
            <GameMeta>
              <MetaItem>
                <FaTag />
                {game.genre}
              </MetaItem>
              <MetaItem>
                <FaCalendar />
                {new Date(game.releaseDate).toLocaleDateString('tr-TR')}
              </MetaItem>
            </GameMeta>

            <GameRating>
              <FaStar />
              {game.rating}/5.0
            </GameRating>

            <GamePrice>₺{game.price}</GamePrice>

            <GameDescription>{game.description}</GameDescription>

            <GameFeatures>
              <FeaturesTitle>Özellikler</FeaturesTitle>
              <FeaturesList>
                {game.features.map((feature, index) => (
                  <FeatureTag key={index}>{feature}</FeatureTag>
                ))}
              </FeaturesList>
            </GameFeatures>

            <BuyButton onClick={async () => {
              try {
                const res = await axios.post('/api/checkout', { gameId: id, quantity: 1 });
                if (res.data.url) {
                  window.location.href = res.data.url;
                }
              } catch (e) {
                alert('Ödeme başlatılırken hata oluştu');
              }
            }}>
              <FaPlay />
              Satın Al
            </BuyButton>
          </GameInfo>
        </GameHeader>

        <GameSections>
          <MainSection>
            <Section>
              <SectionTitle>
                <FaPlay />
                Oyun Trailer'ı
              </SectionTitle>
              <TrailerContainer>
                <TrailerIframe
                  src={game.trailer}
                  title={`${game.title} Trailer`}
                  allowFullScreen
                />
              </TrailerContainer>
            </Section>

            <Section>
              <SectionTitle>Ekran Görüntüleri</SectionTitle>
              <ScreenshotsGrid>
                {game.screenshots.map((screenshot, index) => (
                  <Screenshot
                    key={index}
                    src={screenshot}
                    alt={`${game.title} Screenshot ${index + 1}`}
                  />
                ))}
              </ScreenshotsGrid>
            </Section>
          </MainSection>

          <SideSection>
            <Section>
              <SectionTitle>
                <FaDesktop />
                Sistem Gereksinimleri
              </SectionTitle>
              <RequirementsGrid>
                <RequirementsSection>
                  <h4>Minimum Gereksinimler</h4>
                  <RequirementItem>
                    <FaMicrochip />
                    {game.systemRequirements.minimum.processor}
                  </RequirementItem>
                  <RequirementItem>
                    <FaMemory />
                    {game.systemRequirements.minimum.memory}
                  </RequirementItem>
                  <RequirementItem>
                    <FaDesktop />
                    {game.systemRequirements.minimum.graphics}
                  </RequirementItem>
                  <RequirementItem>
                    <FaHdd />
                    {game.systemRequirements.minimum.storage}
                  </RequirementItem>
                </RequirementsSection>

                <RequirementsSection>
                  <h4>Önerilen Gereksinimler</h4>
                  <RequirementItem>
                    <FaMicrochip />
                    {game.systemRequirements.recommended.processor}
                  </RequirementItem>
                  <RequirementItem>
                    <FaMemory />
                    {game.systemRequirements.recommended.memory}
                  </RequirementItem>
                  <RequirementItem>
                    <FaDesktop />
                    {game.systemRequirements.recommended.graphics}
                  </RequirementItem>
                  <RequirementItem>
                    <FaHdd />
                    {game.systemRequirements.recommended.storage}
                  </RequirementItem>
                </RequirementsSection>
              </RequirementsGrid>
            </Section>
          </SideSection>
        </GameSections>
      </GameDetailContent>
    </GameDetailContainer>
  );
};

export default GameDetail;
