/**
 * @file   : install.js
 * @author : NicoCoco1163
 * @created: 2019-3-26 17:50:33
 */

import {
    error
} from './utils';

let Vue;

// plugins install
export default function install($Vue) {

    Vue = $Vue;

    if (install.installed) {
        error('already installed.');
        return;
    }

    const version = (
        Vue.version
        && Number(Vue.version.split('.')[0])
    ) || -1;

    if (version < 2) {
        error(`vue-hi-sdk (${install.version}) need`
            + ` to use Vue 2.0 or later (Vue: ${Vue.version}).`);
        return;
    }

    install.installed = true;

    Vue.mixin(
        Vue.config._lifecycleHooks.indexOf('init') > -1
            ? {init}
            : {beforeCreate: init}
    );
}

// bind $native
function init() {
    const options = this.$options;

    if (options.native) {
        Object.defineProperty(this, '$native', {
            enumerable: true,
            get: () => options.native
        });
    }
    else if (
        options.parent
        && options.parent.$native
    ) {
        Object.defineProperty(this, '$native', {
            enumerable: true,
            get: () => options.parent.$native
        });
    }
}

if (
    typeof window !== 'undefined'
    && window.Vue
) {
    install(window.Vue);
}
