export function formatDate(timestamp) {
    const date = new Date(timestamp);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const now = {
        hours: date.getHours(),
        minutes: date.getMinutes(),
        date: date.getDate(),
        day: date.getDay(),
        month: date.getMonth(),
    }
    
    return `${days[now.day]}-${formatNumber(now.date)}-${months[now.month]}-${formatNumber(now.hours)}:${formatNumber(now.minutes)}`;
}

export function formatNumber(number) {
    return number.toString().padStart(2, "0");
}

export function openDB(version) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("notedb", version);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains("notes")) {
                const objectStore = db.createObjectStore("notes", { keyPath: "id", autoIncrement: false });
                objectStore.createIndex("title", "title", { unique: false });
            }
        }
    });
}

export async function insertNote(note) {
    try {
        const o = await resolveNotesObjectStore('readwrite');
        const addReq = o.put(note);
        
        addReq.onsuccess = () => console.log("Added");
    } catch (e) {
        console.log(e)
    }
}

export async function resolveNotesObjectStore(mode) {
    const db = await openDB(1);
    const tx = db.transaction(["notes"], mode);
    const objectStore = tx.objectStore("notes");
    
    return objectStore;
}

export async function deleteNote(noteId) {
    try {
        const o = await resolveNotesObjectStore("readwrite");
        const r = o.delete(noteId);
        
        r.onsuccess = () => console.log("Deleted");
        r.onerror = () => console.log(r.error);
    } catch (e) {
        console.log(e.message);
    }
}

export async function fetchNotes() {
    try {
        const o = await resolveNotesObjectStore("readonly");
        return new Promise((resolve, reject) => {
            const r = o.getAll();
            r.onsuccess = (e) => resolve(e.target.result);
            r.onerror = (e) => reject(e);
        })
    } catch (e) {
        console.log(e.message)
    }
}

export function getSelectedRange() {
    return window.getSelection().getRangeAt(0);
}

export function applyTextStyle(styleClass) {
    const selection = getSelectedRange();
    const parentElement = selection.startContainer.parentElement;
    const node = document.createElement("span");
    node.textContent = selection.toString();
    
    if (!parentElement.classList.contains(styleClass)) {
        node.classList.add(styleClass);
    } else {
        node.classList.add(`no-${styleClass}`);
    }
    
    if (styleClass === "underline") {
        const closestNode = parentElement.closest(".underline");
        if (closestNode) {
            closestNode.classList.remove("underline");
        }
    }
    
    selection.deleteContents();
    selection.insertNode(node);
}

export function applyStyleBasedOnClass(className) {
    try {
        const selectedRange = getSelectedRange();
        const node = document.createElement('span');

        node.classList.add(className);
        node.textContent = selectedRange.toString();

        selectedRange.deleteContents();
        selectedRange.insertNode(node);
    } catch (e) {
        console.log(e)
    }
}

export function saveTheme(theme) {
    localStorage.setItem('pro_note_user_theme', theme);
}