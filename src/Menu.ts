"use strict";

import ContextMenuManager from "./ContextMenuManager";
import MenuItem from "./MenuItem";
import MenuRect from "./MenuRect";
import MenuLocator from "./MenuLocator";

class Menu {
  _proxy: {
    parent: Menu | undefined;
    manager: ContextMenuManager;
    id: string;
    list: Array<MenuItem>;
    location: MenuRect;
    hoverIndex: number;
    hoverMenu: Menu | undefined;
  };
  isHidden: boolean;
  timers: Array<string>;
  onOutTrigger?: Function;

  constructor(
    option: Menu | ContextMenuManager,
    id: string,
    location: MenuRect,
    list: Array<MenuItem>
  ) {
    const parent: Menu | undefined =
      option instanceof Menu ? option : undefined;
    const manager: ContextMenuManager =
      option instanceof Menu ? option._proxy.manager : option;
    this._proxy = {
      parent: parent,
      manager: manager,
      id: id,
      list: list,
      location: location,
      hoverIndex: -1,
      hoverMenu: undefined
    };
    this.isHidden = false;
    this.timers = [];
  }

  fixed(size: any): Menu {
    this.location = this.fixedLocation(size);
    return this;
  }

  indexInParent() {
    const index = this.id.charAt(this.id.length - 1);
    return parseInt(index);
  }

  get id(): string {
    return this._proxy.id;
  }

  set id(val: string) {
    this._proxy.id = val !== undefined && val.length > 0 ? val : "0";
  }

  get list(): Array<MenuItem> {
    return this._proxy.list;
  }

  set list(val: Array<MenuItem>) {
    this._proxy.list = val;
  }

  get location(): MenuRect {
    return this._proxy.location;
  }

  set location(val: MenuRect) {
    this._proxy.location = val;
  }

  children(index: number) {
    if (index < 0 || index >= this.list.length) {
      return;
    }

    const id = "" + (this.id !== undefined ? this.id : "") + index;
    const item = this.list[index];
    const location = this.location;
    const children = item.children;

    if (children && children.length > 0) {
      return new Menu(this, id, location, children);
    }
  }

  isRoot() {
    return this._proxy.parent === undefined;
  }

  set hover(index: number) {
    if (this.isHidden) {
      return;
    }
    this._proxy.hoverIndex = index;
    setTimeout(() => {
      this.hoverDelay();
    }, 25);
  }

  hoverDelay() {
    const index = this._proxy.hoverIndex;
    const next = this.children(index);

    if (index === -1) {
      // 移动到菜单外
      this.checkState();
    } else {
      // 菜单内移动
      this.select(next);
      if (this.onOutTrigger) {
        this.onOutTrigger();
      }
    }
  }

  checkState() {
    try {
      // 是否进入子菜单
      const childIndex = this.childHover();
      if (childIndex !== -1) {
        return;
      }

      // 是否进入父菜单
      const parentIndex = this.parentHover();

      if (parentIndex !== -1) {
        // 是否保留当前
        const inParent = this.indexInParent();
        if (inParent === parentIndex) {
          return;
        }
      }

      // 根菜单不自动离开
      if (this.isRoot()) {
        this.select();
        return;
      }
      // 离开当前菜单
      this.hide();
      if (this._proxy.parent) {
        this._proxy.parent.checkState();
      }
    } finally {
      if (this.onOutTrigger) {
        this.onOutTrigger();
      }
    }
  }

  /**
   * 当前选项被选中或当前菜单子菜单被选中都是为被选中
   * @returns {number}
   */
  get hover() {
    const hoverIndex = this._proxy.hoverIndex;

    const child = this._proxy.hoverMenu;

    return child !== undefined && child.hover !== -1
      ? child.indexInParent()
      : hoverIndex;
  }

  childHover() {
    const child = this._proxy.hoverMenu;
    return child !== undefined ? child.hover : -1;
  }

  parentHover() {
    const parent = this._proxy.parent;
    return parent !== undefined ? parent.hover : -1;
  }

  show() {
    this._proxy.manager.show(this);
  }

  hide() {
    this.select();
    this._proxy.manager.hide(this);
    this.isHidden = true;
  }

  select(next?: Menu): void {
    const last: Menu | undefined = this._proxy.hoverMenu;

    if (last !== undefined) {
      if (next !== undefined && next.id === last.id) {
        last.select();
        return;
      } else {
        last.hide();
      }
    }

    if (next !== undefined) {
      setTimeout(() => {
        // 显示新选中子菜单
        next.show();
      }, 5);
    }

    this._proxy.hoverMenu = next;
  }

  private getDividerCount() {
    let c = 0;
    const parent = this._proxy.parent;
    const index = this.indexInParent();
    const list = parent ? parent.list : [];
    if (index === -1 || list.length === 0) {
      return 0;
    }
    for (let i in list) {
      if (parseInt(i) >= index) {
        break;
      }
      const item = list[i];
      if (!item.name || item.name.length === 0) {
        c += 1;
      }
    }
    return c;
  }

  private getDividerHeight() {
    const div = document.createElement("div");
    div.className = "__context__menu__item_divider";
    div.style.visibility = "hidden";
    document.body.appendChild(div);
    const style = window.getComputedStyle(div);
    const h = parseInt(style.height || "0");
    const p =
      parseInt(style.paddingTop || "0") + parseInt(style.paddingBottom || "0");
    const m =
      parseInt(style.marginTop || "0") + parseInt(style.marginBottom || "0");
    document.body.removeChild(div);
    return h + p + m;
  }

  private fixedLocation(size: any): MenuRect {
    const pad=4;
    let index = this._proxy.parent !== undefined ? this.indexInParent() : -1;

    const list = this.list;
    const anchor: MenuRect = this.location;
    const parent: any = this._proxy.parent;

    const sr = MenuLocator.getFixedScreenRect(pad);

    const sL = sr.l;
    const sT = sr.t;
    const sR = sr.r;
    const sB = sr.b;

    // 菜单高宽
    const mC = list.length;
    const mW = size.width;
    const mH = size.height;
    const mHi = mH / mC;

    // 分割线
    const dC = this.getDividerCount();
    const dH = this.getDividerHeight() * dC;

    if (index !== -1) {
      index -= dC;
    }

    const preXL = anchor.l - mW;
    const preXR = anchor.l + (index != -1 ? parent.location.w : 0);

    const preYU = anchor.t + (index != -1 ? index * mHi + mHi : 0) - mH;
    const preYD = anchor.t + (index != -1 ? index * mHi : 0);

    let dx, dy, px, py;

    dx = anchor && anchor.dx === -1 ? -1 : 1;
    dy = anchor && anchor.dy === -1 ? -1 : 1;

    dx = dx === -1 ? (preXL >= sL ? -1 : 1) : preXR + mW >= sR ? -1 : 1;
    dy = dy === -1 ? (preYU >= sT ? -1 : 1) : preYD + mH >= sB ? -1 : 1;

    px = dx === -1 ? preXL : preXR;
    py = dy === -1 ? preYU : preYD;

    let pw = mW;
    let ph = mH;

    if (ph > sr.h) {
      ph = sr.h;
      py = sr.t;
    }

    if (index !== -1 && dy === -1) {
      py = Math.min(sr.b - mH, preYD);
    }

    if(py<sr.t-pad){
      py = sr.b - mH;
    }

    py += dy * dH;

    const location = MenuLocator.getRect(px, py, pw, ph);
    location.dx = dx;
    location.dy = dy;
    if (index === -1) {
      location.l += dx * 2;
      location.r += dx * 2;
      location.t += dy * 2;
      location.b += dy * 2;
    }

    return location;
  }
}

export default Menu;
