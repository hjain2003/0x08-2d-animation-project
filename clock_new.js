class Clock {
  sel;
  domel;
  ctx;
  ts = null;

  constructor(sel) {
    this.sel = sel;
    this.domel = document.querySelector(this.sel);
    this.ctx = this.domel.getContext("2d");
  }

  draw(ts) {
    const ctx = this.ctx;
    if (this.ts == null) this.ts = ts;

    ts -= this.ts;
    ctx.reset();

    //Transform...will be applied to every drawing from here on
    ctx.transform(1, 0, 0, 1, 150, 150);

    this.drawDial();
    this.drawSecondsHand(ts);
  }

  drawDial(ts) {
    const ctx = this.ctx;
    ctx.save();
    //Dial Circle
    ctx.beginPath();
    ctx.arc(0, 0, 100, 0, 2 * Math.PI); //arc centred at 0,0 ; radius is 100 ; start angle=0 ; end angle = 90deg
    ctx.stroke();
    ctx.restore();
  }

  drawSecondsHand(ts) {
    let angle, ct, st;
    const ctx = this.ctx;
    ctx.save();

    //define inintal rotation
    angle = -Math.PI * 0.5;
    ct = Math.cos(angle);
    st = Math.sin(angle);
    ctx.transform(ct, st, -st, ct, 0, 0);

    //rotatew again based on ts
    angle = (ts / 1000) * ((2 * Math.PI) / 60);
    ct = Math.cos(angle);
    st = Math.sin(angle);
    ctx.transform(ct, st, -st, ct, 0, 0);

    //seconds hand
    const SecondshandSemiWidth = 5;
    ctx.lineWidth = 2 * SecondshandSemiWidth;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(85, 0);
    ctx.stroke();

    //pivot circle
    ctx.beginPath();
    ctx.arc(0, 0, SecondshandSemiWidth, 0, 2 * Math.PI);
    ctx.fill();

    ctx.restore();
  }
}
