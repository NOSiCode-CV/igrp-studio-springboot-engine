
export interface ApiConfig {
  type: 'baseApi',
  apiName: string,
  group: string,
  artifact: string,
  description?: string,
  packageName?: string,
  name?: string
}


export interface ModelConfig {
  type: 'model',
  name: string,
  attributs: Attribut [],
  relations?: Relation [],
  crud?: Crud
}

export interface ControllerConfig {
  type: 'controller',
  name: string
}

interface Attribut {
  name: string,
  primary?: boolean,
  type: string
}

interface Relation {
  relationType: string,
  joinColumn: string
}

interface Crud {
  enabled: boolean,
  path: string,
  disabledMethods: string []
}