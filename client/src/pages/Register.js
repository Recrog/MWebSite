import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Container = styled.div`
  padding-top: 120px;
  min-height: 100vh;
  background: #0a0a0a;
`;

const Content = styled.div`
  max-width: 420px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Title = styled.h1`
  color: #fff;
  margin-bottom: 1rem;
`;

const Form = styled.form`
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 1px solid #333;
  border-radius: 12px;
  padding: 1.5rem;
`;

const Group = styled.div`
  margin-bottom: 1rem;
  label { color: #a0a0a0; display: block; margin-bottom: 0.5rem; }
  input { width: 100%; background: #0a0a0a; color: #fff; border: 1px solid #333; border-radius: 8px; padding: 0.75rem; }
`;

const Button = styled.button`
  width: 100%; background: #6366f1; color: #fff; border: 0; border-radius: 8px; padding: 0.9rem; font-weight: 600; cursor: pointer;
`;

const Small = styled.div`
  margin-top: 1rem; color: #a0a0a0;
`;

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError('Kayıt başarısız');
    }
  };

  return (
    <Container>
      <Content>
        <Title>Kayıt Ol</Title>
        <Form onSubmit={onSubmit}>
          {error && <div style={{ color: '#ef4444', marginBottom: '0.5rem' }}>{error}</div>}
          <Group>
            <label>Ad</label>
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" required />
          </Group>
          <Group>
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </Group>
          <Group>
            <label>Şifre</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </Group>
          <Button type="submit">Kayıt Ol</Button>
          <Small>
            Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
          </Small>
        </Form>
      </Content>
    </Container>
  );
}


