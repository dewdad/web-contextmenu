'use strict';

import MenuItem from './MenuItem';

class MenuBuilderCache {
  name: string;
  click?: Function;
  builder?: MenuBuilder;
  icon?: any;
  hotkey?: string;
  enable: boolean = true;

  constructor(name: string, click?: Function, option?: string | MenuBuilder, icon?: any) {
    this.name = name;
    this.click = click;
    if (option instanceof MenuBuilder) {
      this.builder = option;
    } else if (option) {
      this.hotkey = option;
    }
    this.icon = icon;
  }
}

class MenuBuilder {
  list: Array<MenuBuilderCache>;

  constructor() {
    this.list = [];
  }

  cur() {
    const len = this.list.length;
    return len > 0 ? this.list[len - 1] : undefined;
  }

  /**
   *
   * @param name 选项名称
   * @param click 点击事件
   * @param option 热键 | 回调子菜单的构造器 MenuBuilder
   */
  item(name: string, click: Function, option?: string | Function, icon?: any) {
    const cache = new MenuBuilderCache(name, click, new MenuBuilder(), icon);

    if (option instanceof Function) {
      option(cache.builder);
    } else if (option) {
      cache.hotkey = option;
    }

    this.list.push(cache);

    return this;
  }

  hotkey(hotkey: string) {
    const cur = this.cur();
    if (!cur || cur.name) {
      return;
    }
    cur.hotkey = hotkey;
    return this;
  }

  icon(icon: any) {
    const cur = this.cur();
    if (!cur) {
      return;
    }
    cur.icon = icon;
    return this;
  }

  enable(enable: boolean) {
    const cur = this.cur();
    if (!cur) {
      return;
    }
    cur.enable = enable;
    return this;
  }

  divider() {
    this.list.push(new MenuBuilderCache(''));
  }

  build() {
    const list = [];
    for (const index in this.list) {
      const item = this.list[index];
      const menuItem = new MenuItem(item.name, item.click);
      menuItem.index = parseInt(index);
      menuItem.icon = item.icon;
      menuItem.hotkey = item.hotkey || '';
      menuItem.enabled = item.enable;
      menuItem.children = item.builder ? item.builder.build() : [];
      list.push(menuItem);
    }
    return list;
  }
}

export default MenuBuilder;
