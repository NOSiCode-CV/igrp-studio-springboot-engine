import { EngineConfiguration } from '../index';
import { EngineConfigurationSettings } from '../../interfaces/types';

export default {
    register(config: EngineConfiguration, settings: EngineConfigurationSettings) {
        config.setEnvironment(settings.environment);
    }
};
