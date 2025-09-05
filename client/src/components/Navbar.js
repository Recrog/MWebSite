import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaGamepad } from 'react-icons/fa';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${props => props.scrolled ? 'rgba(10, 10, 10, 0.95)' : 'transparent'};
  backdrop-filter: ${props => props.scrolled ? 'blur(10px)' : 'none'};
  transition: all 0.3s ease;
  padding: 1rem 0;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #6366f1;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  position: relative;
  transition: color 0.3s ease;

  &:hover {
    color: #6366f1;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: #6366f1;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }

  &.active::after {
    width: 100%;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #6366f1;
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 10, 0.98);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  z-index: 999;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 600;
  transition: color 0.3s ease;

  &:hover {
    color: #6366f1;
  }
`;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <Nav scrolled={scrolled}>
      <NavContainer>
        <Logo to="/">
          <FaGamepad />
          GameStudio Pro
        </Logo>

        <NavLinks>
          <NavLink to="/" className={location.pathname === '/' ? 'active' : ''}>
            Ana Sayfa
          </NavLink>
          <NavLink to="/games" className={location.pathname === '/games' ? 'active' : ''}>
            Oyunlar
          </NavLink>
          <NavLink to="/about" className={location.pathname === '/about' ? 'active' : ''}>
            Hakkımızda
          </NavLink>
          <NavLink to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
            Admin
          </NavLink>
          {user ? (
            <>
              <span style={{ color: '#a0a0a0' }}>{user.email}</span>
              <button onClick={logout} style={{ background: 'transparent', border: 0, color: '#fff', cursor: 'pointer' }}>Çıkış</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={location.pathname === '/login' ? 'active' : ''}>Giriş</NavLink>
              <NavLink to="/register" className={location.pathname === '/register' ? 'active' : ''}>Kayıt</NavLink>
            </>
          )}
        </NavLinks>

        <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>
      </NavContainer>

      {mobileMenuOpen && (
        <MobileMenu
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <MobileNavLink to="/">Ana Sayfa</MobileNavLink>
          <MobileNavLink to="/games">Oyunlar</MobileNavLink>
          <MobileNavLink to="/about">Hakkımızda</MobileNavLink>
          <MobileNavLink to="/admin">Admin</MobileNavLink>
          {user ? (
            <MobileNavLink to="#" onClick={logout}>Çıkış</MobileNavLink>
          ) : (
            <>
              <MobileNavLink to="/login">Giriş</MobileNavLink>
              <MobileNavLink to="/register">Kayıt</MobileNavLink>
            </>
          )}
        </MobileMenu>
      )}
    </Nav>
  );
};

export default Navbar;
