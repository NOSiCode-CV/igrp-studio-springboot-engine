import { ApiConfig, ModelConfig } from '../interfaces/types';
import {
  DIRECTORIES,
  GENERIC_IMPORTS,
  GENERIC_TYPES,
  PACKAGES,
  PROJECT_STRUCTURE_STYLE,
} from '../utils/constants';
import { getPackageNameFromConfig } from '../utils/helpers';
import { capitalize } from './stringHelper';

export function keyTypeModel(config: ModelConfig): any {
  if (config.primaryKey) {
    return `${config.name}PrimaryKey`;
  }
  const primaryKeyAttr = config.attributes?.find((p) => p.primaryKey === true);
  if (!primaryKeyAttr) {
    return null;
  }

  return GENERIC_TYPES.get(primaryKeyAttr.type)?.java.name;
}

export function modelImport(modelConfig: ModelConfig, baseConfig: ApiConfig): any {
  const imports: string[] = [];
  imports.push(`import cv.igrp.framework.stereotype.IgrpEntity;`);
  imports.push(`import jakarta.persistence.*;`);
  imports.push(`import lombok.*;`);

  const packageNameFromConfig = getPackageNameFromConfig(baseConfig);

  const isDDDStyle =
    baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN;

  if (modelConfig.revision === true) imports.push(`import org.hibernate.envers.Audited;`);

  modelConfig.attributes.forEach((attribute) => {
    const type = GENERIC_TYPES.get(attribute.type)?.java.name;

    if (
      type === 'LocalTime' ||
      type === 'LocalDate' ||
      type === 'LocalDateTime' ||
      type === 'ZoneDateTime' ||
      type === 'OffsetDateTime' ||
      type === 'Instant'
    ) {
      imports.push(`import java.time.${type};`);
    }

    if (type === 'BigInteger' || type === 'BigDecimal') imports.push(`import java.math.${type};`);

    if (attribute.nullable === false && !attribute.primaryKey) {
      if (type === 'String') imports.push('import jakarta.validation.constraints.NotBlank;');
      else imports.push('import jakarta.validation.constraints.NotNull;');
    }

    if (type === 'UUID') imports.push('import java.util.UUID;');

    if (attribute.skipFieldRevision) imports.push('import org.hibernate.envers.NotAudited;');

    if (attribute.defaultValue) imports.push('import org.hibernate.annotations.ColumnDefault;');

    if (attribute.relation?.type === 'OneToMany' || attribute.relation?.type === 'ManyToMany') {
      const collectionType =
        attribute.relation?.type === 'ManyToMany' ? 'java.util.Set' : 'java.util.List';

      imports.push(`import ${collectionType};`);

      if (collectionType === 'java.util.List') imports.push(`import java.util.ArrayList;`);
      if (collectionType === 'java.util.Set') imports.push(`import java.util.HashSet;`);

      if (attribute.relation?.cardinality === 'twoWay' && attribute.relation?.orphanRemoval) {
        imports.push(
          'import org.hibernate.annotations.OnDelete;',
          'import org.hibernate.annotations.OnDeleteAction;',
        );
      }
    }

    if (attribute.relation?.entity) {
      if (isDDDStyle) {
        if (modelConfig.module !== attribute.relation.module)
          imports.push(
            `import ${packageNameFromConfig}.${attribute.relation.module ?? DIRECTORIES.SHARED}.domain.${PACKAGES.MODELS}.${capitalize(attribute.relation.entity)};`,
          );
      } else
        imports.push(
          `import ${packageNameFromConfig}.${PACKAGES.MODELS}.${attribute.relation.entity.toLowerCase()}.${capitalize(attribute.relation.entity)};`,
        );
    }

    if (attribute.objectType) {
      const objectImports = GENERIC_IMPORTS(
        packageNameFromConfig,
        attribute.type,
        attribute.module,
      ).get(attribute.objectType);

      if (objectImports) {
        imports.push((isDDDStyle ? objectImports.java.domain : objectImports.java.technical) ?? '');
        return;
      }
    }

    const specialAttributeImports = GENERIC_IMPORTS(packageNameFromConfig, attribute.type).get(
      attribute.type,
    );

    if (specialAttributeImports?.java.technical)
      imports.push(specialAttributeImports.java.technical);
  });

  modelConfig.relationReference?.forEach((rel) => {
    if (rel.type === 'ManyToMany' || rel.type === 'OneToMany' || rel.type === 'ManyToOne') {
      const collectionType = rel.type === 'ManyToMany' ? 'java.util.Set' : 'java.util.List';
      if (collectionType === 'java.util.Set') imports.push(`import java.util.HashSet;`);
      imports.push(`import ${collectionType};`);

      if (rel.orphanRemoval) {
        imports.push(
          'import org.hibernate.annotations.OnDelete;',
          'import org.hibernate.annotations.OnDeleteAction;',
        );
      }
    }

    if (isDDDStyle) {
      if (modelConfig.module !== rel.module)
        imports.push(
          `import ${packageNameFromConfig}.${rel.module ?? DIRECTORIES.SHARED}.domain.${PACKAGES.MODELS}.${capitalize(rel.entity)};`,
        );
    } else
      imports.push(
        `import ${packageNameFromConfig}.${PACKAGES.MODELS}.${rel.entity.toLowerCase()}.${capitalize(rel.entity)};`,
      );
  });

  return [...new Set(imports)].join('\n');
}
