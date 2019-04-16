/**
 * @file   : wrapper.js
 * @author : NicoCoco1163
 * @created: 2019-3-27 13:19:3
 */

import {
    isUndef,
    noop,
    tip,
    error
} from '../utils';

import {
    jssdk,
    afterBdHiJsReady,
    bdHiJsLoaded
} from './native';

import transformer from './transformer';

// store executing fns if jssdk not loaded
let delayQueue = [];

export default function wrapper(actions, type, keys) {

    function walker(type, keys) {

        actions[type] = jssdk;

        for (let i = 0; i < keys.length; i += 1) {
            const key = keys[i];

            if (isUndef(key)) {
                return error(`Executing nonexistent action path: ${key} on ${keys}.`)
                    || new Promise();
            }

            actions[type] = actions[type][key];
        }

        return actions[type] = transformer(actions[type]); // eslint-disable-line
    }

    actions[type] = isUndef(jssdk)
        ? (...args) => new Promise((resolve, reject) => {

            tip('Delay Registering: ' + type, afterBdHiJsReady);

            // lazy executing
            delayQueue.push([type, keys, args]);

            function cleanDelayQueue() {

                if (!jssdk) {
                    return error('BdHiJs not injected.');
                }

                tip(`${delayQueue.length} actions in delay queue.`);

                // check delay queue
                while (delayQueue.length > 0) {

                    const [executingType, keys, args] = delayQueue.shift();

                    tip(`Executing ${executingType} with params:`, args);

                    // register && execute action
                    const promise = walker(executingType, keys)(...args);

                    if (executingType === null) {
                        jssdk.config(...args);
                        continue;
                    }

                    if (executingType === type) {
                        promise.then(resolve).catch(reject);
                        continue;
                    }

                    promise.catch(noop);
                }
            }

            if (afterBdHiJsReady) {
                return cleanDelayQueue();
            }

            window.onBdHiJsReady = () => bdHiJsLoaded() || cleanDelayQueue();
        })
        : walker(type, keys);
}
