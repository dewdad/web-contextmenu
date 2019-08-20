"use strict";

import Menu from "./Menu";
import ContextMenuBox from "./ContextMenuBox";

class ContextMenuManager {
  readonly boxes: ContextMenuBox = new ContextMenuBox();

  show(menu: Menu): void {
    this.boxes.add(menu);
  }

  hide(menu?: Menu): void {
    this.boxes.remove(menu);
  }
}

export default ContextMenuManager;
