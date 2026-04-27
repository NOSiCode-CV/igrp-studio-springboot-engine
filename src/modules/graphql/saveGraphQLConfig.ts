import path from 'path';
import fs from 'fs-extra';
import {GraphQLSchemaConfig} from '../../interfaces/types';
import {DIRECTORIES, EXTENSIONS} from '../../utils/constants';
import {replaceTemplate} from '../../utils/helpers';
import {capitalizeJavaStyle} from '../../helper/stringHelper';

/**
 * Saves the GraphQL schema configuration to .igrpstudio/<module>/graphql/<Name>.json.
 * Always overwrites (manifest is always up-to-date).
 */
export const saveGraphQLConfig = async (
  config: GraphQLSchemaConfig,
  basePath: string,
): Promise<void> => {
  const module = config.module ?? DIRECTORIES.SHARED;
  const name = capitalizeJavaStyle(config.name);

  const configDir = path.join(
    basePath,
    replaceTemplate(DIRECTORIES.CONFIG_GRAPHQL, { module }),
  );

  await fs.ensureDir(configDir);

  const outputPath = path.join(configDir, `${name}${EXTENSIONS.JSON}`);

  await fs.writeFile(outputPath, JSON.stringify(config, null, 2), 'utf-8');
};
