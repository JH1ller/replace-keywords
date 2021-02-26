export interface RKConfig {
  transformations: Transformation[];
}

type TransformationQuery = string | RegExp;

export interface Transformation {
  query: TransformationQuery;
  value: string | ((word: string, query: TransformationQuery) => string);
  appendSpace?: boolean;
}
