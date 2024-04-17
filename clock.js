class Clock extends Domel {
  T;
  stepperSeconds;
  stepperMinutes;
  stepperHours;

  constructor(canvasSel, T = -1) {
    super(canvasSel);
    this.T = T;

    const ff = 1.0;
    this.stepperHours = new Stepper(ff / 3600);
    this.stepperMinutes = new Stepper(ff / 60);
    this.stepperSeconds = new Stepper(ff);
  }

  draw(ms) {
    const canvas = this.el;
    const { width: W, height: H } = canvas;
    const ctx = canvas.getContext("2d");

    ctx.reset();

    ctx.save();
    ctx.transform(1.0, 0.0, 0.0, 1.0, W / 2, H / 2);
    ctx.transform(2.0, 0.0, 0.0, 2.0, 0, 0);
    ctx.transform(1.0, 0.0, 0.0, 1.0, -128, -128);

    this.drawDial(ms);
    this.drawHands(ms);

    ctx.restore();
  }

  steppersStartMaybe(ms) {
    if (this.T < 0) {
      this.T =
        new Date() -
        new Date(new Date().toISOString().split("T").shift()).getTime() -
        new Date().getTimezoneOffset() * 60000;
    }

    let T = this.T;
    // console.log({T})

    if (!this.stepperHours.isActive) {
      this.stepperHours.start();
      this.stepperHours.rotr.phase = ((T / 3600000) % 12) / 12;
    }

    T %= 3600000;
    if (!this.stepperMinutes.isActive) {
      this.stepperMinutes.start();
      this.stepperMinutes.rotr.phase = ((T / 60000) % 60) / 60;
    }

    T %= 60000;
    if (!this.stepperSeconds.isActive) {
      this.stepperSeconds.start();
      this.stepperSeconds.rotr.phase = ((T / 1000) % 60) / 60;

      console.log({
        rotrs: {
          hours: this.stepperHours.rotr,
          minutes: this.stepperMinutes.rotr,
          seconds: this.stepperSeconds.rotr,
        },
      });
    }
  }

  drawHands(ms) {
    let cost, sint;

    this.steppersStartMaybe(ms);

    const { radians: secondsRadians } = this.stepperSeconds.step(ms);
    const { radians: minutesRadians } = this.stepperMinutes.step(ms);
    const { radians: hoursRadians } = this.stepperHours.step(ms);

    const canvas = this.el;
    const ctx = canvas.getContext("2d");
    const { width: W, height: H } = canvas;

    // #layer2

    // #hour-hand
    cost = Math.cos(hoursRadians);
    sint = Math.sin(hoursRadians);

    ctx.save();
    ctx.transform(1.0, 0.0, 0.0, 1.0, 128, 128);
    ctx.transform(cost, sint, -sint, cost, 0, 0);
    ctx.transform(1.0, 0.0, 0.0, 1.0, -128, -128);

    ctx.beginPath();
    ctx.fillStyle = "rgb(128, 0, 0)";
    ctx.lineWidth = 0.279296;
    ctx.moveTo(129.41299, 60.188843);
    ctx.lineTo(134.02704, 66.47266);
    ctx.lineTo(138.14151, 127.38351);
    ctx.bezierCurveTo(138.52054, 132.99481, 133.61379, 137.53532, 127.98972, 137.53532);
    ctx.bezierCurveTo(122.36561, 137.53532, 117.8379, 133.00761, 117.8379, 127.38351);
    ctx.lineTo(122.19092, 66.47266);
    ctx.lineTo(126.66667, 60.195839);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // #minute-hand
    cost = Math.cos(minutesRadians);
    sint = Math.sin(minutesRadians);
    ctx.save();
    ctx.transform(1.0, 0.0, 0.0, 1.0, 128, 128);
    ctx.transform(cost, sint, -sint, cost, 0, 0);
    ctx.transform(1.0, 0.0, 0.0, 1.0, -128, -128);

    ctx.beginPath();
    ctx.fillStyle = "rgb(0, 128, 0)";
    ctx.lineWidth = 0.282287;
    ctx.moveTo(129.86271, 40.032634);
    ctx.lineTo(132.86802, 45.78208);
    ctx.lineTo(136.19129, 124.69594);
    ctx.bezierCurveTo(136.49017, 131.79309, 132.53425, 135.12895, 127.99169, 135.12895);
    ctx.bezierCurveTo(123.44911, 135.12895, 119.79208, 131.80895, 119.79208, 124.69594);
    ctx.lineTo(123.30801, 45.78208);
    ctx.lineTo(126.12501, 40.035298);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // #seconds-hand
    cost = Math.cos(secondsRadians);
    sint = Math.sin(secondsRadians);
    ctx.save();
    ctx.transform(1.0, 0.0, 0.0, 1.0, 128, 128);
    ctx.transform(cost, sint, -sint, cost, 0, 0);
    ctx.transform(1.0, 0.0, 0.0, 1.0, -128, -128);

    ctx.beginPath();
    ctx.strokeStyle = "rgb(255, 204, 0)";
    ctx.lineWidth = 4.18944;
    ctx.moveTo(128.0, 138.5359);
    ctx.lineTo(128.0, 31.926484);
    ctx.stroke();

    // #seconds-pivot
    ctx.beginPath();
    ctx.fillStyle = "rgb(255, 204, 0)";
    ctx.lineWidth = 2.14009;
    ctx.arc(128.0, 128.00002, 5.571456, 0.0, 6.28318531, 1);
    ctx.fill();
  }

  drawDial(ms) {
    const canvas = this.el;
    const ctx = canvas.getContext("2d");

    // #layer1
    ctx.save();
    ctx.transform(1.0, 0.0, 0.0, 1.0, -46.1833, -39.3852);

    // #path1
    ctx.beginPath();
    ctx.fillStyle = "rgb(128, 128, 0)";
    ctx.lineWidth = 0.279296;
    ctx.arc(174.18335, 167.38521, 122.39413, 0.0, 6.28318531, 1);
    ctx.fill();

    // #path9
    ctx.beginPath();
    ctx.strokeStyle = "rgb(221, 255, 85)";
    ctx.lineWidth = 5.58592;
    ctx.moveTo(280.42162, 167.38519);
    ctx.lineTo(294.28451, 167.38519);
    ctx.stroke();

    // #path10
    ctx.beginPath();
    ctx.strokeStyle = "rgb(221, 255, 85)";
    ctx.lineWidth = 5.58592;
    ctx.moveTo(67.945071, 167.38519);
    ctx.lineTo(54.082183, 167.38519);
    ctx.stroke();

    // #path12
    ctx.beginPath();
    ctx.strokeStyle = "rgb(221, 255, 85)";
    ctx.lineWidth = 5.58637;
    ctx.moveTo(174.18335, 61.146928);
    ctx.lineTo(174.18335, 47.284039);
    ctx.stroke();

    // #path13
    ctx.beginPath();
    ctx.strokeStyle = "rgb(221, 255, 85)";
    ctx.lineWidth = 5.58592;
    ctx.moveTo(174.18335, 273.62347);
    ctx.lineTo(174.18335, 287.48636);
    ctx.stroke();

    // #path14
    ctx.beginPath();
    ctx.strokeStyle = "rgb(221, 255, 85)";
    ctx.lineWidth = 2.79296;
    ctx.moveTo(227.30248, 75.38016);
    ctx.lineTo(234.23392, 63.374546);
    ctx.stroke();

    // #path15
    ctx.beginPath();
    ctx.strokeStyle = "rgb(221, 255, 85)";
    ctx.lineWidth = 2.79296;
    ctx.moveTo(121.0642, 259.39025);
    ctx.lineTo(114.13276, 271.39586);
    ctx.stroke();

    // #path16
    ctx.beginPath();
    ctx.strokeStyle = "rgb(221, 255, 85)";
    ctx.lineWidth = 2.79296;
    ctx.moveTo(266.18838, 114.26606);
    ctx.lineTo(278.194, 107.33461);
    ctx.stroke();

    // #path17
    ctx.beginPath();
    ctx.strokeStyle = "rgb(221, 255, 85)";
    ctx.lineWidth = 2.79296;
    ctx.moveTo(82.178301, 220.50433);
    ctx.lineTo(70.172686, 227.43578);
    ctx.stroke();

    // #path18
    ctx.beginPath();
    ctx.strokeStyle = "rgb(221, 255, 85)";
    ctx.lineWidth = 2.79296;
    ctx.moveTo(121.0642, 75.38016);
    ctx.lineTo(114.13276, 63.374546);
    ctx.stroke();

    // #path19
    ctx.beginPath();
    ctx.strokeStyle = "rgb(221, 255, 85)";
    ctx.lineWidth = 2.79296;
    ctx.moveTo(227.30248, 259.39025);
    ctx.lineTo(234.23392, 271.39586);
    ctx.stroke();

    // #path20
    ctx.beginPath();
    ctx.strokeStyle = "rgb(221, 255, 85)";
    ctx.lineWidth = 2.79296;
    ctx.moveTo(82.178314, 114.26606);
    ctx.lineTo(70.172701, 107.33461);
    ctx.stroke();

    // #path21
    ctx.beginPath();
    ctx.strokeStyle = "rgb(221, 255, 85)";
    ctx.lineWidth = 2.79296;
    ctx.moveTo(266.18839, 220.50433);
    ctx.lineTo(278.19401, 227.43578);
    ctx.stroke();
    ctx.restore();
  }
}
