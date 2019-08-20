# Html5 ContextMenu


- [X] support html5 and other framework sub as vue
- [X] item icon & hotkey string & submenu arrow
- [X] auto size
- [X] custom css
- [X] simply & easily
- [X] auto hide (when click outer & resize)
- [X] auto adjust location(keep menu in browser of visibility area)
- [X] infinite sub level

### install
```sh
npm i @robotic/contextmenu
# or
yarn add @robotic/contextmenu
```
### ScreenCap

- auto locate
![](./screenshort/contextmenu1.gif)
- clickable & scrollable
![](./screenshort/contextmenu2.gif)
- autohide
![](./screenshort/contextmenu3.gif)

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


### Usage in React
```react

```



### Build


```sh
# serve
yarn serve

# build
yarn build
```
