class Experiment {
  // Group Details
  static rollNos = "102103432,102103447";
  static names = "The BBC(Harsh Jain, Shreeya Chatterji)";

  canvasSel = "#myCanvas";

  run() {
    // Run the Steppers
    // this.runSteppers()

    // Hide Steppers
    this.hideSteppers();
    this.runBallCatcher();
    canvasSetup(this.canvasSel);

    // Clock
    // --------------------------------------------------
    // const clock = new Clock(this.canvasSel)
    // const ms = document.timeline.currentTime
    // clock.draw(ms)
    // clock.draw(ms+25000)

    //sending a draw call...after call is finished, it calls its own self by the next poll of the browser
    // const clockRafFn = (ts) => {
    //   clock.draw(ts)
    //   window.requestAnimationFrame(clockRafFn)
    // }
    // const clockRaf = window.requestAnimationFrame(clockRafFn)
  }

  runBallCatcher() {
    const ballCatcher = new BallBouncer(this.canvasSel);
    ballCatcher.run();
  }

  runSteppers() {
    // Steppers
    // --------------------------------------------------
    const stepperOneRaf = window.requestAnimationFrame(stepperOne);

    const stepperTwoRaf = window.requestAnimationFrame(stepperTwo);

    const stepperThree = new StepperThree("#valueFromStepperThree", 15);
    const stepperThreeFn = (ts) => {
      if (!stepperThree.isActive) stepperThree.start();
      stepperThree.step(ts);
      window.requestAnimationFrame(stepperThreeFn);
    };
    const stepperThreeRaf = window.requestAnimationFrame(stepperThreeFn);
    // --------------------------------------------------
  }

  hideSteppers() {
    document.querySelector("#side-note").classList.add("hidden");
  }
}
