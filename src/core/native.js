/**
 * @file   : nt.js
 * @author : NicoCoco1163
 * @created: 2019-3-26 17:50:33
 */

import {
    isDef,
    isUndef,
    isObject,
    noop,
    IS_IOS
} from '../utils';

import wrapper from './wrapper';

// store window.BdHiJs
export let jssdk;
// store executing fns if jssdk not loaded
export let delayQueue = [];
// mark the onBdHiJsReady is executed
export let afterBdHiJsReady = false;

// debug
export let tip = noop;
export let error = noop;

let parserMsg = noop;

export default class Native {

    constructor(options = {}) {
        this._actions = {};
        this._init(options);
    }

    _init(options) {
        const {
            appAgentId,
            corporateId,
            actions = {},
            debug = false
        } = options;

        if (console !== undefined && debug) {

            parserMsg = arr => {
                function ifObject(msg) {
                    return isObject(msg) ? JSON.stringify(msg) : msg;
                }

                return arr.map(ifObject).join(' ');
            };

            tip = (...msg) => console.warn(
                `[VueHiSdk tip]: ${parserMsg(msg)}`
            );

            error = (...msg) => console.error(
                `[VueHiSdk error]: ${parserMsg(msg)}`
            );
        }

        if (isDef(appAgentId) && isDef(corporateId)) {
            let config = JSON.stringify({
                appAgentId,
                corporateId
            });

            // backslash
            if (IS_IOS) {
                config = config.replace(/"/g, '\\"');
            }

            if (afterBdHiJsReady) {
                jssdk.config(config);
            }
            else {
                delayQueue.unshift([null, null, config]);
            }
        }

        for (let key in actions) {
            // proxy to instance
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    if (isUndef(this._actions[key])) {
                        this._register(key, actions[key]);
                    }

                    return this._actions[key];
                }
            });
        }
    }

    _register(act, str) {

        this._actions[act] = noop;

        tip('Registering: ' + str);

        let keys;

        if (typeof str === 'string') {
            // a.b[0] => a.b.0
            str = str.replace(/\[(\S+?)\]/g, function (str, match) {
                return `.${match}`;
            });

            keys = str.split('.');
        }

        // check the format of action value
        if (!Array.isArray(keys)) {
            return error(`Invalid action value: ${str}.`);
        }

        wrapper(this._actions, act, keys);

        return this._actions[act];
    }
}

export function bdHiJsLoaded() {
    jssdk = window.BdHiJs;
    afterBdHiJsReady = true;

    tip('Entering onBdHiJsReady: ', isDef(jssdk));
}

(function () {
    window.onBdHiJsReady = bdHiJsLoaded;
})();
