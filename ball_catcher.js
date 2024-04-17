class BallBouncer {
  constructor(canvasSelector) {
    this.canvas = document.querySelector(canvasSelector);
    this.ctx = this.canvas.getContext("2d");
    this.bb = this.canvas.getBoundingClientRect();
    this.width = this.bb.width;
    this.height = this.bb.height;

    // // Paddle properties
    this.paddleWidth = 100;
    this.paddleHeight = 10;
    this.paddleX = (this.width - this.paddleWidth) / 2;
    this.paddleSpeed = 12;

    // // Ball properties
    this.ballRadius = 10;
    this.ballColor = "#FF5733";
    this.ballSpeedX = 3;
    this.ballSpeedY = -3;
    this.ballX = Math.random() * (this.width - this.ballRadius * 2) + this.ballRadius;
    this.ballY = this.height - this.paddleHeight - this.ballRadius;

    // // Game propertiess
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;

    // //sound effect
    this.paddleSound = new Audio("successful_bounce.mp3");
    this.gameOverSound = new Audio("game_over.mp3");
    this.missBounceSound = new Audio("miss_bounce.mp3");
    this.gameStartSound = new Audio("game-start.mp3");

    // Event listeners for controls
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  drawPaddle() {
    this.ctx.fillStyle = "#3366CC";
    this.ctx.fillRect(this.paddleX, this.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);
  }

  drawBall() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.ballColor;
    this.ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2);
    this.ctx.fill();
  }

    movePaddle(direction) {
      if (direction === "left") {
        this.paddleX = Math.max(0, this.paddleX - this.paddleSpeed);
      } else if (direction === "right") {
        this.paddleX = Math.min(this.width - this.paddleWidth, this.paddleX + this.paddleSpeed);
      }
    }

    moveBall() {
      this.ballX += this.ballSpeedX;
      this.ballY += this.ballSpeedY;

      // Collision with paddle
      if (
        this.ballY + this.ballRadius >= this.height - this.paddleHeight &&
        this.ballX >= this.paddleX &&
        this.ballX <= this.paddleX + this.paddleWidth
      ) {
        this.ballSpeedY = -this.ballSpeedY;
        this.score++;

        // Play the paddle sound
        this.paddleSound.play();
      }

      // Collision with walls
      if (this.ballX + this.ballRadius >= this.width || this.ballX - this.ballRadius <= 0) {
        this.ballSpeedX = -this.ballSpeedX;
      }
      if (this.ballY - this.ballRadius <= 0) {
        this.ballSpeedY = -this.ballSpeedY;
      }

      // Out of bounds (ball missed)
      if (this.ballY + this.ballRadius >= this.height) {
        this.lives--;
        if (this.lives === 0) {
          // Play the game over sound
          this.gameOverSound.play();
          this.gameOver = true;
        } else {
          this.resetBall();
          // Play the miss sound
          this.missBounceSound.play();
        }
      }
    }

    resetBall() {
      this.ballX = Math.random() * (this.width - this.ballRadius * 2) + this.ballRadius;
      this.ballY = this.height - this.paddleHeight - this.ballRadius;
      this.ballSpeedY = -Math.abs(this.ballSpeedY); // reset ball direction
    }

  drawScore() {
    this.ctx.font = "16px Arial";
    this.ctx.fillStyle = "#0000FF";
    this.ctx.fillText("Score: " + this.score, 20, 50);
  }

  drawLives() {
    this.ctx.font = "16px Arial";
    this.ctx.fillStyle = "#FF0000";
    this.ctx.fillText("Lives: " + this.lives, 20, 70);
  }

  drawGameName() {
    this.ctx.font = "16px Arial";
    this.ctx.fillStyle = "#FF0000";
    this.ctx.fillText("PING PONG GAME", 20, 30);
  }

    drawGameOver() {
      this.ctx.font = "30px Arial";
      this.ctx.fillStyle = "#FF5733";
      this.ctx.fillText("Game Over!", this.width / 2 - 100, this.height / 2);
    }

    clearCanvas() {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }

  update() {
        if (!this.gameOver) {
          this.clearCanvas();
    this.drawPaddle();
    this.drawBall();
          this.moveBall();
    this.drawScore();
    this.drawLives();
    this.drawGameName();
        } else {
          this.clearCanvas();
          this.drawGameOver();
        }
  }

    handleKeyDown(event) {
      if (event.key === "ArrowLeft") {
        this.movePaddle("left");
      } else if (event.key === "ArrowRight") {
        this.movePaddle("right");
      }
    }

  run() {
    this.update();
    requestAnimationFrame(this.run.bind(this));
  }
}