import { Transformation } from './Config';

export type ReplaceEvent = CustomEvent<{
  oldValue: string;
  newValue: string;
  config: Transformation;
}>;
