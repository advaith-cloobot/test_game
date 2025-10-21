import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear local storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      navigate('/login');
    }
  };

  const handleStartGame = () => {
    navigate('/game');
  };

  const handleLeaderboard = () => {
    navigate('/leaderboard');
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Ping Pong Game</h1>
        <p style={styles.welcome}>Welcome, {username}!</p>
        
        <div style={styles.buttonContainer}>
          <button onClick={handleStartGame} style={styles.primaryButton}>
            Start Game
          </button>
          
          <button onClick={handleLeaderboard} style={styles.secondaryButton}>
            Leaderboard
          </button>
          
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f0f0',
  },
  content: {
    textAlign: 'center',
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    width: '100%',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    color: '#333',
  },
  welcome: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    color: '#666',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  primaryButton: {
    padding: '1rem 2rem',
    fontSize: '1.2rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  secondaryButton: {
    padding: '1rem 2rem',
    fontSize: '1.2rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default Home;
