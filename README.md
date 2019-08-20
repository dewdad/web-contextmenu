# Html5 ContextMenu


- [X] support html5 and other framework sub as vue
- [X] item icon & hotkey string & submenu arrow
- [X] auto size
- [X] custom css
- [X] simply & easily
- [X] auto hide (when click outer & resize)
- [X] auto adjust location(keep menu in browser of visibility area)
- [X] infinite sub level

### Usage in html5

```javascript


ContextMenu.install();

document.getElementById("xx").oncontextmenu=function(e) {
    
    const builder = ContextMenu.builder();
    
    builder.item("refresh", () => {
        location.reload();
    });

    ContextMenu.show(builder.build());
};

```


### Usage in Vue

```typescript
import Vue from "vue";

import ContextMenu from "@robotic/contextmenu";
import "@robotic/contextmenu/dist/contextmenu.css";
Vue.use(ContextMenu);

```

```vue

<template>
    <div @contextmenu="$menu.show(menulist)"></div>
</template>

<script>
export default {
    computed:{
        menulist(){
            const builder = ContextMenu.builder();
            builder.item("refresh", () => {
                location.reload();
            });
            return builder.build();
        }  
    },
}
</script>
```
