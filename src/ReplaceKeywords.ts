import { RKConfig, Transformation } from './types/Config';
import { ReplaceEvent } from './types/Event';

export default class ReplaceKeywords {
  private _element: HTMLElement | null;
  private _config: RKConfig;

  constructor(element: HTMLElement, config: RKConfig) {
    this._config = config;
    this.attach(element);
  }

  attach(element: HTMLElement): void {
    if (!(element instanceof HTMLElement)) {
      console.error("Element must be of type 'HTMLElement'.");
      return;
    }
    if (element.contentEditable !== 'true') {
      console.error(
        'Element does not have \'contenteditable="true"\' attribute.'
      );
      return;
    }
    if (this._element) {
      this.detach();
    }
    element.addEventListener('keyup', () => this.keyupHandler());
    this._element = element;
  }

  detach(): void {
    if (this._element) {
      this._element.removeEventListener('keyup', () => this.keyupHandler());
      this._element = null;
    } else {
      console.warn('Detach failed, element is not attached');
    }
  }

  get transformations(): Transformation[] {
    return this._config.transformations ?? [];
  }

  set transformations(transformations: Transformation[]) {
    this._config.transformations = transformations;
  }

  private keyupHandler() {
    const precedingText = this.getPrecedingText();
    const lastWord = this.getLastWordInText(precedingText);

    for (const { query, value, appendSpace } of this._config.transformations) {
      const isRegexp = query instanceof RegExp;
      const startPos = precedingText.length - lastWord.length;
      const matches = isRegexp ? lastWord.match(query) : undefined;

      if (matches || (query === lastWord && !isRegexp)) {
        let replaceContent =
          typeof value === 'function' ? value(lastWord, query, matches) : value;

        if (appendSpace ?? true) {
          replaceContent += '\xA0';
        }
        this.replaceHtml(replaceContent, startPos, startPos + lastWord.length);

        const replaceEvent: ReplaceEvent = new CustomEvent('replace', {
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

  private replaceHtml(html: string, startPos: number, endPos: number): void {
    const selection = window.getSelection();
    let range = document.createRange();

    if (selection?.anchorNode) {
      range.setStart(selection?.anchorNode, startPos);
      range.setEnd(selection.anchorNode, endPos);
    }

    range.deleteContents();

    const element = document.createElement('div');
    element.innerHTML = html;
    const frag = document.createDocumentFragment();
    let node: ChildNode, lastNode: ChildNode;
    while ((node = element.firstChild)) {
      lastNode = frag.appendChild(node);
    }
    range.insertNode(frag);

    if (lastNode) {
      range = range.cloneRange();
      range.setStartAfter(lastNode);
      range.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }

  private getPrecedingText() {
    let text = '';
    const element = window.getSelection()?.anchorNode;
    const workingNodeContent = element?.textContent;
    const selectStartOffset = window.getSelection()?.getRangeAt(0).startOffset;

    if (workingNodeContent && selectStartOffset && selectStartOffset >= 0) {
      text = workingNodeContent.substring(0, selectStartOffset);
    }

    return text;
  }

  private getLastWordInText(text: string) {
    text = text.replace(/\u00A0/g, ' ');
    const wordsArray = text.split(/\s+/);
    const wordsCount = wordsArray.length - 1;
    return wordsArray[wordsCount].trim();
  }
}
