import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUsers, FaTrophy, FaMapMarkerAlt, FaCalendarAlt, FaGamepad, FaLightbulb, FaRocket } from 'react-icons/fa';
import axios from 'axios';

const AboutContainer = styled.div`
  padding-top: 120px;
  min-height: 100vh;
  background: #0a0a0a;
`;

const AboutContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
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

const Section = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border-radius: 16px;
  padding: 3rem;
  margin-bottom: 3rem;
  border: 1px solid #333;
`;

const SectionTitle = styled(motion.h2)`
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CompanyInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const InfoCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(99, 102, 241, 0.2);
`;

const InfoIcon = styled.div`
  font-size: 2rem;
  color: #6366f1;
`;

const InfoContent = styled.div`
  h3 {
    color: #ffffff;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: #a0a0a0;
    font-size: 0.9rem;
  }
`;

const Description = styled.p`
  color: #a0a0a0;
  line-height: 1.8;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const VisionMission = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const VisionCard = styled.div`
  padding: 2rem;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(99, 102, 241, 0.2);
  text-align: center;

  h3 {
    color: #6366f1;
    font-size: 1.3rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  p {
    color: #a0a0a0;
    line-height: 1.6;
  }
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const AchievementCard = styled(motion.div)`
  padding: 1.5rem;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  text-align: center;

  h4 {
    color: #ffd700;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: #a0a0a0;
    font-size: 0.9rem;
  }
`;

const TeamSection = styled.div`
  margin-bottom: 3rem;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const TeamMember = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 16px;
  border: 1px solid rgba(99, 102, 241, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const MemberImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 1rem;
  border: 3px solid #6366f1;
`;

const MemberName = styled.h3`
  color: #ffffff;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const MemberPosition = styled.p`
  color: #6366f1;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #a0a0a0;
  font-size: 1.1rem;
  padding: 3rem;
`;

const About = () => {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await axios.get('/api/company');
        setCompanyInfo(response.data);
      } catch (error) {
        console.error('Şirket bilgileri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInfo();
  }, []);

  if (loading) {
    return (
      <AboutContainer>
        <AboutContent>
          <LoadingMessage>Şirket bilgileri yükleniyor...</LoadingMessage>
        </AboutContent>
      </AboutContainer>
    );
  }

  if (!companyInfo) {
    return (
      <AboutContainer>
        <AboutContent>
          <LoadingMessage>Şirket bilgileri yüklenemedi.</LoadingMessage>
        </AboutContent>
      </AboutContainer>
    );
  }

  return (
    <AboutContainer>
      <AboutContent>
        <PageHeader>
          <PageTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Hakkımızda
          </PageTitle>
          <PageSubtitle>
            GameStudio Pro'nun hikayesi ve oyun endüstrisindeki yolculuğumuz
          </PageSubtitle>
        </PageHeader>

        <Section>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <FaGamepad />
            Şirket Hakkında
          </SectionTitle>
          
          <CompanyInfo>
            <InfoCard>
              <InfoIcon>
                <FaCalendarAlt />
              </InfoIcon>
              <InfoContent>
                <h3>Kuruluş Yılı</h3>
                <p>{companyInfo.founded}</p>
              </InfoContent>
            </InfoCard>
            
            <InfoCard>
              <InfoIcon>
                <FaUsers />
              </InfoIcon>
              <InfoContent>
                <h3>Çalışan Sayısı</h3>
                <p>{companyInfo.employees}</p>
              </InfoContent>
            </InfoCard>
            
            <InfoCard>
              <InfoIcon>
                <FaMapMarkerAlt />
              </InfoIcon>
              <InfoContent>
                <h3>Konum</h3>
                <p>{companyInfo.location}</p>
              </InfoContent>
            </InfoCard>
          </CompanyInfo>

          <Description>{companyInfo.description}</Description>
        </Section>

        <Section>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <FaLightbulb />
            Vizyon ve Misyon
          </SectionTitle>
          
          <VisionMission>
            <VisionCard>
              <h3>
                <FaLightbulb />
                Vizyonumuz
              </h3>
              <p>{companyInfo.vision}</p>
            </VisionCard>
            
            <VisionCard>
              <h3>
                <FaRocket />
                Misyonumuz
              </h3>
              <p>{companyInfo.mission}</p>
            </VisionCard>
          </VisionMission>
        </Section>

        <Section>
          <SectionTitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <FaTrophy />
            Başarılarımız
          </SectionTitle>
          
          <AchievementsGrid>
            {companyInfo.achievements.map((achievement, index) => (
              <AchievementCard
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h4>Başarı</h4>
                <p>{achievement}</p>
              </AchievementCard>
            ))}
          </AchievementsGrid>
        </Section>

        <Section>
          <TeamSection>
            <SectionTitle
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <FaUsers />
              Ekibimiz
            </SectionTitle>
            
            <TeamGrid>
              {companyInfo.team.map((member, index) => (
                <TeamMember
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <MemberImage src={member.image} alt={member.name} />
                  <MemberName>{member.name}</MemberName>
                  <MemberPosition>{member.position}</MemberPosition>
                </TeamMember>
              ))}
            </TeamGrid>
          </TeamSection>
        </Section>
      </AboutContent>
    </AboutContainer>
  );
};

export default About;
