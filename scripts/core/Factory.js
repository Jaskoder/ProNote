import { Element } from "./Element.js";
import { Component } from "./Component.js";


export class Factory {
    static getDomElement( element) {
        if( element instanceof Element === false) {
            throw new Error(`${element} is not an instance of Element`)
        }
        return element.element;
    }

    static getComponentDomElement(component) {
        if( component instanceof Component === false ) {
            throw new Error(`
                ${component} is not an instance of Component
            `)
        }
        return component.parent;
    }
}

