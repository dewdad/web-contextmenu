'use strict';

class MenuItem {
  _proxy: {
    index: number;
    name: string;
    onclick?: Function;
    children: Array<MenuItem>;
    icon: string;
    hotkey: string;
    enabled: boolean;
  };

  constructor(name: string, callback?: Function, children?: Array<MenuItem>) {
    this._proxy = {
      index: 0,
      name: name,
      onclick: callback,
      children: children ? children : [],
      icon: '',
      hotkey: '',
      enabled: true
    };
  }

  get index(): number {
    return this._proxy.index;
  }

  set index(val: number) {
    this._proxy.index = val;
  }

  get name(): string {
    return this._proxy.name;
  }

  set name(val: string) {
    this._proxy.name = val;
  }

  get enabled(): boolean {
    return this._proxy.enabled;
  }

  set enabled(val: boolean) {
    this._proxy.enabled = val;
  }

  get icon(): string {
    return this._proxy.icon;
  }

  set icon(val: string) {
    this._proxy.icon = val;
  }

  get hotkey(): string {
    return this._proxy.hotkey;
  }

  set hotkey(val: string) {
    this._proxy.hotkey = val;
  }

  get onclick() {
    return this._proxy.onclick;
  }

  set onclick(val) {
    this._proxy.onclick = val;
  }

  get children() {
    return this._proxy.children;
  }

  set children(val) {
    this._proxy.children = val || [];
  }
}

export default MenuItem;
