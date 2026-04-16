import path from 'path';
import { revertCapitalize } from '../../helper/stringHelper';
import { DeleteConfig, RenderContext } from '../../interfaces/types';
import {
  CONFIG_TYPES,
  configTypeMapping,
  DIRECTORIES,
  PROJECT_STRUCTURE_STYLE,
} from '../../utils/constants';
import { checkIfModuleExist, getMainPath, loadConfig } from '../../utils/helpers';
import fs from 'fs-extra';

export const checkDependencyInModule = async function (context: RenderContext<DeleteConfig>) {
  //revertCapitalize para reverter o capitalize feito no name anteriormente
  const moduleName = context.resourceConfig.module ?? revertCapitalize(context.resourceConfig.name);
  //console.log('mod name:: ' + moduleName);

  const basePath = context.basePath;

  await checkIfModuleExist(basePath, moduleName);

  const errors: Array<{ message: string }> = [];

  for (const type of CONFIG_TYPES) {
    // Ignorar 'module'
    if (type === 'module') continue;

    const pathConfigType = path.join(
      basePath,
      DIRECTORIES.IGRPSTUDIO,
      moduleName,
      configTypeMapping[type],
    );
    //console.log('pathConfigType:: ' + pathConfigType);
    const configs = await loadConfig(pathConfigType);

    if (configs.length > 0) {
      // Se houver configurações
      errors.push({
        message: `The module "${moduleName}" cannot be deleted because there are "${type}" configurations!!!!`,
      });
    }
  }

  if (errors.length > 0) {
    throw errors;
  }

  const modulePathConf = path.join(basePath, DIRECTORIES.IGRPSTUDIO, moduleName);

  try {
    await fs.remove(modulePathConf);
    console.log(`Module "${moduleName}" has been deleted successfully.`);

    if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
      const modulePathSrc = path.join(
        basePath,
        getMainPath(context.baseConfig.group, context.baseConfig.packageName),
        moduleName,
      );
      const exists = await fs.pathExists(modulePathSrc);
      if (exists) {
        await fs.remove(modulePathSrc);
        console.log('Folders in DDD style has been deleted successfully: ', modulePathSrc);
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Error deleting module "${moduleName}": ${err.message}`);
    } else {
      throw new Error('An unknown error occurred while deleting the module.');
    }
  }
};
