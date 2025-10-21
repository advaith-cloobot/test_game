import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaderboardAPI } from '../services/api';

const Leaderboard = () => {
  const [topPlayers, setTopPlayers] = useState([]);
  const [userStats, setUserStats] = useState({ personal_best: 0, total_games: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      
      const [topPlayersResponse, userStatsResponse] = await Promise.all([
        leaderboardAPI.getTop5(),
        userId ? leaderboardAPI.getUserStats(userId) : Promise.resolve({ data: { stats: { personal_best: 0, total_games: 0 } } })
      ]);
      
      setTopPlayers(topPlayersResponse.data.top_players);
      setUserStats(userStatsResponse.data.stats);
    } catch (err) {
      setError('Failed to load leaderboard data');
      console.error('Leaderboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    navigate('/home');
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Leaderboard</h1>
        
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Top 5 Players</h2>
          {topPlayers.length === 0 ? (
            <p style={styles.noData}>No games played yet!</p>
          ) : (
            <div style={styles.table}>
              <div style={styles.tableHeader}>
                <div style={styles.rankColumn}>Rank</div>
                <div style={styles.nameColumn}>Player</div>
                <div style={styles.scoreColumn}>Best Score</div>
              </div>
              {topPlayers.map((player, index) => (
                <div key={index} style={styles.tableRow}>
                  <div style={styles.rankColumn}>{index + 1}</div>
                  <div style={styles.nameColumn}>{player.username}</div>
                  <div style={styles.scoreColumn}>{player.highest_score}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Your Stats</h2>
          <div style={styles.statsContainer}>
            <div style={styles.statItem}>
              <div style={styles.statLabel}>Personal Best:</div>
              <div style={styles.statValue}>{userStats.personal_best}</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statLabel}>Total Games:</div>
              <div style={styles.statValue}>{userStats.total_games}</div>
            </div>
          </div>
        </div>

        <button onClick={handleGoHome} style={styles.homeButton}>
          Back to Home
        </button>
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
    padding: '1rem',
  },
  content: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    width: '100%',
  },
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '2rem',
    color: '#333',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#333',
    textAlign: 'center',
  },
  table: {
    border: '1px solid #ddd',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'flex',
    backgroundColor: '#f8f9fa',
    fontWeight: 'bold',
    padding: '1rem',
    borderBottom: '1px solid #ddd',
  },
  tableRow: {
    display: 'flex',
    padding: '1rem',
    borderBottom: '1px solid #eee',
  },
  tableRow: {
    display: 'flex',
    padding: '1rem',
    borderBottom: '1px solid #eee',
  },
  rankColumn: {
    flex: '0 0 60px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  nameColumn: {
    flex: '1',
    textAlign: 'left',
  },
  scoreColumn: {
    flex: '0 0 100px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  noData: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: '2rem',
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '4px',
  },
  statItem: {
    textAlign: 'center',
  },
  statLabel: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '0.5rem',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#007bff',
  },
  homeButton: {
    width: '100%',
    padding: '1rem',
    fontSize: '1.1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '1rem',
  },
};

export default Leaderboard;
