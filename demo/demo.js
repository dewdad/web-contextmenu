"use strict";


const copy = function () {
    const testData = "这是复制文字";
    if (navigator && navigator.clipboard) {
        navigator.clipboard
            .writeText(testData)
            .then(() => {
                alert("copy success: " + testData);
            })
            .catch(() => {
                alert("copy failed: " + testData);
            });
    } else {
        alert("not supported");
    }
}

const paste = function () {
    if (navigator && navigator.clipboard) {
        navigator.clipboard
            .readText()
            .then(data => {
                if (data && data.length > 0) {
                    alert("paste success: " + data);
                } else {
                    alert("paste success: no data");
                }
            })
            .catch(() => {
                alert("paste failed: " + data);
            });
    } else {
        alert("not supported");
    }
}

const menulist = (function () {
    const toast = function (m) {
        alert(m.index + ":" + m.name);
    };
    const builder = ContextMenu.builder();
    builder.item("alert", null, b => {
        b.item("alert1", toast);
        b.item("alert2", toast);
    });

    builder.item("submenu", toast, b => {
        b.item("中文中文中文中文中文中文中文", toast);
        b.item("EnglishEnglishEnglishEnglish", toast, b => {
            b.item("中文中文中文中文中文中文中文", toast);
            b.item("EnglishEnglishEnglishEnglish", toast, b => {
                b.item("中文中文中文中文中文中文中文", toast);
                b.item("EnglishEnglishEnglishEnglish", toast);
            });
        });
    });

    builder.divider();

    builder.item("copy", copy, "ctrl+c", "./icon/copy.png");
    builder.item("paste", paste, "ctrl+v", "./icon/paste.png");

    builder.divider();

    builder.item(
        "refresh",
        () => {
            location.reload();
        },
        null,
        "./icon/refresh.png"
    );
    for (let i = 0; i < 10; i++) {
        builder.item("about", toast, null, "./icon/about.png");
    }
    builder.item("no-click");


    return builder.build();

})();


ContextMenu.install();

ContextMenu.i18n = (key) => {
    return "i18n:" + key;
}

const div = document.getElementsByClassName("big")[0];
div.oncontextmenu = () => {
    ContextMenu.show(menulist);
};
