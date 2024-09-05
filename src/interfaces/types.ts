export interface ApiConfig {
  type: 'baseApi';
  apiName: string;
  group: string;
  artifact: string;
  database: DataBaseTypes;
  description?: string;
  package?: string;
  name?: string;
}

export interface ModelConfig {
  type: 'model';
  name: string;
  attributes: Attribute[];
  crud?: Crud;
  relations?: Relation[];
}

export interface Icontroller {
  type: 'icontroller';
  name: string;
}

export interface Attribute {
  type: AttributeType;
  name: string;
  primary?: boolean;
  required?: boolean;
  unique?: boolean;
  notNull?: boolean;
}

export interface Relation {
  relationType: string;
  entity: string;
  mappedBy?: string;
  joinColumn?: string;
  joinTable?: string;
  inverseJoinColumn?: string;
}

export interface Crud {
  enabled: boolean;
  path: string;
  disabledMethods: DisabledMethods [];
}

export interface Table {
  name: string;
  joinColumns: string;
  inverseJoinColumns: string;
}

export interface ControllerConfig {
  type: 'controller';
  name: string;
  basePath: string;
  actions: ControllerAction[];
}

export interface ControllerAction {
  path: string;
  name: string;
  method: HttpMethod;
  pathParams?: PathParams[];
  response: string;
}

export interface PathParams {
  type: string;
  name: string;
}

export type RenderContext<T = undefined> = {
  resourceConfig: T;
  basePath: string;
  baseConfig: ApiConfig;
  mathAttributes?: string[];
  sqlAttributes?: string[];
};

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

export type AttributeType =
  | 'boolean'
  | 'byte'
  | 'short'
  | 'char'
  | 'int'
  | 'long'
  | 'float'
  | 'double'
  | 'Boolean'
  | 'Byte'
  | 'Short'
  | 'Character'
  | 'Integer'
  | 'Long'
  | 'Float'
  | 'Double'
  | 'String'
  | 'BigInteger'
  | 'BigDecimal'
  | 'Date'
  | 'Time'
  | 'Timestamp';

export type DataBaseTypes = 'MySQL' | 'Oracle' | 'Postgresql';

export type DisabledMethods = 'save' | 'delete'
