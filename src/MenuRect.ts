'use strict';

class MenuRect {
  l: number;
  t: number;
  r: number;
  b: number;
  w: number;
  h: number;
  dx: number;
  dy: number;

  constructor(l: number, t: number, w: number, h: number) {
    this.l = l;
    this.t = t;
    this.r = l + w;
    this.b = t + h;
    this.w = w;
    this.h = h;
    this.dx = 1;
    this.dy = 1;
  }
}

export default MenuRect;
