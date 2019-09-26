'use strict';

import Menu from './Menu';

const MenuBoxClassName = 'no-select __context__menu__box';
const MenuItemClassName = '__context__menu__item';
const MenuItemHoverClassName = '__context__menu__item-hover';

class ContextMenuBox {
  private readonly manager: any;

  constructor(manager: any) {
    this.manager = manager;
  }

  add(menu: Menu) {
    this.addBox(menu);
  }

  remove(menu?: Menu) {
    const refs = document.getElementsByClassName(MenuBoxClassName);
    for (let i = 0; i < refs.length; i++) {
      const element = refs[i];
      setTimeout(() => {
        try {
          if (menu) {
            if (menu.id === element.id) {
              document.body.removeChild(element);
              return;
            }
          } else {
            document.body.removeChild(element);
          }
        } catch (e) {
          e.toString();
        }
      });
    }
  }

  private addBox(menu: Menu) {
    const box: any = document.createElement('div');
    box.setAttribute('id', menu.id);
    box.className = MenuBoxClassName;
    box.style.position = 'fixed';
    box.style.width = 'auto';
    box.style.height = 'auto';
    box.style.zIndex = 9999999999;
    box.style.visibility = 'hidden';
    box.style.top = 0 + 'px';
    box.style.left = 0 + 'px';

    box.onmouseleave = () => {
      menu.hover = -1;
    };
    box.oncontextmenu = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      e.cancelBubble = true;
      e.returnValue = false;
    };
    box.onmousewheel = (e: any) => {
      let delta = e.wheelDelta || e.detail || 0;
      box.scrollTop -= delta;

      e.preventDefault();
      e.stopPropagation();
      e.cancelBubble = true;
      e.returnValue = false;
    };

    this.addItems(menu, box);

    document.body.appendChild(box);

    setTimeout(() => {
      menu.fixed({
        width: box.offsetWidth + 16,
        height: box.offsetHeight
      });

      const location = menu.location;

      box.style.width = location.w + 'px';
      box.style.height = location.h + 'px';
      box.style.top = location.t + 'px';
      box.style.left = location.l + 'px';
      box.style.visibility = 'visible';
    }, 50);
  }

  private addItems(menu: Menu, box: Element) {
    const list = menu.list;
    let hasArrow = false;
    let hotKeyMax = '';
    for (const i in list) {
      const item = list[i];
      if (!hasArrow) {
        hasArrow = item.children.length > 0;
      }
      if (item.hotkey) {
        if (item.hotkey.length > hotKeyMax.length) {
          hotKeyMax = item.hotkey;
        }
      }
    }
    for (const i in list) {
      const item = list[i];

      const div: any = document.createElement('div');

      const icon = item.icon || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

      const showHotKey = item.hotkey && item.hotkey.length > 0;
      const showHotKeyHint = !showHotKey && hotKeyMax.length > 0;
      const showArrow = item.children.length > 0;

      div.setAttribute('enabled', item.enabled);
      div.className = ` ${MenuItemClassName} ${item.enabled ? '' : 'grayscale'}`;
      if (!item.name || item.name.length === 0) {
        div.innerHTML = `
                <div class="__context__menu__item_divider"></div>
                `;
      } else {
        const name = this.manager.i18n ? this.manager.i18n(item.name) || item.name : item.name;
        div.innerHTML = `

                <img class="__context__menu__item_icon" src="${icon}" />
            
                <div class="__context__menu__item_text">${name}</div>
            
                <div class="__context__menu__item_hotkey"
                    style="display:${showHotKey ? 'block' : 'none'}">
                    ${item.hotkey}
                </div>
                <div class="__context__menu__item_hotkey"
                    style="display:${showHotKeyHint ? 'block' : 'none'};
                            visibility: ${showHotKeyHint ? 'visible' : 'hidden'};
                            opacity: 0; filter:alpha(opacity=0);">
                    ${hotKeyMax}
                </div>
                
                <div class="__context__menu__item_arrow"
                    style="display:${showArrow ? 'block' : 'none'}"
                </div>
                
                <div class="__context__menu__item_arrow" 
                 style="display:${!showArrow && !showHotKey ? 'block' : 'none'}"/>
            `;

        div.onmouseover = ((i, e) => {
          return () => {
            menu.hover = e ? i : -1;
          };
        })(parseInt(i), item.enabled);

        if (item.enabled && item.onclick) {
          div.onclick = () => {
            this.manager.hide();
            setTimeout(() => {
              if (item.onclick) {
                item.onclick(item);
              }
            }, 50);
          };
        }
      }
      box.appendChild(div);
    }

    menu.onOutTrigger = () => {
      for (let i = 0; i < box.children.length; i++) {
        const child = box.children[i];
        const enabled = child.getAttribute('enabled');
        if (menu.hover === i) {
          child.className = MenuItemClassName + ' ' + MenuItemHoverClassName;
        } else {
          child.className = ` ${MenuItemClassName} ${enabled !== 'false' ? '' : 'grayscale'}`;
        }
      }
    };
  }
}

export default ContextMenuBox;
