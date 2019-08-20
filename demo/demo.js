"use strict";

import ContextMenu from "../src/ContextMenu.ts";

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
                alert("paste success: " + data);
            })
            .catch(() => {
                alert("paste failed: " + data);
            });
    } else {
        alert("not supported");
    }
}

const menulist = (function menulist() {
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

    builder.item("copy", copy, "ctrl+c", "/icon/copy.png");
    builder.item("paste", paste, "ctrl+v", "/icon/paste.png");

    builder.divider();

    builder.item(
        "refresh",
        () => {
            location.reload();
        },
        null,
        "/icon/refresh.png"
    );
    builder.item("about", null, null, "/icon/about.png");
    builder.item("about", null, null, "/icon/about.png");
    builder.item("about", null, null, "/icon/about.png");
    builder.item("about", null, null, "/icon/about.png");
    builder.item("about", null, null, "/icon/about.png");
    builder.item("about", null, null, "/icon/about.png");
    builder.item("about", null, null, "/icon/about.png");
    builder.item("about", null, null, "/icon/about.png");
    builder.item("about", null, null, "/icon/about.png");
    builder.item("about", null, null, "/icon/about.png");



    return builder.build();
})();


ContextMenu.install();

const div=document.getElementsByClassName("big")[0];
div.oncontextmenu=()=>{
    ContextMenu.show(menulist);
};

