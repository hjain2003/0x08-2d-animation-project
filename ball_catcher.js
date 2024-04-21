class BallBouncer {
  constructor(canvasSelector) {
    this.canvas = document.querySelector(canvasSelector);
    this.ctx = this.canvas.getContext("2d");
    this.bb = this.canvas.getBoundingClientRect();
    this.width = this.bb.width;
    this.height = this.bb.height;

    this.canvas.style.backgroundColor = "#DEEFE7";

    // // Paddle properties
    this.paddleWidth = 100;
    this.paddleHeight = 15;
    this.paddleX = (this.width - this.paddleWidth) / 2;
    this.paddleSpeed = 30;

    // // Ball properties
    this.ballRadius = 18;
    this.ballColor = "#159A9C";
    //Different devices show different speeds according to their system specifications like frame rate, hardware performance etcetera
    this.ballSpeedX = 2;class BallBouncer {
  constructor(canvasSelector) {
    this.canvas = document.querySelector(canvasSelector);
    this.ctx = this.canvas.getContext("2d");
    this.bb = this.canvas.getBoundingClientRect();
    this.width = this.bb.width;
    this.height = this.bb.height;

    this.canvas.style.backgroundColor = "#DEEFE7";

    // // Paddle properties
    this.paddleWidth = 100;
    this.paddleHeight = 15;
    this.paddleX = (this.width - this.paddleWidth) / 2;
    this.paddleSpeed = 30;

    // // Ball properties
    this.ballRadius = 18;
    this.ballColor = "#159A9C";
    this.ballSpeedX = 3;
    this.ballSpeedY = -3;
    this.ballX = Math.random() * (this.width - this.ballRadius * 2) + this.ballRadius;
    this.ballY = this.height - this.paddleHeight - this.ballRadius;

    // // Game propertiess
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.gameStarted = false;

    // //sound effect
    this.paddleSound = new Audio("successful_bounce.mp3");
    this.gameOverSound = new Audio("game_over.mp3");
    this.missBounceSound = new Audio("miss_bounce.mp3");
    this.gameStartSound = new Audio("game-start.mp3");

    // Stopwatch properties
    this.stopwatchRadius = 30;
    this.stopwatchColor = "#159A9C";
    this.stopwatchX = 50;
    this.stopwatchY = 120;
    this.stopwatchStartTime = 0;
    this.stopwatchInterval = null;

    // Event listeners for controls
    document.addEventListener("keydown", this.handleKeyDown.bind(this));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        if (!this.gameStarted) {
          this.startGame();
        }
      }
    });
  }

  drawPaddle() {
    // Define paddle styles
    const paddleColor = "#002333"; // Dark blue color
    const borderRadius = 10; // Border radius for rounded corners

    // Draw paddle
    this.ctx.fillStyle = paddleColor;
    this.ctx.beginPath();
    this.ctx.moveTo(this.paddleX + borderRadius, this.height - this.paddleHeight);
    this.ctx.lineTo(this.paddleX + this.paddleWidth - borderRadius, this.height - this.paddleHeight);
    this.ctx.quadraticCurveTo(
      this.paddleX + this.paddleWidth,
      this.height - this.paddleHeight,
      this.paddleX + this.paddleWidth,
      this.height - this.paddleHeight + borderRadius
    );
    this.ctx.lineTo(this.paddleX + this.paddleWidth, this.height);
    this.ctx.lineTo(this.paddleX, this.height);
    this.ctx.lineTo(this.paddleX, this.height - this.paddleHeight + borderRadius);
    this.ctx.quadraticCurveTo(
      this.paddleX,
      this.height - this.paddleHeight,
      this.paddleX + borderRadius,
      this.height - this.paddleHeight
    );
    this.ctx.closePath();
    this.ctx.fill();
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
    if (!this.gameStarted) return;

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
        this.drawGameOver();
      } else {
        this.resetBall();
        // Play the miss sound
      }
    }
  }

  resetBall() {
    this.missBounceSound.play();
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
    // Background box
    this.ctx.fillStyle = "#002333";
    this.ctx.fillRect(10, 0, 160, 30);

    // Text
    this.ctx.font = "16px Arial";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("PING PONG GAME", 20, 20);
    if (!this.gameStarted) {
      // Display "Click to Start" message at the center of the canvas
      const text = "Press Enter to Start";
      const textWidth = this.ctx.measureText(text).width;
      const textX = (this.width - 250) / 2;
      const textY = this.height / 2;

      this.ctx.font = "30px Arial";
      this.ctx.fillStyle = "#FF5733";
      this.ctx.fillText(text, textX, textY);
    }
  }

  drawGameOver() {
    this.canvas.style.backgroundColor = "#505653";
    this.ctx.font = "40px Arial";
    this.ctx.fillStyle = "#FF5733";
    this.ctx.fillText("GAME OVER!", this.width / 2 - 135, this.height / 2.25);

    // Background box
    this.ctx.fillStyle = "#F2CDAC";
    this.ctx.fillRect(this.width / 2.5, this.height / 2, this.width / 2 - 450, 100);

    // Display duration
    const duration = Math.floor(this.getSecondsElapsed()) % 60;
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText("You lasted: " + duration + " seconds", this.width / 2 - 100, this.height / 2 + 25);

    // Text
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText("Score : " + this.score, this.width / 2 - 43, this.height / 2 + 61);

    // Text
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "#ab0c0f";
    this.ctx.fillText("Reload Page to play again!", this.width / 2 - 125, this.height / 2 + 90);
  }

  drawStopwatch() {
    // Draw outer border
    this.ctx.beginPath();
    this.ctx.arc(this.stopwatchX, this.stopwatchY, this.stopwatchRadius + 4, 0, Math.PI * 2);
    this.ctx.strokeStyle = "#159A9C";
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
  
    // Draw inner circle
    this.ctx.beginPath();
    this.ctx.arc(this.stopwatchX, this.stopwatchY, this.stopwatchRadius + 2, 0, Math.PI * 2);
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fill();
  
    if (this.gameStarted) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.stopwatchColor;
      this.ctx.lineWidth = 3;
      this.ctx.moveTo(this.stopwatchX, this.stopwatchY);
      this.ctx.lineTo(
        this.stopwatchX + this.stopwatchRadius * Math.cos((2 * Math.PI * this.getSecondsElapsed()) / 60 - Math.PI / 2),
        this.stopwatchY + this.stopwatchRadius * Math.sin((2 * Math.PI * this.getSecondsElapsed()) / 60 - Math.PI / 2)
      );
      this.ctx.stroke();
    }
  
    const secondsText = Math.floor(this.getSecondsElapsed()) % 60;
    this.ctx.font = "16px Arial";
    this.ctx.fillStyle = "#000000";
    this.ctx.fillText(secondsText, this.stopwatchX - 8, this.stopwatchY + this.stopwatchRadius + 20);
  }
  

  getSecondsElapsed() {
    if (this.gameStarted) {
      return (Date.now() - this.stopwatchStartTime) / 1000;
    } else {
      return 0;
    }
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
      this.drawStopwatch();
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

  startGame() {
    this.gameStartSound.play();
    this.canvas.removeEventListener("click", this.startGame.bind(this));
    this.canvas.style.cursor = "none";
    this.gameStarted = true;
    this.stopwatchStartTime = Date.now();
    this.stopwatchInterval = setInterval(() => {
      if (!this.gameOver) {
        this.update();
      } else {
        clearInterval(this.stopwatchInterval); // Stop the stopwatch when the game is over
      }
    }, 1000); // Update stopwatch every second
    requestAnimationFrame(this.run.bind(this));
  }

  run() {
    if (!this.gameOver) {
      this.update();
      requestAnimationFrame(this.run.bind(this));
    }
  }
}

    this.ballSpeedY = -2;
    this.ballX = Math.random() * (this.width - this.ballRadius * 2) + this.ballRadius;
    this.ballY = this.height - this.paddleHeight - this.ballRadius;

    // // Game propertiess
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.gameStarted = false;

    // //sound effect
    this.paddleSound = new Audio("successful_bounce.mp3");
    this.gameOverSound = new Audio("game_over.mp3");
    this.missBounceSound = new Audio("miss_bounce.mp3");
    this.gameStartSound = new Audio("game-start.mp3");

    // Stopwatch properties
    this.stopwatchRadius = 30;
    this.stopwatchColor = "#159A9C";
    this.stopwatchX = 50;
    this.stopwatchY = 120;
    this.stopwatchStartTime = 0;
    this.stopwatchInterval = null;

    // Event listeners for controls
    document.addEventListener("keydown", this.handleKeyDown.bind(this));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        if (!this.gameStarted) {
          this.startGame();
        }
      }
    });
  }

  drawPaddle() {
    // Define paddle styles
    const paddleColor = "#002333"; // Dark blue color
    const borderRadius = 10; // Border radius for rounded corners

    // Draw paddle
    this.ctx.fillStyle = paddleColor;
    this.ctx.beginPath();
    this.ctx.moveTo(this.paddleX + borderRadius, this.height - this.paddleHeight);
    this.ctx.lineTo(this.paddleX + this.paddleWidth - borderRadius, this.height - this.paddleHeight);
    this.ctx.quadraticCurveTo(
      this.paddleX + this.paddleWidth,
      this.height - this.paddleHeight,
      this.paddleX + this.paddleWidth,
      this.height - this.paddleHeight + borderRadius
    );
    this.ctx.lineTo(this.paddleX + this.paddleWidth, this.height);
    this.ctx.lineTo(this.paddleX, this.height);
    this.ctx.lineTo(this.paddleX, this.height - this.paddleHeight + borderRadius);
    this.ctx.quadraticCurveTo(
      this.paddleX,
      this.height - this.paddleHeight,
      this.paddleX + borderRadius,
      this.height - this.paddleHeight
    );
    this.ctx.closePath();
    this.ctx.fill();
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
    if (!this.gameStarted) return;

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
        this.drawGameOver();
      } else {
        this.resetBall();
        // Play the miss sound
      }
    }
  }

  resetBall() {
    this.missBounceSound.play();
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
    // Background box
    this.ctx.fillStyle = "#002333";
    this.ctx.fillRect(10, 0, 160, 30);

    // Text
    this.ctx.font = "16px Arial";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("PING PONG GAME", 20, 20);
    if (!this.gameStarted) {
      // Display "Click to Start" message at the center of the canvas
      const text = "Press Enter to Start";
      const textWidth = this.ctx.measureText(text).width;
      const textX = (this.width - 250) / 2;
      const textY = this.height / 2;

      this.ctx.font = "30px Arial";
      this.ctx.fillStyle = "#FF5733";
      this.ctx.fillText(text, textX, textY);
    }
  }

  drawGameOver() {
    this.canvas.style.backgroundColor = "#505653";
    this.ctx.font = "40px Arial";
    this.ctx.fillStyle = "#FF5733";
    this.ctx.fillText("GAME OVER!", this.width / 2 - 135, this.height / 2.25);

    // Background box
    this.ctx.fillStyle = "#F2CDAC";
    this.ctx.fillRect(this.width / 2.5, this.height / 2, this.width / 2 - 450, 100);

    // Display duration
    const duration = Math.floor(this.getSecondsElapsed()) % 60;
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText("You lasted: " + duration + " seconds", this.width / 2 - 100, this.height / 2 + 25);

    // Text
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText("Score : " + this.score, this.width / 2 - 43, this.height / 2 + 61);

    // Text
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "#ab0c0f";
    this.ctx.fillText("Reload Page to play again!", this.width / 2 - 125, this.height / 2 + 90);
  }

  drawStopwatch() {
    // Draw outer border
    this.ctx.beginPath();
    this.ctx.arc(this.stopwatchX, this.stopwatchY, this.stopwatchRadius + 4, 0, Math.PI * 2);
    this.ctx.strokeStyle = "#159A9C";
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
  
    // Draw inner circle
    this.ctx.beginPath();
    this.ctx.arc(this.stopwatchX, this.stopwatchY, this.stopwatchRadius + 2, 0, Math.PI * 2);
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fill();
  
    if (this.gameStarted) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.stopwatchColor;
      this.ctx.lineWidth = 3;
      this.ctx.moveTo(this.stopwatchX, this.stopwatchY);
      this.ctx.lineTo(
        this.stopwatchX + this.stopwatchRadius * Math.cos((2 * Math.PI * this.getSecondsElapsed()) / 60 - Math.PI / 2),
        this.stopwatchY + this.stopwatchRadius * Math.sin((2 * Math.PI * this.getSecondsElapsed()) / 60 - Math.PI / 2)
      );
      this.ctx.stroke();
    }
  
    const secondsText = Math.floor(this.getSecondsElapsed()) % 60;
    this.ctx.font = "16px Arial";
    this.ctx.fillStyle = "#000000";
    this.ctx.fillText(secondsText, this.stopwatchX - 8, this.stopwatchY + this.stopwatchRadius + 20);
  }
  

  getSecondsElapsed() {
    if (this.gameStarted) {
      return (Date.now() - this.stopwatchStartTime) / 1000;
    } else {
      return 0;
    }
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
      this.drawStopwatch();
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

  startGame() {
    this.gameStartSound.play();
    this.canvas.removeEventListener("click", this.startGame.bind(this));
    this.canvas.style.cursor = "none";
    this.gameStarted = true;
    this.stopwatchStartTime = Date.now();
    this.stopwatchInterval = setInterval(() => {
      if (!this.gameOver) {
        this.update();
      } else {
        clearInterval(this.stopwatchInterval); // Stop the stopwatch when the game is over
      }
    }, 1000); // Update stopwatch every second
    requestAnimationFrame(this.run.bind(this));
  }

  run() {
    if (!this.gameOver) {
      this.update();
      requestAnimationFrame(this.run.bind(this));
    }
  }
}
