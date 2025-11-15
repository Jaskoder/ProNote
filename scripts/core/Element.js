import { isString } from "./helpers.js";
import { isArray } from "./helpers.js";

export class Element {
    constructor(tag) {
        if (!isString(tag)) {
            throw new TypeError(`${tag} is not a string`);
        }
        this.element = document.createElement(tag);
    }

    classList(classNames) {
        if (typeof classNames === "string") {
            this.element.classList.add(classNames);
        } else if (isArray(classNames)) {
            classNames.forEach((className) => {
                if (isString(className)) {
                    this.element.classList.add(className);
                }
            });
        } else {
            throw new TypeError(`${classNames} is neither an array or a string`);
        }
        return this;
    }

    innerHTML(html) {
        if(!isString(html)) {
            throw new TypeError(`${html} is not a string`);
        }
        this.element.innerHTML = html;
        return this;
    }

    click( clickFunc ) {
        if(typeof clickFunc === 'function') {
            this.element.addEventListener('click', clickFunc)
        }
        return this;
    }

    setAttributes(attrs) {
        try {
            for(const [attr, value] of Object.entries(attrs)) {
                this.element.setAttribute(attr, value);
            }
        } catch (e) {
            console.error(e);
        }
        return this;
    }

    id(tagId) {
        if(typeof tagId === 'string' ) {
            this.element.setAttribute('id', tagId);
        }
        return this
    }

    addEventHandlers( events ) {
        try {
            for( const [event, handler] of Object.entries(events) ) {
                this.element.addEventListener(event, handler);
            }
        } catch (e) {
            console.log(e)
        }
        return this;
    }
}

export function createElement(tag) {
    return new Element(tag);
}