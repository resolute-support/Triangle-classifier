class Circle {
  constructor(x, y, rad, sang, eang, colour) {
    this.x = x;
    this.y = y;
    this.rad = rad;
    this.sang = sang;
    this.eang = eang;
    this.colour = colour;
    this.flag1 = false;
    this.flag2 = false;
  }

  draw(x, y, rad, sang, eang, fill) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, 2 * Math.PI, false); // Outer circle
    // ctx.lineWidth = 5;
    ctx.fillStyle = fill;
    // ctx.restore();
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
  }

  drawLineTo(circle) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(circle.x, circle.y);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#bababa";
    ctx.stroke();
    ctx.closePath();
  }
}