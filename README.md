# Html5 ContextMenu


- [X] support html5 and other framework sub as vue
- [X] item icon & hotkey string & submenu arrow
- [X] auto size
- [X] custom css
- [X] simply & easily
- [X] auto hide (when click outer or resize)
- [X] auto adjust location(keep menu in browser of visibility area)
- [X] infinite sub level

### Install
```sh
npm i @robotic/contextmenu
# or
yarn add @robotic/contextmenu
```
### ScreenCap

- auto locate
![auto locate](./screenshort/contextmenu1.gif)
- clickable & scrollable
![clickable & scrollable](./screenshort/contextmenu2.gif)
- auto hide
![auto hide](./screenshort/contextmenu3.gif)

### Usage in html5

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ContextMenu</title>

    <!--  import contextmenu js & css  -->
    <script type="text/javascript" src="../contextmenu.js"></script>
    <link type="text/css" rel="stylesheet" href="./contextmenu.css">
    
    <style>
        html,
        body{
            margin: 0;
            padding: 0;
        }
        body {
            font-family: "Avenir", Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            color: #2c3e50;
        }
        .big{
            width: 2048px;
            height: 2048px;
            background: #aaaaaa;
        }
    </style>
</head>
<body>

<div class="big">Web is Running !</div>

<script type="text/javascript" >

    const builder = ContextMenu.builder();
    builder.item("refresh", () => {
        location.reload();
    });
    const menulist=builder.build();

    ContextMenu.install();
    
    const div=document.getElementsByClassName("big")[0];
    div.oncontextmenu=()=>{
        ContextMenu.show(menulist);
    };

</script>

</body>
</html>


```


### Usage in Vue

```javascript

// import js & css global @file: "src/main.js"

import Vue from "vue";

import ContextMenu from "@robotic/contextmenu";
import "@robotic/contextmenu/dist/contextmenu.css";
Vue.use(ContextMenu);

```

```vue

<!-- use in vue  -->

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
```javascript

// import js & css global @file: "src/index.js"

import ContextMenu from "@robotic/contextmenu";
import "@robotic/contextmenu/dist/contextmenu.css";

ContextMenu.install();

```

```react

// use contextmenu in react

class Login extends React.Component {

    // ...
    
    handleContextMenu(e){
        console.log(e)
        const builder = ContextMenu.builder();
        builder.item("refresh", (m) => {
            alert(m.name)
        });
        ContextMenu.show(builder.build());
    }
    // ...
    render() {
        return (
            <div id='login-page' onContextMenu={this.handleContextMenu}>
            </div>
        )
    }
}
```



### Build


```sh
# serve
yarn serve

# build
yarn build
```

### dependence


- [X] [typescript](https://www.typescriptlang.org/)
- [X] [rollup](https://www.rollupjs.com/) : generate libs `js` `ts` `css`
- [X] [html2canvas](https://html2canvas.hertzen.com/) : compute the menubox size
- [X] [babel](https://babeljs.io/)
- [X] some other dev and package plugins see [package.json](./package.json)


### License

[LGPL-3.0-or-later](./GNU-AGPL-3.0.txt)
