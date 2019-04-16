/**
 * @file   : env.js
 * @author : NicoCoco1163
 * @created: 2019-3-27 13:58:16
 */

const USER_AGENT = window.navigator && window.navigator.userAgent || '';

export const IS_IPAD = /iPad/i.test(USER_AGENT);
export const IS_IPHONE = /iPhone/i.test(USER_AGENT) && !IS_IPAD;
export const IS_IPOD = /iPod/i.test(USER_AGENT);
export const IS_IOS = IS_IPHONE || IS_IPAD || IS_IPOD;

export const RESERVED_WORDS = [
    'data',
    'listener',
    'onfail',
    'onsuccess',
    'ondismiss'
];
