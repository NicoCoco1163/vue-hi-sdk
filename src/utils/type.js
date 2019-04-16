/**
 * @file   : type.js
 * @author : NicoCoco1163
 * @created: 2018-1-22 15:54:8
 */

export function isObject(val) {
    return val != null
        && typeof val === 'object'
        && !Array.isArray(val);
}

export function isObjEmpty(obj) {
    for (let t in obj) {
        return !1;
    }

    return !0;
}

export function isDef(val) {
    return val !== undefined;
}

export function isUndef(val) {
    return val === undefined;
}

export function noop() {}
