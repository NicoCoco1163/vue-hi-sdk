# Hi SDK in Vue.js 2.x

### How to install

`npm install vue-hi-sdk -S`

### How to use

``` javascript
// entry file

import Vue from 'vue';
import VueHiSdk from 'vue-hi-sdk';

import App from './App';

Vue.use(VueHiSdk);

const native = new VueHiSdk.Native({
    debug: true,
    // appAgentId: 'xxx',
    // corporateId: 'xxx',
    actions: {
        sysVersion: 'device.device.getSysVersion',
        setTitle: 'appnative.title.setText',
        setMenuText: 'appnative.menu.setButton',
        toast: 'appnative.toast.show'
    }
});

const app = new Vue({
    native,
    render: h => h(App)
}).$mount('#app');
```


``` javascript
// every .vue

// 1. tiny
this.$native.setTitle('new Title');

// 2. with onsuccess / onfail
this.$native.sysVersion()
    .then(
        // on success
        res => console.log(res)
    )
    .catch(
        // on fail
        err => console.error(err)
    );
    
// 3. with listener
this.$native.setMenuText({
    // detail in BdHiJs
    name: 'Click Me',
    value: 'return value'
}, (val) => {
    // do listener in callback
    // val === value
    console.log(val);
});

// 4. ondismiss
this.$native.toast({
    title: 'This is a toast!'
    status: 1,
    ondismiss() {}
});

// 5. use compatible
this.$native.toast({
    title: 'This is a toast!'
}, true); // pass title to both {title} && {data: {title}}

```

### With jQuery

``` javascript
(function($) {
    var native = new VueHiSdk.Native({
        // debug: true,
        actions: {
            sysVersion: 'device.device.getSysVersion',
            setTitle: 'appnative.title.setText',
            setMenuText: 'appnative.menu.setButton'
        }
    });
    $.extend({
        native: native.native
    });
})(jQuery);

$.native.setTitle('new Title');
$.native.sysVersion()
    .then(
        // on success
        res => console.log(res)
    )
    .catch(
        // on fail
        err => console.error(err)
    );
$.native.setMenuText({
        // detail in BdHiJs
        name: 'Click Me',
        value: 'return value'
    }, (val) => {
        // do listener in callback
        // val === value
        console.log(val);
    });

```

### History
- [2.0.0] use rollup && lazy registering
- [1.1.5] fixed catch on no-promise error
- [1.1.4] fixed `Uncaught (in promise)` on WEB
- ...
