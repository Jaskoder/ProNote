export class Root {
    constructor(domroot) {
        if(domroot instanceof HTMLElement) {
            this.root = domroot;
        } else {
            throw new Error(`
                ${domroot} is not a valid DOM element
            `)
        }
    }
    render( component ) {
        this.root.appendChild(component)
    }
}

export function createRoot( root ) {
    return new Root(root);
}