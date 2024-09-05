import { ATTRIBUTE_TYPES, CRUD_DISABLED_OPTIONS, DATABASE_TYPES, HTTP_METHOD_TYPES, RELATIONSHIP_TYPES, RESPONSE_TYPES } from "../utils/constants";

export interface ApiConfig {
  type: 'baseApi';
  apiName: string;
  group: string;
  artifact: string;
  database: DatabaseTypes;
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

export type HttpMethod = typeof HTTP_METHOD_TYPES[number];
export type AttributeType = typeof ATTRIBUTE_TYPES[number];
export type DatabaseTypes = typeof DATABASE_TYPES[number];
export type DisabledMethods = typeof CRUD_DISABLED_OPTIONS[number];
export type RelationshipTypes = typeof RELATIONSHIP_TYPES[number];
export type ResponseTypes = typeof RESPONSE_TYPES[number];
