# Html5 ContextMenu



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
import  ContextMenu from "@robotic/contextmenu";
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
