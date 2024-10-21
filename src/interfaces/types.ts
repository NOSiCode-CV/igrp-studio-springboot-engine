import {
  ATTRIBUTE_TYPES,
  MIME_TYPES,
  CRUD_DISABLED_OPTIONS,
  DATABASE_TYPES,
  HTTP_METHOD_TYPES,
  PARAMS_TYPES,
  RELATIONSHIP_TYPES,
  SIMPLE_RESPONSE_TYPES,
} from '../utils/constants';

export interface TypeMetadata {
  name: string;
  primitive: boolean; 
  namespace?:string;
}

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
  tableName: string;
  attributes: Attribute[];
  uniqueConstraints?: UniqueConstraint[]; // Novo campo para Compound Unique
  crud?: Crud;
  relations?: Relation[];
}

export interface UniqueConstraint {
  name: string;
  columns: string[];
}

export interface GenericType {
  name: string;
  namespace?: string;
  ns: 'dto'|'model'|'java'|'local';
}

export interface JavaType {
  name: string;
  namespace?: string;
  generics?: GenericType[];
}

export interface JavaAttribute {
  name: string;
  type: string | JavaType;
  ns: 'dto'|'model'|'java';
}

export interface DTOBaseConfig {
  type: 'dto';
  name: string;
}

export interface DTOConfig extends DTOBaseConfig {
  generics?: string[];
  template: 'classic' | 'record';
  attributes: JavaAttribute[];
}

export interface Icontroller {
  type: 'icontroller';
  name: string;
}

export interface Attribute {
  type: AttributeType;
  name: string;
  length?: number;
  nullable?: boolean;
  primarykey?: boolean;
  required?: boolean;
  unique?: boolean;
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
  disabledMethods: DisabledMethods[];
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
  actionName: string;
  method: HttpMethod;
  accepts?: MimeTypes;
  contentType?: MimeTypes;
  requestBody?: string;
  requestParams?: RequestParams[];
  response: string;
  pathVariables?: PathVariables[];
}

export interface RequestParams {
  type: ParamsTypes;
  name: string;
}

export interface PathVariables {
  type: string;
  name: string;
}

export type RenderContext<T = undefined> = {
  resourceConfig: T;
  basePath: string;
  baseConfig: ApiConfig;
  mathAttributes?: string[];
  sqlAttributes?: string[];
  uniqueConstraints?: UniqueConstraint[]; // Adicione essa linha
};



export type HttpMethod = (typeof HTTP_METHOD_TYPES)[number];
export type AttributeType = (typeof ATTRIBUTE_TYPES)[number];
export type DatabaseTypes = (typeof DATABASE_TYPES)[number];
export type DisabledMethods = (typeof CRUD_DISABLED_OPTIONS)[number];
export type RelationshipTypes = (typeof RELATIONSHIP_TYPES)[number];
export type ParamsTypes = (typeof PARAMS_TYPES)[number];
export type MimeTypes = (typeof MIME_TYPES)[number];
export type SimpleResponseTypes = (typeof SIMPLE_RESPONSE_TYPES)[number];
export type ResponseTypes = SimpleResponseTypes | `List<${SimpleResponseTypes}>`
