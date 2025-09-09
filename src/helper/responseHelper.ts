import { ResponseConfig } from '../interfaces/types';
import { GENERIC_IMPORTS, PROJECT_STRUCTURE_STYLE } from '../utils/constants';
import { getPackageNameFromConfig } from '../utils/helpers';

export const resolveImportReponse = (
  resourceConfig: ResponseConfig,
  baseConfig: any,
): string | null => {
  if (!resourceConfig || !resourceConfig.content) {
    return null;
  }

  if (!baseConfig) return null;

  const module = resourceConfig?.module;

  const content =
    resourceConfig.content['application/json'] || resourceConfig.content['multipart/form-data'];

  const properties = content.schema?.properties;
  if (!properties) {
    return null;
  }

  const isDDDStyle =
    baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN;

  const imports = new Set<string>();
  const packageNameFromConfig = getPackageNameFromConfig(baseConfig);

  for (const [key, attr] of Object.entries(properties)) {
    // Se existir collectionType, utiliza o GENERIC_IMPORTS para obter o import específico
    if (attr.collectionType) {
      const genericImports = GENERIC_IMPORTS(packageNameFromConfig, attr.type);
      const collectionTypeImport = genericImports.get(attr.collectionType);
      const technicalImport = collectionTypeImport?.java?.technical;

      if (technicalImport) {
        imports.add(technicalImport);
      }
    }

    if (attr.objectType) {
      const genericImports = GENERIC_IMPORTS(packageNameFromConfig, attr.type, attr.module);
      const objectTypeImport = genericImports.get(attr.objectType);
      const importValue = isDDDStyle
        ? objectTypeImport?.java?.domain
        : objectTypeImport?.java?.technical;

      if (importValue) {
        imports.add(importValue);
      }
    }
  }

  return Array.from(imports)
    .filter((e) => e)
    .sort()
    .join('\n');
};
