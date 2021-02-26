interface RKConfig {
    transformations: Transformation[];
}
declare type TransformationQuery = string | RegExp;
interface Transformation {
    query: TransformationQuery;
    value: string | ((word: string, query: TransformationQuery) => string);
    appendSpace?: boolean;
}

declare class ReplaceKeywords {
    private _element;
    private _config;
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

declare type ReplaceEvent = CustomEvent<{
    oldValue: string;
    newValue: string;
    config: Transformation;
}>;

export default ReplaceKeywords;
export { RKConfig, ReplaceEvent, Transformation };
