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
    this.paddleSound = new Audio("shortfart.mp3");
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

  drawScore() {
    this.ctx.font = "16px Arial";
    this.ctx.fillStyle = "#0000FF";
    this.ctx.fillText("Score: " + this.score, 20, 30);
  }

  drawLives() {
    this.ctx.font = "16px Arial";
    this.ctx.fillStyle = "#FF0000";
    this.ctx.fillText("Lives: " + this.lives, this.width - 120, 30);
  }

  update() {
    this.drawPaddle();
    this.drawBall();
    this.drawScore();
    this.drawLives();
  }

  run() {
    this.update();
    requestAnimationFrame(this.run.bind(this));
  }
}
