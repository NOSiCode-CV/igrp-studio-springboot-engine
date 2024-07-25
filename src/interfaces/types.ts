
export interface ApiConfig {
  type: 'baseApi',
  apiName: string,
  group: string,
  artifact: string,
  description?: string,
  package?: string,
  name?: string
}


export interface ModelConfig {
  type: 'model',
  name: string,
  attributs: Attribut [],
  crud?: Crud
  package?: string,
  relations?: Relation [],
}

export interface ControllerConfig {
  type: 'controller',
  name: string
}

interface Attribut {
  type: string
  name: string,
  primary?: boolean,
  required?: true
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