import { createElement } from "./core/Element.js";
import { createComponent } from "./core/Component.js";
import { applyTextStyle } from "./helpers/helpers.js";
import { applyStyleBasedOnClass } from "./helpers/helpers.js";
import { Note } from "./helpers/note.js";
import { insertNote } from "./helpers/helpers.js";
import { fetchNotes } from "./helpers/helpers.js";
import { deleteNote } from "./helpers/helpers.js";
import { formatDate } from "./helpers/helpers.js";
import { saveTheme } from "./helpers/helpers.js";

const navBar = document.querySelector('.nav-bar');
const toggleButton = document.querySelector('#toggle');
const appElement = document.querySelector('.app');
const mainView = document.querySelector('.view .main');
const listWrapper = document.querySelector('.list-wrapper');
const listInputField = document.querySelector('.side-view input');
const toggleModebutton = document.querySelector('#theme-btn');
const addButton = document.querySelector('#addbtn');
const navBarLinks = document.querySelectorAll('.nav-bar ul li');

function createEditor(note) {
    const editor = createElement('div').classList('editor');
    const editorTextView = createElement('div').classList('text-view');
    const editorTitleWrapper = createElement('div').innerHTML(`<p contenteditable></p>`).classList('title');
    const editorContentWrapper = createElement('div').innerHTML(`<p contenteditable></p>`).classList('content');
    const editorToolBar = createToolBar(note);

    const editorTextViewComponent = createComponent(editorTextView, [editorTitleWrapper, editorContentWrapper])
    const editorComponent = createComponent(
        editor,
        [editorTextViewComponent, editorToolBar]
    );

    return editorComponent;

}

function createToolBar(note) {
    const toolbar = createElement('div').classList('toolbar');
    const textStylesButtons = ['Bold', 'Italic', 'Underline'].map((label) => {
        const button = (
            createElement('button')
                .click(() => applyTextStyle(label.toLowerCase()))
                .innerHTML(`<span class="icon">${label[0]}</span><span class="tool-tip">${label}</span>`)
        );

        return button;
    });

    const textColorButtons = ['Red', 'Green', 'Blue', 'White', 'Black'].map((label) => {
        const button = (
            createElement('button')
                .id(label.toLowerCase())
                .click(() => applyStyleBasedOnClass(label.toLowerCase()))
                .innerHTML(
                    `<span class="icon">${label[0].toUpperCase()}</span>
                 <span class="tool-tip">${label}</span>`
                )
        );
        return button;
    });

    const textCaseButtons = ['Aa', 'aa', 'AA'].map((label) => {

        const tooltiptext = label === 'Aa' ? 'Uppercase' : label === 'aa' ? 'Lowercase' : 'Capitalise';
        const button = (
            createElement('button')
                .id(label)
                .click(() => applyStyleBasedOnClass(label))
                .innerHTML(`
                <span class="icon">${label}</span>
                <span class="tool-tip">${tooltiptext}</span>
            `)
        );
        return button;
    })

    const saveButton = (
        createElement('button')
            .id('save')
            .click(async () => {
                const { title, content } = resolveTitleAndContent();

                note.title = title;
                note.content = content;
                note.lastOpen = Date.now();

                try {
                    await insertNote(note);
                    await renderSavedNotesList();
                    createAlertBox('Note saved successfully', 'success')
                } catch (e) {
                    console.error(e);
                    createAlertBox('Error saving note')
                }
            })
            .innerHTML(`<span class="icon"><i class="bi bi-save"></i></span><span class="tool-tip">Save</span>`)
    );
    const closeButton = (
        createElement('button')
            .id('close')
            .innerHTML(`<span class="icon"><i class="bi bi-x"></i></span><span class="tool-tip">Close</span>`)
            .click(() => {
                closeEditor(renderSavedNotesTable);
            })
    );

    const toolBarComponent = createComponent(toolbar, [...textStylesButtons, ...textColorButtons, ...textCaseButtons, saveButton, closeButton]);
    return toolBarComponent;
}

function createPromptBox(message, callback) {
    let promptBoxComponent;
    const promptBox = createElement('div').classList('prompt');
    const promptMessage = createElement('span').classList('message').innerHTML(message);
    const onYesButton = createElement('button')
        .innerHTML('Confirm')
        .id('true')
        .click(
            () => {
                callback(true);
                if (promptBoxComponent) {
                    appElement.removeChild(promptBoxComponent);
                }
            }
        )
    const onCancelButton = createElement('button')
        .innerHTML('Cancel')
        .id('false')
        .click(
            () => {
                callback(false);
                if (promptBoxComponent) {
                    appElement.removeChild(promptBoxComponent)
                }
            }
        );

    promptBoxComponent = createComponent(
        promptBox,
        [
            promptMessage,
            createComponent(
                createElement('div').classList('btns'),
                [onCancelButton, onYesButton]
            )
        ]
    );

    appElement.appendChild(promptBoxComponent)
}

function createAlertBox(message, type = 'info') {
    const alertbox = createElement('div').classList(['alert', type]);
    const icon = createElement('span').classList('icon').innerHTML(`<i class="bi bi-exclamation"></i>`);
    const msg = createElement('span').classList('message').innerHTML(message);
    const alertboxComponent = createComponent(alertbox, [icon, msg]);

    appElement.appendChild(alertboxComponent);

    setTimeout(() => appElement.removeChild(alertboxComponent), 3000);
}

function initEditor(note = new Note('Edit title...', 'Edit content...')) {
    const editor = createEditor(note);
    const titleElement = editor.querySelector('.title p');
    const contentElement = editor.querySelector('.content p');

    titleElement.textContent = note?.title || 'Title';
    contentElement.innerHTML = note?.content || 'Start tying';
    mainView.innerHTML = '';
    mainView.appendChild(editor);
    console.log(note);
}

async function renderSavedNotesList() {
    const allNotes = await fetchNotes()
    const listElement = createElement('div').classList('list');
    const listItems = [];

    if (allNotes.length > 0) {
        allNotes.forEach((note) => {
            const listItem = createElement('div').classList('list-item');
            const label = createElement('div').classList('label');
            const dataElement = createElement('div').classList('data');
            const actionBtns = createElement('div').classList('actions');
            const editButton = (
                createElement('button')
                    .classList('edit')
                    .innerHTML(`<i class="bi bi-pen"></i>`)
                    .click(() => initEditor(note))
            );

            const deleteButton = (
                createElement('button')
                    .classList('delete')
                    .innerHTML(`<i class="bi bi-trash"></i>`)
                    .click(() => deletSavedNoteId(note))
            )

            label.innerHTML(`<i class="bi bi-book"></i>`);
            dataElement.innerHTML(`
                <span class="title">${note.title}</span>
                <span class="time">${formatDate(note.lastOpen)}</span>
            `);

            const actionBtnsComponent = createComponent(actionBtns, [editButton, deleteButton]);
            const listItemComponent = createComponent(
                listItem,
                [label, dataElement, actionBtnsComponent]
            );

            listItems.push(listItemComponent)
        });

        listWrapper.innerHTML = '';
        listWrapper.appendChild(
            createComponent(listElement, listItems)
        )
    } else {
        listWrapper.innerHTML = `<span> You haven't saved any note for the moment</span>`
    }
}

async function renderSavedNotesTable() {

    try {
        const savedNotes = await fetchNotes();
        const { length } = savedNotes;

        const noteTable = createElement('div').classList('notes-table');
        const heading = createElement('h3').innerHTML(`${length} note${length > 1 ? 's' : ''} taken`);
        const inputField = createElement('input').setAttributes({ type: 'text', placeholder: 'Search a note' }).input((e) => executeSyncResearch(e.target.value));
        const headingSection = createElement('div').classList('heading-section').children([heading, inputField]);

        const tableSection = createElement('div').classList('table');
        const tableSectionHeader = createElement('div').classList('t-header').innerHTML(`

            <div class="number"><span>Num</span></div>
            <div class="title"><span>Title</span></div>
            <div class="created-time"><span>Created</span></div>
            <div class="update-time"><span>Updated</span></div>
            <div class="actions"><span>Actions</span></div>
        `
        );

        const tableSectionBody = createElement('div').classList('t-body');

        const noteItems = savedNotes.map((note, i) => {
            const numberElement = createElement('div').classList('number').innerHTML(`<span>${i + 1}</span>`);
            const titleElement = createElement('div').classList('title').innerHTML(`<span>${note.title}</span>`);
            const createdTimeElement = createElement('div').classList('created-time').innerHTML(`<span>${formatDate(note.id)}</span>`);
            const updateTimeElement = createElement('div').classList('update-time').innerHTML(`<span>${formatDate(note.lastOpen)}</span>`);
            const editButton = (
                createElement('button')
                    .click(() => initEditor(note))
                    .classList('edit')
                    .innerHTML(`<i class="bi bi-pen"></i><span class="tool-tip">edit</span>`)
            );
            const deleteButton = (
                createElement('button')
                    .classList('delete')
                    .click(() => deletSavedNoteId(note))
                    .innerHTML(`<i class="bi bi-trash"></i><span class="tool-tip">delete</span>`));
            const actionsElement = createElement('div').classList('actions').children([editButton, deleteButton]);

            const item = (
                createElement('div')
                    .classList('item')
                    .children([
                        numberElement,
                        titleElement,
                        createdTimeElement,
                        updateTimeElement,
                        actionsElement
                    ])
            );

            return item;
        });

        tableSectionBody.children(noteItems);
        tableSection.children([tableSectionHeader, tableSectionBody]);

        const tableComponent = createComponent(
            noteTable,
            [headingSection, tableSection]
        );

        mainView.innerHTML = '';
        mainView.appendChild(tableComponent);

    } catch (e) {

    }
}

function deletSavedNoteId(note) {
    try {

        createPromptBox(`Are you sure to delete "${note.title}" ?`, async (choice) => {
            if (choice) {
                await deleteNote(note.id);
                await renderSavedNotesList();
                await renderSavedNotesTable();
            }
        });
    } catch (e) {
        createAlertBox(`Error deleting note`, 'error')
    }
}

function resolveTitleAndContent() {
    const editor = document.querySelector('.editor');
    if (editor) {
        const title = editor.querySelector('.title p').textContent;
        const content = editor.querySelector('.content p').innerHTML;

        return { title, content }
    }
}

function searchInTable(searchTerm) {
    const itemsElements = document.querySelectorAll('.t-body .item');
    itemsElements.forEach((item) => {
        const titleElement = item.querySelector('.title span');
        if(titleElement) {
            const textContent = titleElement.textContent.trim().toLowerCase();
            const term = searchTerm.trim().toLowerCase();

            if(!textContent.includes(term)) {
                item.style.display = 'none';
            } else {
                item.style.display = 'grid';
            }
        }
    })
}

function searchInList(searchTerm) {
    const items = document.querySelectorAll('.list .list-item');
    items.forEach((item) => {
        const titleElement = item.querySelector('.data .title');
        if(titleElement) {
            const textContent = titleElement.textContent.trim().toLowerCase();
            const term = searchTerm.trim().toLowerCase();

            if(!textContent.includes(term)) {
                item.style.display = 'none'
            } else {
                item.style.display = 'flex';
            }
        }
    });
}

function executeSyncResearch(searchTerm) {
    try {
        searchInList(searchTerm);
        searchInTable(searchTerm);
    } catch (e) {
        console.log(e)
    }
}

function closeEditor(onClose) {
    const editor = mainView.querySelector('.editor');
    if (editor) {
        createPromptBox("You are about to close editor unsaved work would get lost", (choice) => {
            if (choice) {
                mainView.removeChild(editor);
                onClose()
            }
        });
    }
}

function toggleNavBar() {
    navBar.classList.toggle('open')
}

function toogleColorMode() {
    const isLightMode = appElement.classList.contains('light-mode');
    if (isLightMode) {
        appElement.classList.remove('light-mode');
        appElement.classList.add('dark-mode')
        toggleModebutton.innerHTML = `<i class="bi bi-sun-fill"></i><span class="tool-tip">Light-Mode</span>`;
        saveTheme('dark-mode')
    } else {
        appElement.classList.remove('dark-mode');
        appElement.classList.add('light-mode')
        toggleModebutton.innerHTML = `<i class="bi bi-moon-fill"></i><span class="tool-tip">Dark-Mode</span>`;
        saveTheme('light-mode');
    }
}

function applySavedTheme() {
    const theme = localStorage.getItem('pro_note_user_theme') || 'light-mode';
    appElement.classList.add(theme);
}

window.addEventListener('DOMContentLoaded', () => {
    addButton.addEventListener('click', () => initEditor());
    toggleButton.addEventListener('click', toggleNavBar);
    toggleModebutton.addEventListener('click', toogleColorMode);
    listInputField.addEventListener('input', (e) => executeSyncResearch(e.target.value));
    navBarLinks.forEach((l) => {
        l.addEventListener('click', () => {
            createAlertBox("These functionality will be added soon")
        })
    })
    applySavedTheme()
    renderSavedNotesList();
    renderSavedNotesTable()
})
