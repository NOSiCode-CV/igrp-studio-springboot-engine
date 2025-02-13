# Application Execution Guide

## Requirements

To run this application, ensure you have the following installed:

- [Nodejs](https://nodejs.org/en/download/package-manager/current)

## Installation and Execution Steps

### 1. Download the Project:

Clone or download the project to your local machine.

### 2. Install Dependencies:

From the project's root directory, run the following command to install all necessary dependencies:

```npm install```

### 3. Compile the Project:

Compile the project by running the following command

```npm run build```

### Run Tests:

Once the project has been compiled, you can test the various functions of the application by executing the following command:

```npm test fileNameTest``` (you can find all tests files in the "`__test__`" directory)

fileNameTest should be the prefix to the .test.ts extension. The file in the test directory would be **fileNameTest**.test.ts

### Publishing of the package (FOR THE TRAINING ONLY):

Before publishing the package you must change few parameters in `package.json` file:

The version to `0.0.1` with your name without spaces or special characters attached to it.

The author with your name and your organization.

```json
{
  "name": "@igrp/spring-engine",
  "version": "0.0.1-<YOUR_NAME_WITHOUT_SPACES>",
  "description": "Spring API Creation Engine",
  "main": "dist/index.cjs.js",
  "module": "dist/index.es.js",
  "types": "dist/index.d.ts",
  "files": [
    "/dist"
  ],
  "scripts": {
    "test": "jest",
    "build": "tsc && vite build",
    "start": "tsc && vite",
    "deploy": "npm publish --registry=https://sonatype.nosi.cv/repository/igrp/"
  },
  "repository": {
    "type": "git",
    "url": "http://git.nosi.cv/igrp-3_0/spring-engine.git"
  },
  "keywords": [
    "Spring",
    "Engine",
    "TypeScript",
    "Handlebars",
    "API",
    "API-Rest"
  ],
  "author": "<YOUR_NAME> - <YOUR_ORGANIZATION>",
  "license": "ISC",
  "dependencies": {
    // ...
  },
  "devDependencies": {
    // ...
  },
  "type": "commonjs",
  "exports": {
    "./types": {
      "import": "./dist/interfaces/types.d.ts"
    },
    ".": {
      "import": "./dist/index.es.js",
      "require": "./dist/index.cjs.js",
      "types": "./dist/index.d.ts",
      "constants": "./dist/utils/constants.d.ts"
    }
  }
}
```

After changing the file `package.json`, you must run the following command:

```npm run build```

If everything succeed you can now run this command:

```npm run deploy```

### Important Notes

- To get accurate test results, ensure that the tests not of current interest are commented out. This will help you focus on the results of the specific tests you wish to evaluate.

### Examples of use as a package:

#### Install the package:

```yarn add @igrp/spring-engine@latest --registry=https://sonatype.nosi.cv/repository/igrp/```

#### You can use this package to:

- Create a new API: This function initializes and sets up the base structure for an API based on the provided configuration.

```java
@param {ApiConfig} config - The configuration object containing all the basic API information.
@param {string} basePath - The output path where the API will be created. This path must be empty.
```

```typescript
import { newApi } from "@igrp/spring-engine"
import { ApiConfig } from "@igrp/spring-engine/dist/interfaces/types";

const baseConfig: ApiConfig = {
  type: 'springboot',
  apiName: 'demoTechnical',
  group: 'cv.nosi',
  artifact: 'users',
  description: 'Demo project for Spring Boot',
  database: 'Postgresql',
  projectStructureStyle: 'technical',
  enableObservability: false,
  igrpCoreVersion: "0.0.1-20250115.133643-3"
}
const basePath = 'your/absolute path/'

const createApi = async () => {
 try {
   await newApi(baseConfig, basePath)
 }
 catch(error) {
   console.log(error)
 }
}
```

- Add a new Model or editing an existing model - This function creates a model based on the provided configuration and saves it to the specified API base path.
  It also generates the associated CRUD operations if enabled in the configuration.

```java
@param {ModelConfig} config - Model configuration object, which includes the name and other details of the model.
@param {string} basePath - Application base path where the model will be saved and generated to the API.
```

```typescript
import { addModel } from '@igrp/spring-engine';
import { ModelConfig } from '@igrp/spring-engine/dist/interfaces/types';

//Model with simple primary key
const config: ModelConfig = {
  type: 'model',
  name: 'Animal',
  tableName: 'animal',
  module: 'core',
  uniqueConstraints: [
    {
      name: 'UniqueAnimalName',
      columns: ['name']
    }
  ],
  attributes: [
    {
      type: 'integer',
      name: 'id',
      primaryKey: true,
      generationType: 'IDENTITY',
      nullable: false
    },
    {
      type: 'string',
      name: 'name',
      length: 255,
      nullable: false
    },
    {
      type: 'string',
      name: 'species',
      length: 100,
      nullable: false
    },
    {
      type: 'date',
      name: 'birthDate',
      nullable: true
    }
  ],
  crud: false,
  audit: false
};

//Model with compound primary keys
const config2: ModelConfig = {
  type: 'model',
  name: 'owner',
  tableName: 'owner',
  module: 'core',
  attributes: [
    {
      type: 'integer',
      name: 'id',
      nullable: false
    },
    {
      type: 'string',
      name: 'name',
      length: 255,
      nullable: false
    },
    {
      type: 'string',
      name: 'contactNumber',
      length: 20,
      nullable: false
    }
  ],
  primaryKey: [
    {
      name: 'id',
      type: 'integer',
    },
    {
      name: 'contactNumber',
      type: 'String',
      length: 7,
    },
  ],
  crud: false,
  audit: true
};

const basePath = 'your_absolute_project_path';

const createModel = async () => {
  try {
    await addModel(config, basePath);
  } catch (error) {
    console.error(error);
  }
};
```

- Adds CRUD operations to an existing model - This function allows you to add CRUD (Create, Read, Update, Delete) functionality to a model. The CRUD can be added either when the model is initially created or by calling this function later.

```java
@param {ModelConfig} config - The model configuration object, including the model name and CRUD details.
@param {string} basePath - The base path of the application where the model and its CRUD operations will be generated and saved.
```
```typescript
const config: ModelConfig = {
  type: 'model',
  name: 'User',
  attributes: [
    { type: 'long', name: 'userID', primaryKey: true, generationType: "SEQUENCE" },
    { type: 'string', name: 'email', length: 30, unique: true, nullable: false, required: true },
    { type: 'string', name: 'password', unique: false, length:30, nullable: true, required: true }
  ],
  crud: true // Enable CRUD
};

const basePath = 'your_absolute_project_path';

const addUserCrud = async () => {
  try {
    await addCrud(config, basePath);
    console.log('CRUD operations for User have been successfully added.');
  } catch (error) {
    console.error('Error adding CRUD operations:', error);
  }
};
```
All methods of this crud will be available at the url http://localhost:8080/user

- Add Relationship - Adds a relationship between the specified models.
```java
This function modifies the configuration of an existing model to include a new relationship. 
The relationship is defined in the `relation` property type of the attribute in `ModelConfig` object.
All models involved in the relationship should already be created. 
The function will update the model configuration file by adding the `relation` type attribute and then call the `addModel` function to apply the changes.
@param {ModelConfig} config - The model configuration object, including the relationship details.
@param {string} basePath - The base path of the application where the model configuration will be updated and saved.
```
```ts
import { addModel } from '@igrp/spring-engine';
import { ModelConfig } from "@igrp/spring-engine/dist/interfaces/types";

const config: ModelConfig = {
  type: 'model',
  name: 'Order',
  attributes: [
    { type: 'long', name: 'orderID', primaryKey: true, generationType:"SEQUENCE" },
    { type: 'string', name: 'description', nullable: false },
    {
      type: 'relation',
      name: 'documents',
      relation: {
        type: 'OneToMany',
        cardinality: 'twoWay',
        entity: 'Document',
        mappedBy: 'order',
        joinTable: 'order_document'
      },
      nullable: true
    }
  ]
};
 
const basePath = 'your_absolute_project_path';

const addOrderRelationship = async () => {
  try {
    await addModel(config, basePath);
    console.log('Relationship between Order and Documents has been successfully added.');
  } catch (error) {
    console.error('Error adding relationship:', error);
  }
};
```

- Delete Element - This function removes an element configuration and its related files based on the provided configuration.
  It ensures that the element is properly deleted from the specified API base path.

```java
@param {DeleteConfig} config - The deletion configuration object, which primarily includes the type, module (if present) and name of the element to be deleted.
@param {string} basePath - The base path of the application where the element and related files are located.
```

```ts
import { deleteElement } from '@igrp/spring-engine';
import { DeleteConfig } from '@igrp/spring-engine/dist/interfaces/types';

const config: DeleteConfig = {
  name: 'Teste',
  type: 'dto',
};
const basePath = 'C://your_project_path';

const removeElement = async () => {
  try {
    await deleteElement(config, basePath);
  } catch (error) {
    console.error(error);
  }
};
```

- Add a new DTO or editing an existing DTO - This function creates a DTO based on the provided configuration and saves it to the specified API base path.

```ts
/**
 * Generates and saves a DTO to the API.
 * This function creates a DTO based on the provided configuration and saves it to the specified API base path.
 *
 * @param {DTOConfig} config - DTO configuration object, which includes the name and other details of the DTO.
 * @param {string} basePath - Application base path where the DTO will be saved and generated to the API.
 *
 * @throws {Error} Will throw an error if the DTO configuration is invalid or the DTO name is missing.
 * @throws {Error} Will throw an error if the base path is not provided.
 *
 */
// Example usage:
import { addDTO } from "spring-engine";
import { DTOConfig } from "spring-engine/dist/interfaces/types";
const config: DTOConfig = {
  type: 'dto',
  name: 'User',
  template: 'classic',
  attributes: [
    {
      type: 'string',
      objectType: 'java',
      name: 'username',
      required: true
    },
    {
      type: 'string',
      objectType: 'java',
      name: 'email',
      required: true,
      isEmail: true
    },
    {
      type: 'string',
      objectType: 'java',
      name: 'password',
      required: true,
      regex: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$'
    },
    {
      type: 'string',
      objectType: 'java',
      name: 'roles',
      required: false,
      collectionType: 'list'
    },
    {
      type: 'date',
      objectType: 'java',
      name: 'lastLogin',
      required: false
    }
  ]
};
 
const createDTO = async () => {
  try {
    await addDTO(config, basePath);
  } catch (error) {
    console.error(error);
  }
};
/*
* when ns=model it will check if that model exist in json config.
* when ns=dto it will check if that dto exist in json config
* when ns=java it will check if that java class exists on the java allowed list 
*/
// JAVA LIST

export const JAVA_TYPES: Map<string, TypeMetadata> = new Map(Object.entries({
  'boolean': { name: 'boolean', primitive: true },
  'short': { name: 'short', primitive: true },
  'char': { name: 'char', primitive: true },
  'int': { name: 'int', primitive: true },
  'long': { name: 'long', primitive: true },
  'float': { name: 'float', primitive: true },
  'double': { name: 'double', primitive: true },
  'Boolean': { name: 'Boolean', primitive: false },
  'Short': { name: 'Short', primitive: false },
  'Integer': { name: 'Integer', primitive: false },
  'Long': { name: 'Long', primitive: false },
  'Double': { name: 'Double', primitive: false },
  'String': { name: 'String', primitive: false },
  'Character': { name: 'Character', primitive: false },
  'BigDecimal': { name: 'BigDecimal', primitive: false, namespace: 'java.math', },
  'BigInteger': { name: 'BigInteger', primitive: false, namespace: 'java.math' },
  'LocalDate': { name: 'LocalDate', primitive: false, namespace: 'java.time' },
  'LocalDateTime': { name: 'LocalDateTime', primitive: false, namespace: 'java.time' },
  'LocalTime': { name: 'LocalTime', primitive: false, namespace: 'java.time' },
  'ZoneDateTime': { name: 'ZoneDateTime', primitive: false, namespace: 'java.time' },
  'OffsetDateTime': { name: 'OffsetDateTime', primitive: false, namespace: 'java.time' },
  'Instant': { name: 'Instant', primitive: false, namespace: 'java.time' },
  'List': { name: 'List', primitive: false, namespace: 'java.util', },
  'Object': { name: 'Object', primitive: false },
}));
```

- Add new controller - This function creates a controller based on the provided configuration and integrates it into the specified API base path.
  It also generates the corresponding service interface for the controller actions defined.

```java
@param {ControllerConfig} config - The controller configuration object, including the controller name, base path, and actions.
@param {string} basePath - The base path of the application where the controller will be generated and saved.
```

```ts
import { addController } from '@igrp/spring-engine';
import { ControllerConfig } from '@igrp/spring-engine/dist/interfaces/types';

const controllerConfig: ControllerConfig = const config: ControllerConfig = {
  type: 'controller',
  name: 'User',
  basePath: 'users',
  actions: [
    {
      actionName: 'getUserById',
      path: 'get-user',
      method: 'GET',
      pathVariables: [
        {
          type: 'string',
          name: 'id',
          isRequired: true
        },
      ],
      responses: {
        '200': {
          name: 'UserResponse',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'Unique ID of the user',
                  },
                  username: {
                    type: 'string',
                    description: 'Username of the user',
                  },
                  email: {
                    type: 'string',
                    description: 'Email address of the user',
                  },
                },
              },
            },
          },
        },
        '404': {
          name: 'UserNotFound',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    description: 'Error message indicating user not found',
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      actionName: 'createUser',
      path: 'create-user',
      method: 'POST',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                username: {
                  type: 'string',
                  description: 'Username of the new user',
                  required: true
                },
                email: {
                  type: 'string',
                  description: 'Email address of the new user',
                  required: true
                },
                password: {
                  type: 'string',
                  description: 'Password for the new user',
                  required: true
                },
              },
            },
          },
        },
      },
      responses: {
        '201': {
          name: 'UserCreatedResponse',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'Unique ID of the created user',
                  },
                  username: {
                    type: 'string',
                    description: 'Username of the created user',
                  },
                  email: {
                    type: 'string',
                    description: 'Email of the created user',
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      actionName: 'updateUser',
      path: 'update-user',
      method: 'PUT',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'UserDTO',
              objectType: 'dto'
            },
          },
        },
      },
      responses: {
        '201': {
          name: 'UserUpdatedResponse',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: {
                    type: 'string',
                    description: 'Username of the updated user',
                  },
                  email: {
                    type: 'string',
                    description: 'Email of the updated user',
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      actionName: 'deleteUser',
      path: 'delete-user',
      method: 'DELETE',
      pathVariables: [
        {
          type: 'string',
          name: 'id',
          isRequired: true,
        },
      ],
      responses: {
        '200': {
          name: 'UserDeleted',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  deleted: {
                    type: 'boolean',
                    description: 'Boolean value to confirm the deletion',
                  },
                },
              },
            }
          },
        },
        '404': {
          name: 'UserNotFound',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    description: 'Error message indicating user not found',
                  },
                },
              },
            },
          },
        },
      },
    },
  ],
};

const applicationBasePath = 'C://your_project_path';

const generateUserController = async () => {
  try {
    await addController(config, applicationBasePath);
    console.log('UserController has been successfully generated.');
  } catch (error) {
    console.error('Error generating UserController:', error);
  }
};
```
Note: To access the generated endpoints, it is necessary to implement the methods declared in the controller interface (for technical style) or query/command handlers (for domain style) automatically generated. This implementation is done by the programmer.
The implemented methods will be available at:
```ts
GET: http://localhost:8080/users/get-user/<id>
POST: http://localhost:8080/users/create-user
PUT: http://localhost:8080/users/update-user
DELETE: http://localhost:8080/users/delete-user/<id>
```

- Create a new module: This function initializes and sets up the module structure for an API based on the provided configuration.

```java
@param {ModuleConfig} config - The module configuration object, including the module name.
@param {string} basePath - The base path of the application where the module will be generated.
```

```ts
import { addModule } from '../src';
import { ModuleConfig } from '../src/interfaces/types';

const config: ModuleConfig = {
  type: 'module',
  name: 'external',
};

const applicationBasePath = 'C://your_project_path';

const generateModule = async () => {
  try {
    await addModule(config, applicationBasePath);
    console.log('Module has been successfully generated.');
  } catch (error) {
    console.error('Error generating module:', error);
  }
};

```

- Create a new response: This function initializes and sets up the response configuration for an API based on the provided configuration.

```java
@param {ResponseConfig} config - The response configuration object.
@param {string} basePath - The base path of the application where the response will be generated and saved.
```

```ts
import { addResponse } from '../src';
import { ResponseConfig } from '../src/interfaces/types';

const config: ResponseConfig = {
  template: 'record',
  statusCode: '200',
  module: 'core',
  name: 'NewResponse',
  description: 'OK',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          newField1: {
            type: 'string',
            description: 'New field 1',
            example: 'newValue1',
            default: 'newValue'
          }
        }
      }
    }
  }
};

const applicationBasePath = 'C://your_project_path';

const generateResponse = async () => {
  try {
    await addResponse(config, applicationBasePath);
    console.log('Response has been successfully generated.');
  } catch (error) {
    console.error('Error generating response:', error);
  }
};
```
- Create a new enum: This function initializes and sets up the enum configuration for an API based on the provided configuration.

```java
@param {EnumConfig} config - The enum configuration object, including the enum name and its values.
@param {string} basePath - The base path of the application where the enum will be generated.
```

```ts
import { addEnum } from '../src';
import { EnumConfig } from '../src/interfaces/types';

const config: EnumConfig = {
  type: 'enum',
  name: 'Level',
  module: 'core',
  values: [
    { name: 'HIGH', attributes: ['1', 'High'] },
    { name: 'LOW', attributes: ['0', 'Low'] }
  ],
  attributes: [{ name: 'code', type: 'string' }, { name: 'description', type: 'string' }]
};

const applicationBasePath = 'C://your_project_path';

const generateEnum = async () => {
  try {
    await addEnum(config, applicationBasePath);
    console.log('Enum has been successfully generated.');
  } catch (error) {
    console.error('Error generating enum:', error);
  }
};
```

### Types

```ts
export interface TypeMetadata {
  name: string;
  primitive: boolean;
  namespace?: string;
}
```
- **TypeMetadata**: Represents metadata for a data type, indicating whether it is a primitive type and optionally specifying a namespace.

```ts
export interface ApiConfig extends BaseApiConfig {
  packageName: string;
}
```
- **ApiConfig**: Extends `BaseApiConfig` to include the package name for the API.

```ts
export interface BaseApiConfig {
  type: 'springboot';
  apiName: string;
  group: string;
  artifact: string;
  database: DatabaseTypes;
  description?: string;
  package?: string;
  projectStructureStyle: ProjectStructureStyle;
  name?: string;
  enableObservability: boolean;
  igrpCoreVersion: string;
}
```
- **BaseApiConfig**: Defines the fundamental configuration for an API, including details about the project structure, database, and observability settings.

```ts
export interface ModelConfig {
  type: 'model';
  name: string;
  tableName: string;
  attributes: Attribute[];
  uniqueConstraints?: UniqueConstraint[];
  indexes?: EntityIndex[];
  primaryKey?: PrimaryKey[];
  crud?: boolean;
  audit?: boolean;
  module?: string;
}
```
- **ModelConfig**: Represents the configuration for a data model, including attributes, constraints, indexes, and CRUD/audit settings.

```ts
export interface EntityIndex {
  name: string;
  columns: string[];
  unique: boolean;
}
```
- **EntityIndex**: Defines an index on a model entity with specified columns and uniqueness constraint.

```ts
export interface ModuleConfig {
  type: 'module';
  name: string;
}
```
- **ModuleConfig**: Represents the configuration for a module, including its name.

```ts
export interface PermissionConfig {
  type: 'permission';
  name: string;
  description: string;
  endpoints: IEndpoint[];
}
```
- **PermissionConfig**: Configures permissions, including associated endpoints and descriptions.

```ts
export interface IEndpoint {
  type: string;
  resource: string;
  method: HttpMethod | DisabledMethods;
  path: string;
}
```
- **IEndpoint**: Represents an API endpoint, including HTTP method, resource name, and path.

```ts
export interface JavaType {
  name: string;
  namespace?: string;
}
```
- **JavaType**: Defines a Java type with an optional namespace.

```ts
export interface JavaAttribute {
  name: string;
  type: string | AttributeType;
  objectType: 'dto' | 'model' | 'java' | 'enum';
  required: boolean;
  before?: boolean;
  after?: boolean;
  positive?: boolean;
  minLength?: number;
  maxLength?: number;
  regex?: string;
  collectionType?: CollectionType;
  isEmail?: boolean;
  isUrl?: boolean;
  primaryKey?: boolean;
  jsonAttributeName?: string;
  xmlAttributeName?: string;
}
```
- **JavaAttribute**: Represents an attribute in Java objects, supporting validation rules and optional metadata.

```ts
export interface DTOBaseConfig {
  type: ObjectTypes;
  name: string;
  module?: string;
}
```
- **DTOBaseConfig**: Defines the base configuration for a Data Transfer Object (DTO), including its type and module.

```ts
export interface DTOConfig extends DTOBaseConfig {
  template: 'classic' | 'record';
  attributes: JavaAttribute[];
}
```
- **DTOConfig**: Extends `DTOBaseConfig` to include a template type and associated attributes.

```ts
export interface HandlerConfig extends DTOConfig {
  response: string;
}
```
- **HandlerConfig**: Extends `DTOConfig` to define a handler with a specific response type.

```ts
export interface ExceptionConfig {
  name: string;
  body: string;
  module?: string;
}
```
- **ExceptionConfig**: Represents a custom exception configuration, specifying its name and body.

```ts
export interface UniqueConstraint {
  name: string;
  columns: string[];
}
```
- **UniqueConstraint**: Defines a uniqueness constraint on specified columns in a model.

```ts
export interface Icontroller {
  type: 'icontroller';
  name: string;
}
```
- **Icontroller**: Represents a controller interface configuration.

```ts
export interface PrimaryKey extends Pick<Attribute, 'type' | 'name' | 'length'> {}
```
- **PrimaryKey**: Represents the primary key of a model, inheriting type, name, and length properties from `Attribute`.

```ts
export interface Attribute {
  type: ModelAttributeType;
  name: string;
  length?: number | null;
  nullable?: boolean;
  unique?: boolean;
  primaryKey?: boolean;
  generationType?: GenerationType;
  defaultValue?: string;
  relation?: Relation;
  objectType?: 'dto' | 'model' | 'java' | 'enum';
}
```
- **Attribute**: Defines an attribute for a model, including its type, constraints, and relationships.

```ts
export interface Relation {
  type: RelationshipTypes;
  cardinality: 'twoWay' | 'oneWay';
  entity: string;
  fieldName?: string;
  mappedBy?: string;
  referencedColumnName?: string;
  joinTable?: string;
  inverseJoinColumn?: string;
}
```
- **Relation**: Specifies relationships between entities, including cardinality and foreign key details.

```ts
export interface Crud {
  enabled: boolean;
  path: string;
  permissions?: IModelPermission[];
  disabledMethods: DisabledMethods[];
}
```
- **Crud**: Defines CRUD operations with permissions and disabled methods.

```ts
export interface IModelPermission {
  method: DisabledMethods;
  permissions: string[];
}
```
- **IModelPermission**: Represents permissions for a specific model operation.

```ts
export interface ControllerConfig {
  type: 'controller';
  name: string;
  basePath: string;
  actions: ControllerAction[];
  module?: string;
}
```
- **ControllerConfig**: Defines a controller's structure, including its actions and associated module.

```ts
export interface DeleteConfig {
  name: string;
  module?: string;
  type: ConfigTypes;
}
```
- **DeleteConfig**: Represents configuration for deletion operations within a module.

```ts
export interface SchemaContent {
  schema: SchemaField;
}
```
- **SchemaContent**: Defines the structure of a schema, encapsulating a `SchemaField` that describes the field properties.

```ts
export interface ResponseConfig extends Body {
  statusCode: string,
  template: 'classic' | 'record'
}
```
- **ResponseConfig**: Extends `Body` to include an HTTP status code and a response template type.

```ts
export interface RequestConfig extends Body {}
```
- **RequestConfig**: A type alias extending `Body`, representing the configuration of an HTTP request body.

```ts
export interface Body extends BaseBody{
  description?: string;
  name: string;
  module?: string;
}
```
- **Body**: Extends `BaseBody`, adding optional description and module properties, along with a mandatory name field.

```ts
export interface BaseBody {
  content: {
    [contentType: string]: SchemaContent; // e.g., "application/json"
  };
}
```
- **BaseBody**: Represents the base structure of an HTTP request/response body, mapping content types to their schema definitions.

### Types

```ts
export interface DeleteConfig {
  name: string,
  module?: string,
  type: ConfigTypes
}
```
- **DeleteConfig**: Represents the configuration for a delete operation, specifying the name, module, and configuration type.

```ts
export interface SchemaContent {
  schema: SchemaField;
}
```
- **SchemaContent**: Defines the structure of a schema, encapsulating a `SchemaField` that describes the field properties.

```ts
export interface ResponseConfig extends Body {
  statusCode: string,
  template: 'classic' | 'record'
}
```
- **ResponseConfig**: Extends `Body` to include an HTTP status code and a response template type.

```ts
export interface RequestConfig extends Body {}
```
- **RequestConfig**: A type alias extending `Body`, representing the configuration of an HTTP request body.

```ts
export interface Body extends BaseBody{
  description?: string;
  name: string;
  module?: string;
}
```
- **Body**: Extends `BaseBody`, adding optional description and module properties, along with a mandatory name field.

```ts
export interface BaseBody {
  content: {
    [contentType: string]: SchemaContent; // e.g., "application/json"
  };
}
```
- **BaseBody**: Represents the base structure of an HTTP request/response body, mapping content types to their schema definitions.

```ts
export interface ControllerConfig {
  type: 'controller';
  name: string;
  basePath: string;
  actions: ControllerAction[];
  module?: string;
}
```
- **ControllerConfig**: Defines the structure for a controller, including its name, base path, actions, and optional module.

```ts
export interface ControllerAction {
  path?: string;
  permissions?: string[];
  actionName: string;
  method: HttpMethod;
  headers?: HttpHeader[];
  modelAttribute?: string;
  requestParams?: RequestParams[];
  requestBody?: BaseBody;
  responses?: {
    [statusCode: string]: Body;
  };
  pathVariables?: PathVariables[];
  multipartFiles?: MultipartFile[];
}
```
- **ControllerAction**: Represents an action within a controller, defining attributes such as path, permissions, HTTP method, request parameters, and response handling.

```ts
export interface MultipartFile {
  type: ParamsTypes;
  name: string;
  value?: string;
  isRequired: boolean;
}
```
- **MultipartFile**: Represents a file parameter in a multipart request, specifying its type, name, and whether it's required.

```ts
export interface RequestParams {
  type: ParamsTypes;
  name: string;
  value?: string;
  isRequired: boolean;
}
```
- **RequestParams**: Defines request parameters, including their type, name, optional value, and whether they are required.

```ts
export interface PathVariables {
  type: string;
  name: string;
  value?: string;
  isRequired: boolean;
}
```
- **PathVariables**: Represents variables found in the request path, detailing their type, name, and required status.

```ts
export interface EnumConfig {
  type: 'enum';
  name: string;
  module?: string;
  values: EnumValue[];
  attributes?: Attribute[];
}
```
- **EnumConfig**: Defines an enumeration, specifying its name, module, values, and optional attributes.

```ts
export interface EnumValue {
  name: string;
  attributes?: string[];
}
```
- **EnumValue**: Represents a value within an enumeration, optionally including additional attributes.

```ts
export interface HttpHeader {
  type: ParamsTypes;
  header: HttpHeaderTypes;
  value: string;
  isRequired: boolean;
}
```
- **HttpHeader**: Defines an HTTP header, specifying its type, header name, value, and whether it is required.

```ts
export interface SchemaField {
  type: string;
  objectType?: string;
  required?: boolean;
  identifier?: boolean;
  description?: string;
  example?: any;
  deprecated?: boolean;
  items?: SchemaField; // For array types
  properties?: { [key: string]: PropertySchemaField }; // For object types
}
```
- **SchemaField**: Represents a field in a schema, including its type, object type, optional properties, and constraints.

```ts
export interface SchemaEnum {
  name?: string;
  values?: string[];
}
```
- **SchemaEnum**: Defines an enumeration schema, listing possible values.

```ts
export interface PropertySchemaField extends SchemaField {
  minimum?: number;
  maximum?: number;
  pattern?: string;
  format?: string;
  enum?: SchemaEnum;
  default?: any;
}
```
- **PropertySchemaField**: Extends `SchemaField` to add constraints such as minimum and maximum values, patterns, and format specifications.

```ts
export type HttpMethod = (typeof HTTP_METHOD_TYPES)[number];
```
- **HttpMethod**: Represents an HTTP method type extracted from the predefined `HTTP_METHOD_TYPES` array.

```ts
export type AttributeType = (typeof GENERIC_ATTRIBUTE_TYPES)[number];
```
- **AttributeType**: Defines a generic attribute type derived from `GENERIC_ATTRIBUTE_TYPES`.

```ts
export type ModelAttributeType = (typeof GENERIC_MODEL_ATTRIBUTE_TYPES)[number];
```
- **ModelAttributeType**: Represents a model attribute type taken from `GENERIC_MODEL_ATTRIBUTE_TYPES`.

```ts
export type CollectionType = (typeof GENERIC_COLLECTION_TYPES)[number];
```
- **CollectionType**: Specifies a type of collection based on `GENERIC_COLLECTION_TYPES`.

```ts
export type DatabaseTypes = (typeof DATABASE_TYPES)[number];
```
- **DatabaseTypes**: Represents a database type derived from `DATABASE_TYPES`.

```ts
export type ObjectTypes = (typeof OBJECT_TYPES)[number];
```
- **ObjectTypes**: Defines a set of object types based on `OBJECT_TYPES`.

```ts
export type ConfigTypes = (typeof CONFIG_TYPES)[number];
```
- **ConfigTypes**: Represents different configuration types from `CONFIG_TYPES`.

```ts
export type ProjectStructureStyle = (typeof STRUCT_TYPES)[number];
```
- **ProjectStructureStyle**: Defines various project structure styles from `STRUCT_TYPES`.

```ts
export type DisabledMethods = (typeof CRUD_DISABLED_OPTIONS)[number];
```
- **DisabledMethods**: Represents CRUD methods that are disabled based on `CRUD_DISABLED_OPTIONS`.

```ts
export type ParamsTypes = (typeof PARAMS_TYPES)[number];
```
- **ParamsTypes**: Defines different types of parameters derived from `PARAMS_TYPES`.

```ts
export type RelationshipTypes = (typeof RELATIONSHIP_TYPES)[number];
```
- **RelationshipTypes**: Specifies types of relationships extracted from `RELATIONSHIP_TYPES`.

```ts
export type HttpHeaderTypes = (typeof HTTP_HEADER_TYPES)[number];
```
- **HttpHeaderTypes**: Represents HTTP header types taken from `HTTP_HEADER_TYPES`.

```ts
export type GenerationType = (typeof GENERATION_TYPES)[number];
```
- **GenerationType**: Defines various generation strategies from `GENERATION_TYPES`.