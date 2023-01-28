import { RKConfig, Transformation } from './types/Config';
export default class ReplaceKeywords {
    element?: HTMLElement;
    config: RKConfig;
    constructor(element: HTMLElement, config: RKConfig);
    attach(element: HTMLElement): void;
    detach(): void;
    get transformations(): Transformation[];
    set transformations(transformations: Transformation[]);
    private keyupHandler;
    private replaceHtml;
    private getPrecedingText;
    private getLastWordInText;
}
