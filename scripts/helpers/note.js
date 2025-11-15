export class Note {
    constructor(title, content) {
        this.id = Date.now(); // Since the autoincrement variable is set to false in the Notes objectStore, we pass our custom value to the id.
        this.title = title;
        this.content = content;
        this.lastOpen = Date.now(); //Will be updated when it's the following time a note has been modified 
    }
}
