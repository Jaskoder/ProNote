import { Element } from "./Element.js";
import { Factory } from "./Factory.js";

export class Component {
    constructor(rootParent) {
        this.children = [];

        if( rootParent instanceof Element) {
            this.parent = rootParent.element;
        } else if ( rootParent instanceof HTMLElement ) {
            this.parent = rootParent;
        }
    }

    addChildren( children ) {
        if ( !Array.isArray(children )) {
            throw new TypeError(`${children} is not an array`)
        }

        this.children.push( ...children );
        return this;
    }

    mountComponent() {
        this.children.forEach( child => {
            if(child instanceof Element ) {
                this.parent.appendChild( Factory.getDomElement(child))
            } else if (child instanceof HTMLElement) {
                this.parent.appendChild( child);
            } else {
                console.error(
                    `${child} is neither a valid DOM Node or an instance Element `
                )
            }
        });
        return this;
    }
}


export function createComponent( component, children ) {
    const createdComponent = new Component(component).addChildren(children).mountComponent();

    return Factory.getComponentDomElement( createdComponent );
}