// REGEX
const COMMENT_REGEX = new RegExp(/[(][*][\s\S]*?[*][)][\s]*/g);
const CODE_SEPARATOR_REGEX = new RegExp(/[\S][\s\S]*?(;;)/g);
const VARIABLE_1_REGEX = new RegExp(/((let rec \w+)|(let \w+)|(and \w+))/g);
const VARIABLE_2_REGEX = new RegExp(/(let )|(rec )|(and )/g);

// HTML Elements
const wrapper = document.getElementsByClassName("nav-wrapper")[0];
const files = document.getElementById("editor-files");
const mobile_sidenav = document.getElementById("mobile-sidenav");
const buttons = document.getElementById("menu-button");

const terminal = document.querySelector("#toplevel-terminal");

var MOBILE = false;

/**
 * Change font size of editor or toplevel, and apply the changes in memory.
 * @param {string} type - The font to change (editor or toplevel)
 * @param {number} change - The change to apply
 * @return {void} Nothing
 */
function change_font_size(type, change) {
    let r = document.querySelector(':root')
    let value = parseFloat(r?.style?.getPropertyValue('--' + type + "-font-size").slice(0, -2)) + change;
    r.style.setProperty('--' + type + '-font-size', value + "em");
    if (type == 'editor') { // If editor, need to change the hint font size
        r.style.setProperty('--hint-font-size', (value * 0.8) + "em");
    }
    if (type == 'toplevel') {
        terminal.terminal.options.fontSize = parseInt(getComputedStyle(document.getElementById("emtopx")).fontSize);
    }
    localStorage.setItem("betterocaml-text-" + type, value + "em")
}

/**
 * Clean code before execution or processing (remove comments and split command)
 * @param {string} content - Code to clean
 * @return {string[]} - List that contains all codes to execute
 */
let clean_content = function (content) {
    return content.split('\n')
        .filter(line => line.trim() !== '')
        .join('\n');
}

/**
 * Auto scroll down output interpreter
 */
function autoscroll_output() {
    let container = document.getElementsByClassName("xterm-viewport")[0];
    container.scrollTop = container.scrollHeight;
}



/**
 * Execute the last command in the editor
 * @param {CodeMirror} instance - CodeMirror instance
 * @return {void} Nothing
 */
let exec_last = function (instance) {
    let current = current_bloc_selected(instance);
    if (!(current.start == undefined) && !(current.end == undefined)) {
        let code = instance.getRange(current.start, current.end);
        if (!(current.type=="expr")) {
            code += '\n';
        }
        terminal.process(code);
        autoscroll_output();
    }
};

/**
 * Execute all the code in the editor
 * @param {CodeMirror} instance - CodeMirror instance
 * @return {void} Nothing
 */
let exec_all = function (instance) {
    autosave_editor(instance.id);
    terminal.process("_execute_current()");
    //terminal.process(instance.getValue());
    autoscroll_output();
};


let calculate_interval = function (instance) {
    let intervalles = [];
    if (query == undefined) {
        return intervalles;
    }
    let captures = query.matches(parser.parse(instance.getValue()).rootNode);
    let last_end = -1;
    captures.forEach(capture => {
        capture.captures.forEach(element => {
            let end = element.node.endPosition.row;
            if (end > last_end) {
                last_end = end;
                intervalles.push({ start: element.node.startPosition, end: element.node.endPosition , type: element.name});
            }
        })
    });
    return intervalles;
}

let current_bloc_selected = function (instance) {
    let intervalles = calculate_interval(instance);
    let current_line = instance.getCursor().line;
    for (let index = 0; index < intervalles.length; index++) {
        let intervalle = intervalles[index];
        if (current_line >= intervalle.start.row && current_line <= intervalle.end.row) {
            return {
                start: {
                    line: intervalle.start.row,
                    ch: intervalle.start.column
                },
                end: {
                    line: intervalle.end.row,
                    ch: intervalle.end.column
                },
                type:intervalle.type
            };
        }
    }
    return { start: undefined, end: undefined };
}


/**
 * Calculate the cursor of the code to highlight
 * @param {CodeMirror} instance - CodeMirror instance
 * @return {*} CodeMirror cursor
 */
let calculate_highlight = function (instance) {
    return current_bloc_selected(instance);
};

/**
 * Trigger saving process
 * @param {CodeMirror} instance - CodeMirror instance
 * @return {void} Nothing
 */
function save(instance) {
    if (instance.name == "untitled.py") {
        M.Modal.getInstance(document.getElementById('saveas')).open()
    } else {
        program_save(instance);
    }
}

/**
 * Attribute a name and save file
 * @param {CodeMirror} instance - CodeMirror instance
 * @return {void} Nothing
 */
function name_and_save(instance) {
    let potential_filename = document.getElementById('saveas_text').value;
    let fileNameToSaveAs = "untitled.py";
    if (potential_filename !== "") {
        if (potential_filename.substr(-3, 3) == ".py") {
            fileNameToSaveAs = potential_filename
        } else {
            fileNameToSaveAs = potential_filename + ".py"
        }
    }
    instance.name = fileNameToSaveAs;
    change_name(instance.id, fileNameToSaveAs);
    document.getElementById('saveas_text').value = "";

    program_save(instance);
}

/**
 * Save the file (create a download object)
 * @param {CodeMirror} instance - CodeMirror instance
 * @return {void} Nothing
 */
let program_save = function (instance) {
    let textToWrite = instance.getValue()

    //var textToWrite = textToWrite.replace(/\n/g, "\r\n");
    let textFileAsBlob = new Blob([textToWrite], { type: 'text/x-ocaml' });

    // filename to save as
    let fileNameToSaveAs = instance.name;

    let downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;

    // hidden link title name
    downloadLink.innerHTML = "LINKTITLE";

    window.URL = window.URL || window.webkitURL;

    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);

    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    M.toast({ html: 'File saved' })
    instance.is_saved = true;
    localStorage.removeItem("betterocaml-autosave-" + instance.id)
}

/**
 * Destroy the element on event
 * @param event
 */
function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}

/**
 * Create a new editor with the file in e
 * @param e - The file
 * @return {boolean}
 */
function readSingleFile(e) {
    let file = e.target.files[0];
    if (!file) {
        return;
    }
    let reader = new FileReader();
    reader.onload = function (e) {
        let contents = e.target.result;
        let next = Math.max(...Object.keys(editors).map(x => +x)) + 1;
        editors[next] = create_editor(id = next, name = file.name);
        editors[next].setValue(contents)

    };
    reader.readAsText(file);
    return false;
}

/**
 * CodeMirror editor function : Highlight text on change
 * @param {CodeMirror} instance - CodeMirror instance
 * @param changeObj - CodeMirror change status
 */
function cursor_activity(instance, changeObj) {
    let cursor = calculate_highlight(instance);
    if (!(cursor.start == undefined) && !(cursor.end == undefined)) {
        instance.current_marker.clear();
        instance.current_marker = instance.markText(from = cursor.start, to = cursor.end, options = {
            className: "code-highlight"
        });
    }
    instance.is_saved = false;
}

/**
 * CodeMirror editor function : new editor on drop
 * @param data
 * @param e
 * @return {boolean}
 */
function editor_drop(data, e) {
    let file;
    let files;
    // Check if files were dropped
    files = e.dataTransfer.files;
    if (files.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        file = files[0];
        let reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            let next = Math.max(...Object.keys(editors).map(x => +x)) + 1;
            editors[next] = create_editor(next, file.name);
            editors[next].setValue(contents)

        };
        reader.readAsText(file);
        return false;
    }
}

/**
 * Sort the elements of the list which started with prefix
 * @param {string[]} l - the list to sort
 * @param {string} w - the prefix
 * @return {string[]} sorted list
 */
let includer = function (l, w) {
    let r = [];
    for (var i = 0; i < l.length; i++) {
        if (l[i].startsWith(w)) {
            r.push(l[i]);
        }
    }
    return r;
}


/**
 * Create the editor instance
 * @param id - Editor id
 * @param name - Editor name
 * @return {CodeMirror} Editor instance
 */
function create_editor(id, name) {
    if (MOBILE) {
        var $tabs = $('#mobile-sidenav');
    }
    else {
        var $tabs = $('#editor-files');
    }
    $tabs.children().removeAttr('style');

    $tabs.append("<li id='li_tab_" + String(id) + "' class='tab col s3 onglet'><a href='#editor_tab_" + String(id) + "'>" + name + "<i class='material-icons center mini-icon' onclick='remove_editor(" + String(id) + ")'>close</i></a></li>");
    $("#editorCollection").append("<div id='editor_tab_" + String(id) + "' class='col s12 blue code-box'><textarea name='editor_" + String(id) + "' id='editor_" + String(id) + "' class='materialize-textarea'></textarea></div>");

    let editor = CodeMirror.fromTextArea(document.getElementById("editor_" + String(id)), {
        lineNumbers: true,
        autoCloseBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        smartIndent: true,
        indentWithTabs: false,
        dragDrop: true,
        matchBrackets: true,
        readOnly: false,
        theme: localStorage.getItem("betterocaml-theme") || "material",
        mode: 'text/x-python',
        extraKeys: {
            "Ctrl-Enter": exec_last,
            "Cmd-Enter": exec_last,
            "Shift-Ctrl-Enter": exec_all,
            "Shift-Cmd-Enter": exec_all,
            "Ctrl-Space": "autocomplete",
            "Cmd-Space": "autocomplete",
            "Alt-F": "findPersistent",
            "Ctrl-S": save,
            "Cmd-S": save,
            "Backspace": function (cm) { // If 4 space behind, delete 4 space
                if (cm.getCursor().ch === 0) {
                    return CodeMirror.Pass
                }
                let line = cm.getLine(cm.getCursor().line);
                if (line.charAt(cm.getCursor().ch - 1) === ' ' &&
                    line.charAt(cm.getCursor().ch - 2) === ' ' &&
                    line.charAt(cm.getCursor().ch - 3) === ' ' &&
                    line.charAt(cm.getCursor().ch - 4) === ' ') {
                    cm.replaceRange("", {
                        line: cm.getCursor().line,
                        ch: cm.getCursor().ch - 4
                    }, {
                        line: cm.getCursor().line,
                        ch: cm.getCursor().ch
                    })
                }
                else { // Else, delete 1 space
                    CodeMirror.commands.delCharBefore(cm)
                }
            },
            "Tab": function (cm) {
                if (cm.getMode().name === 'null') {
                    cm.execCommand('insertTab');
                } else {
                    if (cm.somethingSelected()) {
                        cm.execCommand('indentMore');
                    } else {
                        cm.execCommand('insertSoftTab');
                    }
                }
            },
            'Shift-Tab': function (cm) { cm.execCommand('indentLess') },
        }
    });
    editor.id = id
    editor.name = name
    editor.is_saved = true
    editor.current_marker = editor.markText({ line: 0 }, { line: 0 }, { css: "color: #fe4" });
    editor.on("cursorActivity", cursor_activity);
    editor.on('drop', editor_drop);
    editor.on("keyup", function (cm, event) {
        if (cm.ext_autocomplete && // Only trigger if jetbrain style autocompletion is activated
            cm.autocomplete_timeout < Date.now() - 500 && // Only trigger if the user stopped typing
            !cm.state.completionActive && /*Enables keyboard navigation in autocomplete list*/
            event.keyCode !== 13) {        /*Enter - do not open autocomplete list just after item has been selected in it*/
            CodeMirror.commands.autocomplete(cm, null, { completeSingle: false, });
        }
    });
    editor.on("endCompletion", function (cm) {
        cm.autocomplete_timeout = Date.now();
    });
    $tabs.tabs().tabs('select', 'editor_tab_' + String(id));
    return editor
}

/**
 * Get the focused editor id in editors list
 * @return {number} focused editor id
 */
function current_editor() {
    var actual_instance, actual_id
    if (MOBILE) {
        actual_instance = M.Tabs.getInstance(document.getElementById('mobile-sidenav'));
    }
    else {
        actual_instance = M.Tabs.getInstance(document.getElementById('editor-files'));
    }
    try {
        actual_id = actual_instance.$tabLinks[actual_instance.index].href.match(/editor_tab_[0-9]+/g)[0].substr(11)
    }
    catch (e) {
        actual_id = Math.max(...Object.keys(editors).map(x => +x))
    }
    return actual_id;
}

/**
 * Delete the editor instance
 * @param id - editor id in editors list
 */
function delete_editor(id) {
    if (MOBILE) {
        var $tabs = $('#mobile-sidenav');
    }
    else {
        var $tabs = $('#editor-files');
    }
    localStorage.removeItem("betterocaml-autosave-" + id)
    $tabs.children().removeAttr('style');
    $tabs.children().remove('#li_tab_' + String(id));
    $("#editorCollection").children().remove('#editor_tab_' + String(id)); // codebox
    $tabs.tabs();
}

/**
 * Select the editor
 * @param id - editor id in editors list
 */
function select_editor(id) {
    if (MOBILE) {
        let instance = M.Tabs.getInstance(document.getElementById('mobile-sidenav'));
        instance.select('editor_tab_' + String(id));
        setTimeout(function () {
            document.querySelector('a[href="#editor_tab_' + String(id) + '"]').click();
        }, 5);
    }
    else {
        let instance = M.Tabs.getInstance(document.getElementById('editor-files'));
        instance.select('editor_tab_' + String(id));
        setTimeout(function () {
            document.querySelector('a[href="#editor_tab_' + String(id) + '"]').click();
        }, 5);
    }

}

/**
 * Change the name of an editor tab
 * @param id - editor id in editors list
 * @param name - new name
 */
function change_name(id, name) {
    let ele = document.querySelector('a[href="#editor_tab_' + String(id) + '"]');
    ele.innerHTML = name + ele.innerHTML.substr(-79);
}

/**
 * Change the orientation of the resize bar
 * @param resize_obj
 * @param {string} type - type to change (H or V)
 */
function change_resize_bar(resize_obj, type) {
    resize_obj.resizer.type = type;
    resize_obj.resizer.node.setAttribute('data-resizer-type', type);
    if (type == "H") {
        document.getElementsByClassName("horizontal")[0].style.flexDirection = "row";
    }
    else {
        document.getElementsByClassName("horizontal")[0].style.flexDirection = "column";
    }
    localStorage.setItem("betterocaml-resize-bar", type);
    if(terminalFitter){
        terminalFitter.fit();
    }
}

/**
 * Remove the editor instance
 * @param id
 */
function remove_editor(id) {
    if (Object.keys(editors).length > 1) {
        let cur = current_editor();
        if (!editors[id].is_saved) {
            if (!confirm("Document non sauvegardé, voulez vous continuer ?")) {
                return
            }
        }
        delete editors[id];
        delete_editor(id);
        if (id == cur) {
            select_editor(Math.max(...Object.keys(editors).map(x => +x)));
        }
        else {
            select_editor(cur);
        }
    }
}

// Configuration

/**
 * Change a configuration element
 * @param name - configuration name
 * @param value - new value
 * @param editors - editors list
 */
function change_configuration(name, value, editors) {
    localStorage.setItem(name, value);
    switch (name) {
        case 'betterocaml-theme':
            let href = document.getElementById('css_theme').href;
            document.getElementById('css_theme').href = href.replace(/[^\/]+$/g, '') + value + ".css"
            for (let i in editors) {
                editors[i].setOption("theme", value);
            }
            break;
        case 'betterocaml-autocomplete':
            for (let i in editors) {
                editors[i].ext_autocomplete = Boolean(value);
            }
            break;
        default:
            console.log("no config");
    }

}

/**
 * Local storage init
 */
function init_local_storage() {
    let initial_parameter = {
        'betterocaml-theme': "material",
        'betterocaml-autocomplete': "true",
        'betterocaml-text-box_1': "1.2em",
        'betterocaml-text-box_2': "1.2em",
        'betterocaml-resize-bar': "H",
    }
    for (const [key, value] of Object.entries(initial_parameter)) {
        if (localStorage.getItem(key) == null) {
            localStorage.setItem(key, value);
        }
    }

}

/**
 * Setup custom files navbar for mobile devices
 */
function navbar_resize() {
    files.style.width = ((wrapper.offsetWidth - buttons.offsetWidth - 5)) + "px";
    if (!MOBILE && window.innerWidth <= 600) {
        MOBILE = true;
        // Change add button to mobile sidenav
        let mobile_button = document.getElementById("flexible-mobile-button");
        mobile_button.children[0].children[0].innerText = "menu";
        mobile_button.children[0].setAttribute("href", "#");
        mobile_button.children[0].removeAttribute("onclick");
        mobile_button.children[0].setAttribute("data-target", "mobile-sidenav");
        mobile_button.children[0].setAttribute("class", "sidenav-trigger");
        // transfer tabs to sidenav
        [...files.children].map(function (li) {
            mobile_sidenav.appendChild(li)
        });
        $('.mobile-tabs').tabs();

    }
    if (MOBILE && window.innerWidth > 600) {
        MOBILE = false;
        // Change mobile sidenav button to add
        let mobile_button = document.getElementById("flexible-mobile-button");
        mobile_button.children[0].children[0].innerText = "add";
        mobile_button.children[0].removeAttribute("href");
        mobile_button.children[0].setAttribute("onclick", "editors[Math.max(...Object.keys(editors).map(x => +x))+1] = create_editor(id = Math.max(...Object.keys(editors).map(x => +x))+1, name = 'untitled.py', theme= editors[Math.min(...Object.keys(editors).map(x => +x))].getOption('theme'));");
        mobile_button.children[0].removeAttribute("data-target");
        mobile_button.children[0].removeAttribute("class");
        // transfer tabs to navbar
        [...mobile_sidenav.children].map(function (li) {
            if (li.id !== "add_tab") {
                files.appendChild(li)
            }
        });
        $('.normal-tabs').tabs();

    }
}

// Autosave

/**
 * Save editor content in local storage
 * @param editor_id
 */
function autosave_editor(editor_id) {
    content = { name: editors[editor_id].name, text: editors[editor_id].getValue() }
    localStorage.setItem("betterocaml-autosave-" + editor_id, JSON.stringify(content))
}

/**
 * Clear autosaved elements
 */
function clear_autosave() {
    for (const [key, _] of Object.entries(localStorage)) {
        if (key.split("-").slice(-2, -1)[0] === "autosave") {
            localStorage.removeItem(key)
        }
    }
}

/**
 * Get the number of file autosaved in local storage
 * @return {number} autosave number
 */
function autosave_number() {
    let nb = 0
    for (const [key, _] of Object.entries(localStorage)) {
        if (key.split("-").slice(-2, -1)[0] === "autosave") {
            nb += 1
        }
    }
    return nb
}

/**
 * Restore autosaved editor in the actual session
 */
function restore_editors() {
    for (const [key, value] of Object.entries(localStorage).reverse()) {
        if (key.split("-").slice(-2, -1)[0] === "autosave") {
            let editor_value = JSON.parse(value)
            let next = Math.max(...Object.keys(editors).map(x => +x)) + 1;
            editors[next] = create_editor(id = next, name = editor_value.name);
            editors[next].setValue(editor_value.text);
        }
    }
}
