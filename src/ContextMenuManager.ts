"use strict";

import Menu from "./Menu";
import ContextMenuBox from "./ContextMenuBox";

class ContextMenuManager {
    i18n: (key: string) => string = (key: string) => {
        return key;
    };
    readonly boxes: ContextMenuBox = new ContextMenuBox(this);

    show(menu: Menu): void {
        this.boxes.add(menu);
    }

    hide(menu?: Menu): void {
        this.boxes.remove(menu);
    }
}

export default ContextMenuManager;
