class Experiment {
  // Group Details
  static rollNos = "102103432,102103447";
  static names = "Pixel Pushers(Harsh Jain, Shreeya Chatterji)";

  canvasSel = "#myCanvas";

  run() {
    this.runBallCatcher();
    canvasSetup(this.canvasSel);
  }

  runBallCatcher() {
    const ballCatcher = new BallBouncer(this.canvasSel);
    ballCatcher.run();
  }
}
