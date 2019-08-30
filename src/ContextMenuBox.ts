'use strict';

import Menu from './Menu';

import html2canvas from 'html2canvas';

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
    };
    this.addItems(menu, box);

    document.body.appendChild(box);

    setTimeout(() => {
      html2canvas(box, {
        ignoreElements: (el: any) => {
          try {
            if (el.className.indexOf('__context__menu') !== -1) {
              return false;
            }
            const tag = el.tagName.toLowerCase();
            if (tag === 'link') {
              if (el.href && el.href.toString().indexOf('contextmenu') !== -1) {
                return false;
              }
            }
            if (tag === 'script') {
              if (el.href && el.href.toString().indexOf('contextmenu') !== -1) {
                return false;
              }
            }
            if (tag === 'style' && (<Element>el).innerHTML.indexOf('__context__menu')! !== -1) {
              return false;
            }
            const array = ['body', 'head', 'meta'];
            for (let i = 0; i < array.length; i++) {
              if (array[i] === tag) {
                return false;
              }
            }
          } catch (e) {
            e.toString();
          }
          return true;
        }
      })
        .then((canvas: any) => {
          menu.fixed({
            width: canvas.width / 2 + 24,
            height: canvas.height / 2
          });
          const location = menu.location;

          box.style.width = location.w + 'px';
          box.style.height = location.h + 'px';
          box.style.top = location.t + 'px';
          box.style.left = location.l + 'px';
          box.style.visibility = 'visible';
        })
        .catch(err => {
          err.toString();
        });
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
      const arrow =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAJbElEQVR4Xu2dS8itYxSAH5kZigGFCVKUkYEiMVaKpCTJLZfDwXGJkpJcB+46xz0iJBliQjESSUckJAMzTNxN6D3/3jnn9O/z7/3u9d3e9ezp/71r7/Ws9fzv+r6997cPwocEJLCQwEGykYAEFhNQELtDAgcgoCC2hwQUxB6QQB0Bd5A6bq5KQkBBkhTaNOsIKEgdN1clIaAgSQptmnUEFKSOm6uSEFCQJIU2zToCClLHzVVJCChIkkKbZh0BBanj5qokBBQkSaFNs46AgtRxc1USAgqSpNCmWUdAQeq4uSoJAQVJUmjTrCOgIHXcXJWEgIIkKbRp1hFQkDpurkpCQEGSFNo06wgoSB03VyUhoCBJCm2adQQUpI6bq5IQUJAkhTbNOgIKUsfNVUkIKEiSQptmHQEFqePmqiQEFCRJoU2zjoCC1HFzVRICCpKk0KZZR0BB6ri5KgkBBUlSaNOsI6AgddxclYSAgiQptGnWEVCQOm6uSkJAQZIU2jTrCChIHTdXJSGgIJsX+mTgXOA04DjgKOA74AvgXeAN4OckPZI6TQXZt/yHAg8Bl27RFX8BTwB3AX+k7qDGk1eQ/wt8PPAecMwKNf8eOB/4dIU1HjohAgqyUawjgM+Bwytq9w9wM/B4xVqXjJyAgmwU6GPglDVr9RZwCfDrmnFcPiICCgLXA48G1aSMXOcBnwXFM8zABBQEfgSODKxDGbl2zE7iA8MaaggC2QU5cXbptgv2b86uhjlydUG3p5jZBbkQeKVD1o5cHcLtI3R2QSLPPxbV6+/ZyPVkHwX1OWIJZBfkNuD+WKQLozly9QQ68mkUpD9BSt0cuSK7t4dYCtKvIKWkZeS6CXiqh/r6FGsSUJD+BZmXzJFrzebtY7mCDCfIfOQ6B9jdR7F9jtUJKMiwgsxHrhuAnauXzxVdE1CQ4QVx5Oq6y9eIryDjEcSRa41G7mqpgoxLkFLn8mWsMnLt6qroxl2egIKMT5C9R67y8fnfly+nR0YTUJDxClJq/c3s4/Ne5Yru/CXjKci4BZmPXNuBp5esqYcFElCQ8QviyBXY8KuGUpDpCOLItWp3BxyvINMSZD5ylY/pPxNQf0NsQUBBpifIvKSvAld6latbxxVkuoI4cnXrxp7oCjJtQUoN/2TjzizP9tAv6Z5CQaYviCNXh9oqSDuCzEeu8vH5rzrsmVShFaQtQeYj13XAc6k6uaNkFaQ9QRy5AmVRkHYFceQKEEVB2hZkPnJtA54P6Jd0IRSkfUEcudbQWkHyCOLIVSGKguQSpLRI+cm4MnK9UNEv6ZYoSD5B9h65Lp+9E5+u8ZdNWEHyClJ6pLyhWH7wxzcWFxijILkFmY9c1wIvLvtfNdNxCqIgjlwHMF5BFGTv9nDk2k8WBVGQ/f9/lo/Pl5P38oWs9A8FUZBFEpRzkmuyX+VSEAU50C6RfuRSEAXZaoxKPXIpiIJsJcj87+Wd93I5uAiT5qEgCrJKs5eRq3xjsdwSNcVDQRRk1UYvN9MutxtKcZVLQRRkVUHmx5fvl5QPPTY9cimIgtQKMv8sV9MjV3ZBbgEeXKdDXLvn90suA15vkUV2QW7DHSSqr+8B7owKNpY4CqIgkb1Ybjf0RGTAoWNlF8QRK7YDfwNOAH6MDTtctOyCOGLF994jwI3xYYeJmF2QW4EHhkHf7LOWy76Hzn6td/JJZhfEHaSbFj4LeL+b0P1GzS6I5yDd9NtNwMPdhO43anZB3EG66be7gLu7Cd1v1OyCuIN00293APd1E7rfqNkFcQfppt/KrYTe6iZ0v1EVxDcKozvuX+Aw4JfowEPEUxAFie67D4Azo4MOFU9BFCS6904HPooOOlS87IL4RmFs5z0GbI8NOWw0BfGd9KgOfAO4ICrYWOIoiIJE9OJO4OqIQGOLkV0QL/Ou15HNfz9dQTxJr1UkxR1OFERBagRJccOGAkZBFGQVQZofqfaHoSAKsqwgKUYqBdmXgCfpy+mRZqRSEAVZTomNo1LfuNpzEHAHWaxL+p8+UBAFWaRHyju5bwbDk3RP0vfui/QjlecgnoMs2jUcqTYh4w7iDlLawpFqwb8NBcktiCPVFtf0FCSvII5US1zwVpCcgvgTz0vI4WXefJd5HamWFGN+mDtInh3EkWpFOdxB8uwg5Qc3L2/99wQr+n/LJe4gbe8gf8x+27ycc/ioIKAg7QriSFUhhO+k53gn3ZEqQA7PQdo7B3GkChLDq1gbBFr6uLsjVbAc7iDtCOJI1YEcCjJ9QcpItW32YcOOWiR3WK9iTfcqliNVD+4qyDQFcaTqQQ5HrOmNWOWzVGWkKncZ8dEDAXeQ6ewg3wDnAGW08tETAQWZhiBlpLoSKHc29NEjAQUZtyCOVD3KsNlTKch4BXGkGlgOT9LHe5LuSDUCORRkfIKUkeo64LmR9Ef6l+GINZ4Ry5FqhDoqyDgEcaQaoRyOWMOPWI5UIxVj/rLcQYbbQcpIdR6we+Q9kvrlKcgwgjhSTUQ7BelXkDJSXQ88O5H+SP8yFaQ/QRypJqhbdkG2A4/0ULfXgCuA33p4Lp8ikEB2QS4CXg7kuVmoq4BdHT+H4TsikF2Qkzq8iuRI1VHT9hk2uyCF9Q/A0cHQHamCgQ4VTkHgduDewAI4UgXCHDqUgsAhwLfAEWsWw5FqTYBjXK4gG1U5A/hgjQI5Uq0Bb8xLFeT/6pwNvA0cvELB/gLKpeKnV1jjoRMioCD7FutU4CXg2CVq+A6wA/hyiWM9ZKIEFGTzwpUfm7kYOH2/P/8EfDI7qf9wojX3Za9AQEG2hnUccBjwNfDL1od7REsEFKSlappLOAEFCUdqwJYIKEhL1TSXcAIKEo7UgC0RUJCWqmku4QQUJBypAVsioCAtVdNcwgkoSDhSA7ZEQEFaqqa5hBNQkHCkBmyJgIK0VE1zCSegIOFIDdgSAQVpqZrmEk5AQcKRGrAlAgrSUjXNJZyAgoQjNWBLBBSkpWqaSzgBBQlHasCWCChIS9U0l3ACChKO1IAtEVCQlqppLuEEFCQcqQFbIqAgLVXTXMIJKEg4UgO2REBBWqqmuYQTUJBwpAZsiYCCtFRNcwknoCDhSA3YEgEFaama5hJOQEHCkRqwJQIK0lI1zSWcgIKEIzVgSwQUpKVqmks4AQUJR2rAlggoSEvVNJdwAgoSjtSALRFQkJaqaS7hBBQkHKkBWyKgIC1V01zCCShIOFIDtkTgPyh7XNgwLTvAAAAAAElFTkSuQmCC';

      const showHotKey = item.hotkey && item.hotkey.length > 0;
      const showHotKeyHint = !showHotKey && hotKeyMax.length > 0;
      const showArrow = item.children.length > 0;

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
                
                <img class="__context__menu__item_arrow" src="${arrow}"
                    style="display:${showArrow ? 'block' : 'none'}"
                "/>
                
                <div class="__context__menu__item_arrow" 
                 style="display:${!showArrow && !showHotKey ? 'block' : 'none'}"/>
            `;

        div.className = MenuItemClassName;
        div.onmouseover = (i => {
          return () => {
            menu.hover = i;
          };
        })(parseInt(i));

        if (item.onclick) {
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
        if (menu.hover === i) {
          child.className = MenuItemClassName + ' ' + MenuItemHoverClassName;
        } else {
          child.className = MenuItemClassName;
        }
      }
    };
  }
}

export default ContextMenuBox;
