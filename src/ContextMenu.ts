'use strict';

import 'babel-polyfill';

import './ContextMenu.css';
import './ContextMenu-Scroll-Show.css';

import ContextMenuManager from './ContextMenuManager';
import MenuBuilder from './MenuBuilder';
import MenuItem from './MenuItem';
import MenuLocator from './MenuLocator';
import Menu from './Menu';

const manager = new ContextMenuManager();

const state = {
  installed: false,
  domScrollTop: 0
};

function isString(str: any) {
  return str && typeof str == 'string' && str.constructor == String;
}

const ContextMenu: any = {
  get i18n(): (key: string) => string {
    return manager.i18n;
  },
  set i18n(val: (key: string) => string) {
    manager.i18n = val;
  },
  install: function(Vue?: any, hideEvents?: Array<string>) {
    if (state.installed) {
      return;
    }
    state.installed = true;

    if (Vue) {
      Vue.prototype.$menu = this;
    }

    if (!hideEvents) {
      hideEvents = ['keyup:27', 'contextmenu', 'click', 'resize', 'mousewheel'];
    }

    for (let i = 0; i < hideEvents.length; i++) {
      const event = hideEvents[i];

      if (event.toLowerCase().indexOf('wheel') !== -1 || event.toLowerCase().indexOf('scroll') !== -1) {
        setInterval(() => {
          const top = document.documentElement.scrollTop || document.body.scrollTop;
          if (state.domScrollTop !== top) {
            this.hide();
            state.domScrollTop = top;
          }
        }, 150);
      } else {
        const splits = event.split(':');
        const opt = splits.length > 1 ? splits[1] : undefined;
        window.addEventListener(
          splits[0],
          e => {
            this.hide(e, opt);
          },
          true
        );
      }
    }
  },

  builder() {
    return new MenuBuilder();
  },

  show(...args: any[]) {
    let event: undefined | Event;
    let menuList: undefined | Array<MenuItem>;
    for (const i in args) {
      const arg = args[i];
      if (arg instanceof Event) {
        event = arg;
      } else if (arg instanceof Array) {
        menuList = arg;
      }
    }
    const e: any = event || window.event;
    if (!e || e.button !== 2) {
      return;
    }
    e.preventDefault(); // 阻止默认
    e.stopPropagation(); // 停止冒泡
    e.cancelBubble = true;
    e.returnValue = false;

    this.hide();

    const location = MenuLocator.getFixedPosition(e, true);

    setTimeout(() => {
      if (!menuList || menuList.length === 0) {
        return;
      }
      manager.show(new Menu(manager, '0', location, menuList));
    }, 10);
  },
  hide(e?: any, opt?: any) {
    if (e instanceof Event) {
      const event: any = e || window.event;
      const key = event.which || event.keyCode;
      if (key === parseInt(opt)) {
        event.preventDefault(); // 阻止默认
        event.stopPropagation(); // 停止冒泡
        event.cancelBubble = true;
        event.returnValue = false;
      }
      const target: any = e.target;
      if (target && isString(target.className) && target.className.indexOf('__context__menu') !== -1) {
        return;
      }
    }
    manager.hide();
  }
};

Object.defineProperty(window, 'ContextMenu', {
  value: ContextMenu,
  writable: false,
  configurable: false
});

export default ContextMenu;
