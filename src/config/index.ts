import { EngineConfigurationSettings } from '../interfaces/types';

export type EngineConfiguration = {
  environment?: string;
  setEnvironment: (env?: string) => void;
}

function initConfiguration() : EngineConfiguration {
  return {
    environment: undefined,
    setEnvironment(env?: string) {
      this.environment = env
    }
  }
}

export let config: Record<string, EngineConfiguration> = {};

export function setConfiguration(registerFn: (config: EngineConfiguration) => void, name?: string) {
  const configInstance: EngineConfiguration = initConfiguration();
  registerFn(configInstance);
  config[name ?? 'default'] = configInstance;
}

export function configurationAsObject(name?: string): EngineConfigurationSettings {
  return {
    environment: config[name ?? 'default'].environment,
  }
}
