"use strict";

import MenuRect from "./MenuRect";

class MenuLocator {
  static screenScrollTop() {
    let scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
      scrollTop = document.body.scrollTop;
    }
    return scrollTop;
  }

  static screenScrollLeft() {
    let scrollLeft = 0;
    if (document.documentElement && document.documentElement.scrollLeft) {
      scrollLeft = document.documentElement.scrollLeft;
    } else if (document.body) {
      scrollLeft = document.body.scrollLeft;
    }
    return scrollLeft;
  }

  static getFixedPosition(event: any, fixed = true): MenuRect {
    const e = event || window.event;

    let scrollX = this.screenScrollLeft();
    let scrollY = this.screenScrollTop();

    let x = e.pageX || e.clientX + scrollX;
    let y = e.pageY || e.clientY + scrollY;

    return this.getRect(
      !fixed ? x : x - scrollX,
      !fixed ? y : y - scrollY,
      0,
      0
    );
  }

  static getRect(l: number, t: number, w: number, h: number): MenuRect {
    return new MenuRect(l, t, w, h);
  }

  static getFixedScreenRect = (padding = 0) => {
    let winWidth=0;
    let winHeight=0;
    // 获取窗口宽度
    if (window.innerWidth) {
        winWidth = window.innerWidth;
    }else if ((document.body) && (document.body.clientWidth)) {
        winWidth = document.body.clientWidth;
    }
    // 获取窗口高度
    if (window.innerHeight) {
        winHeight = window.innerHeight;
    }else if ((document.body) && (document.body.clientHeight)) {
        winHeight = document.body.clientHeight;
    }
    // 通过深入 Document 内部对 body 进行检测，获取窗口大小
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth){
      winHeight = document.documentElement.clientHeight;
      winWidth = document.documentElement.clientWidth;
    }

    return MenuLocator.getRect(
      padding,
      padding,
        winWidth - padding * 2,
        winHeight - padding * 2
    );
  };
}

export default MenuLocator;
