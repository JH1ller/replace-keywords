import { Transformation } from './Config';
export declare type ReplaceEvent = CustomEvent<{
    oldValue: string;
    newValue: string;
    config: Transformation;
}>;
