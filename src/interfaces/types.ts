
export interface ApiConfig {
  type: 'baseApi',
  apiName: string,
  group: string,
  artifact: string,
  description?: string,
  package?: string,
  name?: string
};

export interface ModelConfig {
  type: 'model',
  name: string,
  attributes: Attribut [],
  crud?: Crud
  relations?: Relation [],
};

export interface ControllerConfig {
  type: 'controller',
  name: string,
  basePath: string,
  actions: ControllerAction [] 
};

export interface Icontroller {
  type: 'icontroller',
  name: string
}

interface Attribut {
  type: string
  name: string,
  primary?: boolean,
  required?: boolean,
  unique: boolean,
  notNull: boolean
};

export interface Relation {
  relationType: string,
  entity: string,
  mappedBy?: string,
  joinColumn?: string,
  joinTable?: string,
  inverseJoinColumn?: string
};

export interface Crud {
  enabled: boolean,
  path: string,
  disabledMethods: string []
};

export interface Table {
  name: string,
  joinColumns: string,
  inverseJoinColumns: string
}

export interface ControllerAction {
  path: string,
  name: string,
  method: string,
  pathParams?: PathParams [],
  response: any
}

export interface PathParams {
  type: string,
  name: string
}

export type RenderContext<T = undefined> = {
  resourceConfig: T
  basePath: string
  baseConfig: ApiConfig
}