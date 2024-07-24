
export interface ApiConfig {
  type: 'baseApi',
  apiName: string,
  group: string,
  artifact: string,
  description?: string,
  packageName?: string
}


export interface ModelConfig {
  type: 'model',
  name: string
}

export interface ControllerConfig {
  type: 'controller',
  name: string
}
