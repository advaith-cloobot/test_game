export class PingPongGame {
  constructor(canvas, onScoreUpdate, onGameEnd) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onScoreUpdate = onScoreUpdate;
    this.onGameEnd = onGameEnd;
    
    // Game state
    this.gameRunning = false;
    this.gamePaused = false;
    this.userScore = 0;
    this.computerScore = 0;
    
    // Game objects
    this.ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      dx: 4,
      dy: 4,
      radius: 8
    };
    
    this.userPaddle = {
      x: 20,
      y: canvas.height / 2 - 50,
      width: 10,
      height: 100,
      speed: 5
    };
    
    this.computerPaddle = {
      x: canvas.width - 30,
      y: canvas.height / 2 - 50,
      width: 10,
      height: 100,
      speed: 3
    };
    
    // Add paddle velocity tracking
    this.userPaddleVelocity = 0;
    this.computerPaddleVelocity = 0;
    this.lastUserPaddleY = this.userPaddle.y;
    this.lastComputerPaddleY = this.computerPaddle.y;
    
    // Animation
    this.animationId = null;
    this.lastTime = 0;
    
    // Event listeners
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Mouse movement for user paddle
    this.canvas.addEventListener('mousemove', (e) => {
      if (this.gameRunning && !this.gamePaused) {
        const rect = this.canvas.getBoundingClientRect();
        this.userPaddle.y = e.clientY - rect.top - this.userPaddle.height / 2;
      }
    });
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (this.gameRunning && !this.gamePaused) {
        if (e.key === 'ArrowUp') {
          this.userPaddle.y -= this.userPaddle.speed;
        } else if (e.key === 'ArrowDown') {
          this.userPaddle.y += this.userPaddle.speed;
        }
      }
    });
  }
  
  start() {
    this.gameRunning = true;
    this.gamePaused = false;
    this.resetBall();
    this.gameLoop();
  }
  
  pause() {
    this.gamePaused = true;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
  
  resume() {
    this.gamePaused = false;
    this.gameLoop();
  }
  
  restart() {
    this.userScore = 0;
    this.computerScore = 0;
    this.resetBall();
    this.onScoreUpdate(this.userScore, this.computerScore);
  }
  
  quit() {
    this.gameRunning = false;
    this.gamePaused = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
  
  resetBall() {
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height / 2;
    this.ball.dx = (Math.random() > 0.5 ? 1 : -1) * 4;
    this.ball.dy = (Math.random() - 0.5) * 4;
  }
  
  update(deltaTime) {
    if (!this.gameRunning || this.gamePaused) return;
    
    // Update ball position
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;
    
    // Ball collision with top and bottom walls
    if (this.ball.y - this.ball.radius <= 0 || this.ball.y + this.ball.radius >= this.canvas.height) {
      this.ball.dy = -this.ball.dy;
    }
    
    // Ball collision with paddles
    this.checkPaddleCollision();
    
    // Ball out of bounds - scoring
    if (this.ball.x < 0) {
      this.computerScore++;
      this.onScoreUpdate(this.userScore, this.computerScore);
      this.checkGameEnd();
      this.resetBall();
    } else if (this.ball.x > this.canvas.width) {
      this.userScore++;
      this.onScoreUpdate(this.userScore, this.computerScore);
      this.checkGameEnd();
      this.resetBall();
    }
    
    // Update computer paddle (AI)
    this.updateComputerPaddle();
    
    // Keep paddles within canvas bounds
    this.keepPaddlesInBounds();
  }
  
  checkPaddleCollision() {
    // Calculate paddle velocities
    this.userPaddleVelocity = this.userPaddle.y - this.lastUserPaddleY;
    this.computerPaddleVelocity = this.computerPaddle.y - this.lastComputerPaddleY;
    
    // User paddle collision
    if (this.ball.x - this.ball.radius <= this.userPaddle.x + this.userPaddle.width &&
        this.ball.x + this.ball.radius >= this.userPaddle.x &&
        this.ball.y >= this.userPaddle.y &&
        this.ball.y <= this.userPaddle.y + this.userPaddle.height) {
      
      this.ball.dx = Math.abs(this.ball.dx);
      
      // Adjust ball speed based on paddle velocity
      const speedMultiplier = 1 + Math.abs(this.userPaddleVelocity) * 0.1;
      this.ball.dx *= speedMultiplier;
      
      // Add paddle velocity to ball's vertical movement
      this.ball.dy += this.userPaddleVelocity * 0.3;
      
      // Ensure minimum speed
      if (this.ball.dx < 3) this.ball.dx = 3;
      if (this.ball.dx > 12) this.ball.dx = 12;
    }
    
    // Computer paddle collision
    if (this.ball.x + this.ball.radius >= this.computerPaddle.x &&
        this.ball.x - this.ball.radius <= this.computerPaddle.x + this.computerPaddle.width &&
        this.ball.y >= this.computerPaddle.y &&
        this.ball.y <= this.computerPaddle.y + this.computerPaddle.height) {
      
      this.ball.dx = -Math.abs(this.ball.dx);
      
      // Adjust ball speed based on paddle velocity
      const speedMultiplier = 1 + Math.abs(this.computerPaddleVelocity) * 0.1;
      this.ball.dx *= speedMultiplier;
      
      // Add paddle velocity to ball's vertical movement
      this.ball.dy += this.computerPaddleVelocity * 0.3;
      
      // Ensure minimum speed
      if (this.ball.dx > -3) this.ball.dx = -3;
      if (this.ball.dx < -12) this.ball.dx = -12;
    }
    
    // Update last positions for next frame
    this.lastUserPaddleY = this.userPaddle.y;
    this.lastComputerPaddleY = this.computerPaddle.y;
  }
  
  updateComputerPaddle() {
    // Simple AI: follow the ball
    const paddleCenter = this.computerPaddle.y + this.computerPaddle.height / 2;
    const ballY = this.ball.y;
    
    if (paddleCenter < ballY - 10) {
      this.computerPaddle.y += this.computerPaddle.speed;
    } else if (paddleCenter > ballY + 10) {
      this.computerPaddle.y -= this.computerPaddle.speed;
    }
  }
  
  keepPaddlesInBounds() {
    // User paddle
    if (this.userPaddle.y < 0) this.userPaddle.y = 0;
    if (this.userPaddle.y + this.userPaddle.height > this.canvas.height) {
      this.userPaddle.y = this.canvas.height - this.userPaddle.height;
    }
    
    // Computer paddle
    if (this.computerPaddle.y < 0) this.computerPaddle.y = 0;
    if (this.computerPaddle.y + this.computerPaddle.height > this.canvas.height) {
      this.computerPaddle.y = this.canvas.height - this.computerPaddle.height;
    }
  }
  
  checkGameEnd() {
    if (this.userScore >= 3 || this.computerScore >= 3) {
      this.gameRunning = false;
      this.onGameEnd(this.userScore, this.computerScore);
    }
  }
  
  render() {
    // Clear canvas
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw center line
    this.ctx.setLineDash([5, 5]);
    this.ctx.strokeStyle = '#fff';
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width / 2, 0);
    this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
    
    // Draw ball with speed-based color
    const speed = Math.sqrt(this.ball.dx * this.ball.dx + this.ball.dy * this.ball.dy);
    const intensity = Math.min(speed / 10, 1); // Normalize speed to 0-1
    const red = Math.floor(255 * intensity);
    const green = Math.floor(255 * (1 - intensity));
    
    this.ctx.fillStyle = `rgb(${red}, ${green}, 255)`;
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Draw paddles
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(this.userPaddle.x, this.userPaddle.y, this.userPaddle.width, this.userPaddle.height);
    this.ctx.fillRect(this.computerPaddle.x, this.computerPaddle.y, this.computerPaddle.width, this.computerPaddle.height);
    
    // Draw scores
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.userScore.toString(), this.canvas.width / 4, 60);
    this.ctx.fillText(this.computerScore.toString(), 3 * this.canvas.width / 4, 60);
  }
  
  gameLoop(currentTime = 0) {
    if (!this.gameRunning) return;
    
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    this.update(deltaTime);
    this.render();
    
    this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
  }
}
