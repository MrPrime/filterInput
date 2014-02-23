# filterInput 
> an esay-to-use widget based on jQuery

##### when it will be useful :
if the length of selection items is a bit long, items can be filtered by typing keywords.
That will be convenient for user to select which he wants. 

##### browser compatibility :
support IE8+ and other modern browsers, let's bury IE6 and IE7!! 

##### requires :
jquery 1.7+

Mustache template engine

### how to use
create a container for the widget :

```html
<div id="filterinput"></div>
```

import related js files at the bottom of `body` :

```js
<script src="js/jquery-1.10.2.min.js"></script>
<script src="js/mustache.js"></script>
<script src="js/filterInput.js"></script>
```

invoke constructor function `FilterInput` :

```js
var instance = new FilterInput({
    id: 'filterInput',
    title: 'People of Dept 10th',
    styleCls: 'dil',
    width: 200,
    clearbtn: true,
    select: function(val) {
        console.log(val);
    },
    items: [{
        label: 'Andrew',
        value: '1111',
        selected: true
    }, {
        label: 'Tomas',
        value: '2222'
    }, {
        label: 'Jackson',
        value: '3333'
    }, {
        label: 'Jaccika',
        value: '4444'
    }, {
        label: 'Bruce',
        value: '5555'
    }, {
        label: 'Lucy',
        value: '6666'
    }, {
        label: 'Jimmy',
        value: '7777'
    }]
});
```

### options

**id :**
container's id. 

**title :**
description for selection items.

**styleCls :**
style class(es) will be added to container's class.

**width :**
width of the widget.

**clearbtn :**
- *true* : clear button will be rendered for clear your selection.
- *false* : clear button will NOT be rendered.

**select :**
a callback which will be invoked when select item.

**items :**
selection items.


At last, in a word, it's very easy to use, and the source code isn't uglified, you can change it in any way you like!




