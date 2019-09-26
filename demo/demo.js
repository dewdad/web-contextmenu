'use strict';

const menulist = (function() {
  const toast = function(m) {
    alert(m.index + ':' + m.name);
  };
  const builder = ContextMenu.builder();
  builder.item('alert', null, function(b) {
    b.item('alert1', toast);
    b.item('alert2', toast);
  });

  builder
    .item('submenu', toast, function(b) {
      b.item('中文中文中文中文中文中文中文', toast);
      b.item('EnglishEnglishEnglishEnglish', toast, function(b) {
        b.item('中文中文中文中文中文中文中文', toast);
        b.item('EnglishEnglishEnglishEnglish', toast, function(b) {
          b.item('中文中文中文中文中文中文中文', toast);
          b.item('EnglishEnglishEnglishEnglish', toast);
        });
      });
    })
    .enable(false);

  builder.divider();

  builder.item('copy', toast, 'ctrl+c', './icon/copy.png').enable(false);
  builder.item('paste', toast, 'ctrl+v', './icon/paste.png').enable(false);

  builder.divider();

  builder.item(
    'refresh',
    function() {
      location.reload();
    },
    null,
    './icon/refresh.png'
  );
  for (let i = 0; i < 10; i++) {
    builder.item('about', toast, null, './icon/about.png');
  }
  builder.item('no-click');

  return builder.build();
})();

ContextMenu.install();

ContextMenu.i18n = function(key) {
  return 'i18n:' + key;
};

const div = document.getElementsByClassName('big')[0];
div.oncontextmenu = function(e) {
  console.log(e);
  ContextMenu.show(menulist);
};
