export function isArray( arr ) {
    return Array.isArray(arr);
}

export function isString( str ) {
    return typeof str === 'string';
}

export function isDomInstance( el) {
    return el instanceof HTMLElement;
}

export default {
    isArray,
    isString,
    isDomInstance
}