/**
 * @file   : transformer.js
 * @author : NicoCoco1163
 * @created: 2019-3-27 13:16:41
 */

import {
    isObjEmpty,
    noop,
    tip
} from '../utils';

export default function transformer(fn) {

    return (payload = {}, cb = noop) => {

        function excute(payload) {
            return tip(payload) || fn(payload);
        }

        // in case cb as first param
        if (typeof payload === 'function') {
            [payload, cb] = [cb, payload];
        }

        if (typeof payload === 'object') {
            return new Promise((resolve, reject) => {
                const {
                    ondismiss = noop,
                    ...$payload
                } = payload;

                // transform events
                payload = Object.assign({}, payload, {
                    onsuccess: resolve,
                    onfail: reject,
                    ondismiss
                });

                // transform params
                if (!isObjEmpty($payload)) {
                    payload = Object.assign({}, payload, {
                        data: JSON.stringify($payload)
                    });
                }

                // use callback as listener receiver
                if (typeof cb === 'function') {
                    payload = Object.assign({}, payload, {
                        listener(res) {
                            try {
                                res = JSON.parse(res);
                            }
                            catch (err) {}

                            return cb(res);
                        }
                    });
                }

                excute(payload);
            });
        }

        return excute(payload);
    };
}
