import { validateAnnotations } from '../utils/helpers';

export function resolvePackage(fullPath: any, basePath: any): string {
  if (!fullPath || !basePath) {
    throw new Error('Both fullPath and basePath are required to resolve the package.');
  }

  // Normalize paths to handle both Unix and Windows formats
  const normalizedFullPath = fullPath.replace(/\\/g, '/');
  const normalizedBasePath = basePath.replace(/\\/g, '/');

  // Ensure the basePath ends with a trailing slash for accurate replacement
  const formattedBasePath = normalizedBasePath.endsWith('/')
    ? normalizedBasePath
    : normalizedBasePath + '/';

  // Remove the basePath portion from the full path
  let relativePath: string;
  if (normalizedFullPath.startsWith(formattedBasePath)) {
    relativePath = normalizedFullPath.slice(formattedBasePath.length);
  } else {
    return '';
  }

  // Extract only the meaningful parts of the path for the Java package
  return relativePath
    .split('/')
    .filter((segment) => !['src', 'main', 'test', 'java'].includes(segment)) // Exclude common directory names
    .join('.');
}

export function resolveAnnotations(attribute: any, basePath: any): string {
  const annotations = [];

  validateAnnotations(attribute);

  // JSON / XML annotations
  if (attribute.jsonAttributeName) {
    annotations.push(`@JsonProperty("${attribute.jsonAttributeName}")`);
  }

  if (attribute.xmlAttributeName) {
    annotations.push(`@JacksonXmlProperty(localName = "${attribute.jsonAttributeName}")`);
  }

  // Required validation
  if (attribute.required) {
    if (attribute.type === 'string' && (!attribute.collectionType || attribute.collectionType === 'none')) {
      annotations.push(`@NotBlank(message = "The field <${attribute.name}> is required")`);
    } else {
      annotations.push(`@NotNull(message = "The field <${attribute.name}> is required")`);
      if (attribute.collectionType === 'list')
        annotations.push(`@NotEmpty(message = "The field <${attribute.name}> must not be empty")`);
    }
  }

  // String-specific validations
  if (attribute.type === 'string') {
    if (attribute.minLength !== undefined)
      annotations.push(
        `@Size(${[
          `min = ${attribute.minLength}, message = "The field length <${attribute.name}> must be at least ${attribute.minLength} characters"`,
        ]
          .filter(Boolean)
          .join(', ')})`,
      );
    if (attribute.maxLength !== undefined)
      annotations.push(
        `@Size(${[
          `max = ${attribute.maxLength}, message = "The field length <${attribute.name}> cannot be more than ${attribute.maxLength} characters"`,
        ]
          .filter(Boolean)
          .join(', ')})`,
      );
    if (attribute.regex) {
      annotations.push(
        `@Pattern(message = "Invalid value format for field <${attribute.name}>.", regexp = "${attribute.regex.replace(/\\/g, '\\\\')}")`,
      );
    }
  }

  // Number-specific validations
  if (['Integer', 'Long', 'Double', 'Float', 'BigDecimal', 'BigInteger'].includes(attribute.type)) {
    if (attribute.minLength !== undefined) {
      annotations.push(`@Min(${attribute.minLength})`);
    }
    if (attribute.maxLength !== undefined) {
      annotations.push(`@Max(${attribute.maxLength})`);
    }
    if (attribute.positive) {
      annotations.push(
        attribute.minLength === 0
          ? `@PositiveOrZero(message = "<${attribute.name}> must be greater than or equal to zero")`
          : `@Positive(message = "<${attribute.name}> must be greater than zero")`,
      );
    }
  }

  // Date-specific validations
  if (['Date', 'LocalDate', 'LocalDateTime', 'ZonedDateTime'].includes(attribute.type)) {
    if (attribute.before) {
      annotations.push(
        `@Past(message = "The date <${attribute.name}> must be before today's date")`,
      );
    }
    if (attribute.after) {
      annotations.push(
        `@Future(message = "The date <${attribute.name}> must be after today's date")`,
      );
    }
  }

  // Email validation
  if (attribute.isEmail) {
    annotations.push(`@Email(message = "Invalid email format for field <${attribute.name}>")`);
  }

  // URL validation
  if (attribute.isUrl) {
    annotations.push(`@URL(message = "Invalid URL format for field <${attribute.name}>")`);
  }

  // Return the generated annotations as a joined string
  return annotations.join('\n\t');
}
