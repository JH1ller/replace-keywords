class ReplaceKeywords {
    constructor(element, config) {
        this._config = config;
        this.attach(element);
    }
    attach(element) {
        if (!(element instanceof HTMLElement)) {
            console.error("Element must be of type 'HTMLElement'.");
            return;
        }
        if (element.contentEditable !== 'true') {
            console.error('Element does not have \'contenteditable="true"\' attribute.');
            return;
        }
        if (this._element) {
            this.detach();
        }
        element.addEventListener('keyup', () => this.keyupHandler());
        this._element = element;
    }
    detach() {
        if (this._element) {
            this._element.removeEventListener('keyup', () => this.keyupHandler());
            this._element = null;
        }
        else {
            console.warn('Detach failed, element is not attached');
        }
    }
    get transformations() {
        var _a;
        return (_a = this._config.transformations) !== null && _a !== void 0 ? _a : [];
    }
    set transformations(transformations) {
        this._config.transformations = transformations;
    }
    keyupHandler() {
        const precedingText = this.getPrecedingText();
        const lastWord = this.getLastWordInText(precedingText);
        for (const { query, value, appendSpace } of this._config.transformations) {
            const isRegexp = query instanceof RegExp;
            const startPos = precedingText.length - lastWord.length;
            const matches = isRegexp ? lastWord.match(query) : undefined;
            if (matches || (query === lastWord && !isRegexp)) {
                let replaceContent = typeof value === 'function' ? value(lastWord, query, matches) : value;
                if (appendSpace !== null && appendSpace !== void 0 ? appendSpace : true) {
                    replaceContent += '\xA0';
                }
                this.replaceHtml(replaceContent, startPos, startPos + lastWord.length);
                const replaceEvent = new CustomEvent('replace', {
                    detail: {
                        oldValue: lastWord,
                        newValue: replaceContent,
                        config: { query, value, appendSpace },
                    },
                });
                this._element.dispatchEvent(replaceEvent);
            }
        }
    }
    replaceHtml(html, startPos, endPos) {
        const selection = window.getSelection();
        let range = document.createRange();
        if (selection === null || selection === void 0 ? void 0 : selection.anchorNode) {
            range.setStart(selection === null || selection === void 0 ? void 0 : selection.anchorNode, startPos);
            range.setEnd(selection.anchorNode, endPos);
        }
        range.deleteContents();
        const element = document.createElement('div');
        element.innerHTML = html;
        const frag = document.createDocumentFragment();
        let node, lastNode;
        while ((node = element.firstChild)) {
            lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);
        if (lastNode) {
            range = range.cloneRange();
            range.setStartAfter(lastNode);
            range.collapse(true);
            selection === null || selection === void 0 ? void 0 : selection.removeAllRanges();
            selection === null || selection === void 0 ? void 0 : selection.addRange(range);
        }
    }
    getPrecedingText() {
        var _a, _b;
        let text = '';
        const element = (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.anchorNode;
        const workingNodeContent = element === null || element === void 0 ? void 0 : element.textContent;
        const selectStartOffset = (_b = window.getSelection()) === null || _b === void 0 ? void 0 : _b.getRangeAt(0).startOffset;
        if (workingNodeContent && selectStartOffset && selectStartOffset >= 0) {
            text = workingNodeContent.substring(0, selectStartOffset);
        }
        return text;
    }
    getLastWordInText(text) {
        text = text.replace(/\u00A0/g, ' ');
        const wordsArray = text.split(/\s+/);
        const wordsCount = wordsArray.length - 1;
        return wordsArray[wordsCount].trim();
    }
}

export default ReplaceKeywords;
