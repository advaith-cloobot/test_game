import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PingPongGame } from '../utils/gameLogic';
import { gameAPI } from '../services/api';

const Game = () => {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const navigate = useNavigate();
  
  const [userScore, setUserScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize game
    gameRef.current = new PingPongGame(
      canvas,
      handleScoreUpdate,
      handleGameEnd
    );

    return () => {
      if (gameRef.current) {
        gameRef.current.quit();
      }
    };
  }, []);

  const handleScoreUpdate = (user, computer) => {
    setUserScore(user);
    setComputerScore(computer);
  };

  const handleGameEnd = async (userScore, computerScore) => {
    setGameEnded(true);
    setGameStarted(false);
    
    // Save game to backend
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        await gameAPI.saveGame({
          userScore,
          computerScore
        });
      }
    } catch (err) {
      console.error('Failed to save game:', err);
    }
  };

  const handleStart = () => {
    if (gameRef.current) {
      gameRef.current.start();
      setGameStarted(true);
      setGamePaused(false);
      setGameEnded(false);
    }
  };

  const handlePause = () => {
    if (gameRef.current && gameStarted && !gamePaused) {
      gameRef.current.pause();
      setGamePaused(true);
    }
  };

  const handleResume = () => {
    if (gameRef.current && gameStarted && gamePaused) {
      gameRef.current.resume();
      setGamePaused(false);
    }
  };

  const handleRestart = () => {
    if (gameRef.current) {
      gameRef.current.restart();
      setUserScore(0);
      setComputerScore(0);
      setGameEnded(false);
    }
  };

  const handleNewGame = () => {
    if (gameRef.current) {
      gameRef.current.restart();
      setUserScore(0);
      setComputerScore(0);
      setGameEnded(false);
      setGameStarted(false);
      setGamePaused(false);
    }
  };

  const handleQuit = () => {
    if (gameRef.current) {
      gameRef.current.quit();
    }
    navigate('/home');
  };

  return (
    <div style={styles.container}>
      <div style={styles.gameContainer}>
        <h2 style={styles.title}>Ping Pong Game</h2>
        
        <div style={styles.scoreContainer}>
          <div style={styles.score}>
            <span style={styles.scoreLabel}>You: {userScore}</span>
          </div>
          <div style={styles.score}>
            <span style={styles.scoreLabel}>Computer: {computerScore}</span>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={1000}
          height={400}
          style={styles.canvas}
        />

        <div style={styles.controls}>
          {!gameStarted && !gameEnded && (
            <button onClick={handleStart} style={styles.startButton}>
              Start Game
            </button>
          )}
          
          {gameStarted && !gamePaused && !gameEnded && (
            <button onClick={handlePause} style={styles.pauseButton}>
              Pause
            </button>
          )}
          
          {gameStarted && gamePaused && !gameEnded && (
            <button onClick={handleResume} style={styles.resumeButton}>
              Resume
            </button>
          )}
          
          {gameStarted && (
            <button onClick={handleRestart} style={styles.restartButton}>
              Restart
            </button>
          )}
          
          <button onClick={handleQuit} style={styles.quitButton}>
            Quit
          </button>
        </div>

        {gameEnded && (
          <div style={styles.gameEndMessage}>
            <h3>Game Over!</h3>
            <p>
              {userScore > computerScore ? 'You Win!' : 'Computer Wins!'}
            </p>
            <p>Final Score: {userScore} - {computerScore}</p>
            <div style={styles.gameEndButtons}>
              <button onClick={handleNewGame} style={styles.newGameButton}>
                New Game
              </button>
              <button onClick={handleQuit} style={styles.quitButton}>
                Quit
              </button>
            </div>
          </div>
        )}

        <div style={styles.instructions}>
          <p><strong>Instructions:</strong></p>
          <p>• Move your mouse or use arrow keys to control your paddle</p>
          <p>• Faster paddle movement = faster ball speed!</p>
          <p>• Ball color changes with speed (blue = slow, red = fast)</p>
          <p>• First to 3 points wins!</p>
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
    padding: '1rem',
  },
  gameContainer: {
    textAlign: 'center',
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#333',
  },
  scoreContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  score: {
    flex: 1,
  },
  scoreLabel: {
    color: '#333',
  },
  canvas: {
    border: '2px solid #333',
    backgroundColor: '#000',
    marginBottom: '1rem',
  },
  controls: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '1rem',
  },
  startButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  pauseButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#ffc107',
    color: 'black',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  resumeButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  restartButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  quitButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  gameEndMessage: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    border: '1px solid #dee2e6',
  },
  gameEndButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '1rem',
  },
  newGameButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  instructions: {
    textAlign: 'left',
    fontSize: '0.9rem',
    color: '#666',
    maxWidth: '400px',
    margin: '0 auto',
  },
};

export default Game;
