import {
  CRUD_DISABLED_OPTIONS,
  DATABASE_TYPES,
  GENERATION_TYPES, GENERIC_ATTRIBUTE_TYPES, HTTP_METHOD_TYPES,
  MIME_TYPES,
  OBJECT_TYPES,
  PARAMS_TYPES,
  STRUCT_TYPES, GENERIC_COLLECTION_TYPES,
} from '../utils/constants';

export interface TypeMetadata {
  name: string;
  primitive: boolean;
  namespace?: string;
}

export interface ApiConfig extends BaseApiConfig {
  packageName: string;
}

export interface BaseApiConfig {
  type: 'baseApi';
  apiName: string;
  group: string;
  artifact: string;
  database: DatabaseTypes;
  description?: string;
  package?: string;
  projectStructureStyle: ProjectStructureStyle;
  name?: string;
  enableObservability: boolean;
  igrpCoreVersion: string;
}


export interface ModelConfig {
  type: 'model';
  name: string;
  tableName: string;
  attributes: Attribute[];
  uniqueConstraints?: UniqueConstraint[];
  indexes?: EntityIndex[];
  primaryKey?: PrimaryKey[];
  crud?: Crud;
  relations?: Relation[];
  audit?: boolean;
  module?: string;
}

export interface EntityIndex {
  name: string;
  columns: string[];
  unique: boolean
}


export interface ModuleConfig {
  type: 'module';
  name: string;
}

export interface PermissionConfig {
  type: 'permission';
  name: string;
  description: string;
  endpoints: IEndpoint[];
}

export interface IEndpoint {
  type: string;
  resource: string; // indicates the model name or controller name
  method: HttpMethod | DisabledMethods;
  path: string
}

export interface GenericType {
  name: string;
  namespace?: string;
  ns: 'dto'|'model'|'java'|'local';
}

export interface JavaType {
  name: string;
  namespace?: string;
}

export interface JavaAttribute {
  name: string;
  type: string | AttributeType;
  ns: 'dto' | 'model' | 'java';
  required: boolean;
  before?: boolean,
  after?: boolean,
  positive?: boolean,
  minLength?: number,
  maxLength?: number,
  regex?: string,
  collectionType?: CollectionType;
  isEmail?: boolean;
  isUrl?: boolean;
  primaryKey?: boolean;
  jsonAttributeName?: string;
  xmlAttributeName?: string;
}

export interface DTOBaseConfig {
  type: ObjectTypes;
  name: string;
  module?: string;
}

export interface DTOConfig extends DTOBaseConfig {
  template: 'classic' | 'record';
  attributes: JavaAttribute[];
}

export interface HandlerConfig extends DTOConfig {
  response: string;
}

export interface UniqueConstraint {
  name: string;
  columns: string[];
}

export interface EntityIndex {
  name: string;
  columns: string[];
}

export interface JavaType {
  name: string;
  namespace?: string;
}

export interface JavaAttribute {
  name: string;
  type: string | AttributeType;
  ns: 'dto' | 'model' | 'java';
}

export interface DTOBaseConfig {
  type: ObjectTypes;
  name: string;
}

export interface DTOConfig extends DTOBaseConfig {
  template: 'classic' | 'record';
  attributes: JavaAttribute[];
}

export interface Icontroller {
  type: 'icontroller';
  name: string;
}

export interface PrimaryKey extends Pick<Attribute, 'type' | 'name' | 'length'> {}

export interface Attribute {
  type: AttributeType;
  name: string;
  length?: number | null;
  nullable?: boolean;
  unique?: boolean;
  primaryKey?: boolean;
  generationType?: GenerationType;
  defaultValue?: string;
  ns?: 'dto' | 'model' | 'java';
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
  permissions?: IModelPermission[];
  disabledMethods: DisabledMethods[];
}

export interface IModelPermission {
  method: DisabledMethods;
  permissions: string[]
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
  module?: string;
}

export interface ControllerAction {
  path?: string;
  permissions?: string[];
  actionName: string;
  method: HttpMethod;
  accepts?: MimeTypes;
  contentType?: MimeTypes;
  requestBody?: string;
  modelAttribute?: string;
  requestParams?: RequestParams[];
  response: string;
  pathVariables?: PathVariables[];
}

export interface RequestParams {
  type: ParamsTypes;
  name: string;
  isRequired: boolean
}

export interface PathVariables {
  type: string;
  name: string;
  isRequired: boolean;
}

export interface ISelectPermissions {
  label: string;
  value: string;
}

export interface EnumConfig {
  name: string;
  module?: string;
  values: EnumValue[];
  attributes?: Attribute[];
}

export interface EnumValue {
  name: string;
  attributes?: any[];
}

export type RenderContext<T = undefined> = {
  resourceConfig: T;
  basePath: string;
  baseConfig: ApiConfig;
  fullPath: string;
  mathAttributes?: string[];
  dateTimeAttributes?: string[];
  uniqueConstraints?: UniqueConstraint[];
};

export type HttpMethod = (typeof HTTP_METHOD_TYPES)[number];
export type AttributeType = (typeof GENERIC_ATTRIBUTE_TYPES)[number];
export type CollectionType = (typeof GENERIC_COLLECTION_TYPES)[number];
export type DatabaseTypes = (typeof DATABASE_TYPES)[number];
export type ObjectTypes = (typeof OBJECT_TYPES)[number];
export type ProjectStructureStyle = (typeof STRUCT_TYPES)[number];
export type DisabledMethods = (typeof CRUD_DISABLED_OPTIONS)[number];
export type ParamsTypes = (typeof PARAMS_TYPES)[number];
export type MimeTypes = (typeof MIME_TYPES)[number];
export type GenerationType = (typeof GENERATION_TYPES)[number];