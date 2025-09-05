import React from 'react';
import styled from 'styled-components';
import { FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaGamepad } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  padding: 3rem 0 1rem;
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    color: #6366f1;
    margin-bottom: 1rem;
    font-size: 1.2rem;
    font-weight: 600;
  }

  p {
    color: #a0a0a0;
    line-height: 1.6;
    margin-bottom: 0.5rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 0.5rem;
  }

  a {
    color: #a0a0a0;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #6366f1;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #333;
  border-radius: 50%;
  color: #ffffff;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: #6366f1;
    transform: translateY(-2px);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #333;
  padding-top: 1rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterTop>
          <FooterSection>
            <Logo>
              <FaGamepad />
              GameStudio Pro
            </Logo>
            <p>
              Oyun endüstrisinde yenilikçi ve kaliteli oyunlar geliştiren bir şirket.
              Modern teknolojiler kullanarak oyunculara unutulmaz deneyimler sunuyoruz.
            </p>
            <SocialLinks>
              <SocialLink href="#" aria-label="Twitter">
                <FaTwitter />
              </SocialLink>
              <SocialLink href="#" aria-label="Facebook">
                <FaFacebook />
              </SocialLink>
              <SocialLink href="#" aria-label="Instagram">
                <FaInstagram />
              </SocialLink>
              <SocialLink href="#" aria-label="YouTube">
                <FaYoutube />
              </SocialLink>
            </SocialLinks>
          </FooterSection>

          <FooterSection>
            <h3>Oyunlar</h3>
            <ul>
              <li><a href="/games">Tüm Oyunlar</a></li>
              <li><a href="/games">Yeni Çıkanlar</a></li>
              <li><a href="/games">Popüler Oyunlar</a></li>
              <li><a href="/games">Yakında</a></li>
            </ul>
          </FooterSection>

          <FooterSection>
            <h3>Şirket</h3>
            <ul>
              <li><a href="/about">Hakkımızda</a></li>
              <li><a href="/about">Kariyer</a></li>
              <li><a href="/about">Basın</a></li>
              <li><a href="/about">İletişim</a></li>
            </ul>
          </FooterSection>

          <FooterSection>
            <h3>Destek</h3>
            <ul>
              <li><a href="#">Yardım Merkezi</a></li>
              <li><a href="#">Topluluk</a></li>
              <li><a href="#">Geri Bildirim</a></li>
              <li><a href="#">SSS</a></li>
            </ul>
          </FooterSection>
        </FooterTop>

        <FooterBottom>
          <p>&copy; 2024 GameStudio Pro. Tüm hakları saklıdır.</p>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
