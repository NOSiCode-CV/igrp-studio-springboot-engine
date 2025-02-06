import {
  CRUD_DISABLED_OPTIONS,
  DATABASE_TYPES,
  GENERATION_TYPES,
  GENERIC_ATTRIBUTE_TYPES,
  HTTP_METHOD_TYPES,
  MIME_TYPES,
  OBJECT_TYPES,
  PARAMS_TYPES,
  STRUCT_TYPES,
  GENERIC_COLLECTION_TYPES,
  HTTP_HEADER_TYPES,
  CONFIG_TYPES,
  GENERIC_MODEL_ATTRIBUTE_TYPES,
  RELATIONSHIP_TYPES,
} from '../utils/constants';

interface IdentifiableElement {
  id?: string
}

export interface TypeMetadata {
  name: string;
  primitive: boolean;
  namespace?: string;
}

export interface ApiConfig extends BaseApiConfig {
  packageName: string;
}

export interface BaseApiConfig {
  type: 'springboot';
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


export interface ModelConfig extends IdentifiableElement {
  type: 'model';
  name: string;
  tableName: string;
  attributes: Attribute[];
  uniqueConstraints?: UniqueConstraint[];
  indexes?: EntityIndex[];
  primaryKey?: PrimaryKey[];
  crud?: boolean;
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

export interface JavaType {
  name: string;
  namespace?: string;
}

export interface JavaAttribute {
  name: string;
  type: string | AttributeType;
  objectType: 'dto' | 'model' | 'java' | 'enum';
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

export interface DTOBaseConfig extends IdentifiableElement {
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

export interface ExceptionConfig {
  name: string;
  body: string;
  module?: string;
}

export interface UniqueConstraint {
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
  objectType: 'dto' | 'model' | 'java' | 'enum';
}

export interface DTOBaseConfig extends IdentifiableElement {
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
  type: ModelAttributeType;
  name: string;
  length?: number | null;
  nullable?: boolean;
  unique?: boolean;
  primaryKey?: boolean;
  generationType?: GenerationType;
  defaultValue?: string;
  relation?: Relation;
  objectType?: 'dto' | 'model' | 'java' | 'enum';
}

export interface Relation {
  type: RelationshipTypes;
  cardinality: 'twoWay' | 'oneWay'
  entity: string;
  fieldName?: string;
  mappedBy?: string;
  referencedColumnName?: string;
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

export interface ControllerConfig extends IdentifiableElement {
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
  headers?: HttpHeader[];
  modelAttribute?: string;
  requestParams?: RequestParams[];
  requestBody?: BaseBody;
  responses?: {
    [statusCode: string]: Body;
  };
  pathVariables?: PathVariables[];
  multipartFiles?: MultipartFile[];
}

export interface MultipartFile {
  type: ParamsTypes;
  name: string;
  value?: string;
  isRequired: boolean
}

export interface RequestParams {
  type: ParamsTypes;
  name: string;
  value?: string;
  isRequired: boolean
}

export interface PathVariables {
  type: string;
  name: string;
  value?: string;
  isRequired: boolean;
}

export interface ISelectPermissions {
  label: string;
  value: string;
}

export interface EnumConfig extends IdentifiableElement {
  type: 'enum';
  name: string;
  module?: string;
  values: EnumValue[];
  attributes?: Attribute[];
}

export interface EnumValue {
  name: string;
  attributes?: string[];
}

export interface HttpHeader {
  type: ParamsTypes;
  header: HttpHeaderTypes;
  value: string;
  isRequired: boolean;
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

export interface SchemaField {
  type: string;
  objectType?: string,
  required?: boolean;
  identifier?: boolean;
  description?: string;
  example?: any;
  deprecated?: boolean;
  items?: SchemaField; // For array types
  properties?: { [key: string]: PropertySchemaField }; // For object types
}

export interface SchemaEnum {
  name?: string,
  values?: string[]
}

export interface PropertySchemaField extends SchemaField{
  minimum?: number;
  maximum?: number;
  pattern?: string;
  format?: string;
  enum?: SchemaEnum;
  default?: any;
}

export interface BaseBody extends IdentifiableElement {
  content: {
    [contentType: string]: SchemaContent; // e.g., "application/json"
  };
}

export interface Body extends BaseBody{
  description?: string;
  name: string;
  module?: string;
}

export interface RequestConfig extends Body {}

export interface ResponseConfig extends Body {
  statusCode: string,
  template: 'classic' | 'record'
}

export interface SchemaContent {
  schema: SchemaField;
}

export interface DeleteConfig {
  name: string,
  module?: string,
  type: ConfigTypes
}

export interface SerializationConfig {
  name: string,
  module?: string,
  type: 'dto' | 'model' | 'response',
  template: 'classic' | 'record'
}

export interface JsonConfig extends SerializationConfig {
  json: string
}

export interface SqlConfig extends SerializationConfig {
  sql: string
}

export interface XmlConfig extends SerializationConfig {
  xml: string
}

export interface DdlConfig extends SerializationConfig {
  ddl: string;
}

export type HttpMethod = (typeof HTTP_METHOD_TYPES)[number];
export type AttributeType = (typeof GENERIC_ATTRIBUTE_TYPES)[number];
export type ModelAttributeType = (typeof GENERIC_MODEL_ATTRIBUTE_TYPES)[number];
export type CollectionType = (typeof GENERIC_COLLECTION_TYPES)[number];
export type DatabaseTypes = (typeof DATABASE_TYPES)[number];
export type ObjectTypes = (typeof OBJECT_TYPES)[number];
export type ConfigTypes = (typeof CONFIG_TYPES)[number];
export type ProjectStructureStyle = (typeof STRUCT_TYPES)[number];
export type DisabledMethods = (typeof CRUD_DISABLED_OPTIONS)[number];
export type ParamsTypes = (typeof PARAMS_TYPES)[number];
export type RelationshipTypes = (typeof RELATIONSHIP_TYPES)[number];
export type HttpHeaderTypes = (typeof HTTP_HEADER_TYPES)[number];
export type GenerationType = (typeof GENERATION_TYPES)[number];