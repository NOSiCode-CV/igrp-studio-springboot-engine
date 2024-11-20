# Application Execution Guide

## Requirements

To run this application, ensure you have the following installed:

- [Nodejs](https://nodejs.org/en/download/package-manager/current)

## Installation and Execution Steps

### 1. Download the Project:

Clone or download the project to your local machine.

### 2. Install Dependencies:

From the project's root directory, run the following command to install all necessary dependencies:

- npm install

### 3. Compile the Project:

Compile the project by running the following command

- npm run build

### Run Tests:

Once the project has been compiled, you can test the various functions of the application by executing the following command:

- npm test fileNameTest (you can find all tests files in the "** test **" directory)

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
	type: 'baseApi',
    apiName: 'demo', //Names with hyphens or spaces are not accepted.
    group: 'com.example',
    artifact: 'demo',
    description: 'Demo project for Spring Boot',
    database: 'Postgresql' // you can choose between MySQL and PostgreSQL
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
  name: 'User',
  attributes: [
    { type: 'Long', name: 'userID', primaryKey: true, generationType:"SEQUENCE" },
    { type: 'String', name: 'email', length:30, unique: true, nullable: false, required: true },
    { type: 'String', name: 'password', unique: false, length:30, nullable: true, required: true },
  ]
};

//Model with compound primary keys
const config2: ModelConfig = {
  type: 'model',
  name: 'User',
  attributes: [
    { type: 'String', name: 'email', length:30, unique: true, nullable: false, required: true },
    { type: 'String', name: 'password', unique: false, length:30, nullable: true, required: true },
  ],
  primaryKey: [
    {
      name: 'userId',
      type: 'Long',
    },
    {
      name: 'userName',
      type: 'String',
      length: 2000,
    },
  ]
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
    { type: 'Long', name: 'userID', primaryKey: true, generationType:"SEQUENCE" },
    { type: 'String', name: 'email', length:30, unique: true, nullable: false, required: true },
    { type: 'String', name: 'password', unique: false, length:30, nullable: true, required: true },
  ],
  crud: {
    enabled: true,
    path: 'products',
    disabledMethods: ['delete'] // Example of disabling the DELETE method
  }
};

const basePath = 'your_absolute_project_path';

const addProductCrud = async () => {
  try {
    await addCrud(config, basePath);
    console.log('CRUD operations for Product have been successfully added.');
  } catch (error) {
    console.error('Error adding CRUD operations:', error);
  }
};
```
All methods of this crud will be available at the url http://localhost:8080/products

- Add Relationship - Adds a relationship between the specified models.
```java
This function modifies the configuration of an existing model to include a new relationship. 
The relationship is defined in the `relations` property of the `ModelConfig` object.
All models involved in the relationship should already be created. 
The function will update the model configuration file by adding the relation parameter and then call the `addModel` function to apply the changes.
@param {ModelConfig} config - The model configuration object, including the relationship details.
@param {string} basePath - The base path of the application where the model configuration will be updated and saved.
```
```ts
import { addRelationship } from '@igrp/spring-engine';
import { ModelConfig } from "@igrp/spring-engine/dist/interfaces/types";

const config: ModelConfig = {
  type: 'model',
  name: 'Order',
  attributes: [
    { type: 'Long', name: 'orderID', primaryKey: true, generationType:"SEQUENCE" },
    { type: 'String', name: 'description', nullable: false }
  ],
  relations: [
    {
      relationType: 'ManyToOne',
      entity: 'Customer', 
      joinColumn: 'customer_id'
    }
  ]
};
 
const basePath = 'your_absolute_project_path';

const addOrderRelationship = async () => {
  try {
    await addRelationship(config, basePath);
    console.log('Relationship between Order and Customer has been successfully added.');
  } catch (error) {
    console.error('Error adding relationship:', error);
  }
};
```

- Delete Model - This function removes a model configuration and its related repository files based on the provided configuration.
  It ensures that the model is properly deleted from the specified API base path.

```java
@param {ModelConfig} config - The model configuration object, which primarily includes the type and name of the model to be deleted.
@param {string} basePath - The base path of the application where the model and repository are located.
```

```ts
import { deleteModel } from '@igrp/spring-engine';
import { ModelConfig } from '@igrp/spring-engine/dist/interfaces/types';

const config: ModelConfig = {
  type: 'model',
  name: 'User',
  attributes: [
    { type: 'Long', name: 'userId', primarykey: true, generationType: "SEQUENCE"},
    { type: 'String', name: 'email', unique: true, required: true },
    { type: 'String', name: 'password', nullable: false, required: true },
  ],
  crud: {},
  relations: [],
};
const basePath = 'C://your_project_path';

const removeModel = async () => {
  try {
    await deleteModel(config, basePath);
  } catch (error) {
    console.error(error);
  }
};
```

```ts
/**
* Generates and saves a model to the API.
* This function creates a model based on the provided configuration and saves it to the specified API base path.
* It also generates the associated CRUD operations if enabled in the configuration.
*
* @param {ModelConfig} config - Model configuration object, which includes the name and other details of the model.
* @param {string} basePath - Application base path where the model will be saved and generated to the API.
* 
* @throws {Error} Will throw an error if the model configuration is invalid or the model name is missing.
* @throws {Error} Will throw an error if the base path is not provided.
* 
*/
 // Example usage:
import { addDTO } from "@igrp/spring-engine";
import { DTOConfig } from "@igrp/spring-engine/dist/interfaces/types";;
const config: DTOConfig = {
  type: 'dto',
  name: 'User',
  attributes: [
    { type: 'String', ns: 'java', name: 't0'},
    { type: { name: 'DTO1' }, ns: 'dto', name: 't1'},
    { type: { name: 'CTO1' }, ns: 'dto', name: 't2'},
    { type: { name: 'TPessoa' }, ns: 'model', name: 't21'},
 
    { type: { name: 'List', generics:[{name: 'Integer', ns: 'java'}]}, ns: 'java', name: 't3'},
    { type: { name: 'List', generics:[{name: 'BigDecimal', ns: 'java'}]}, ns: 'java', name: 't4'},
  ]
};

const basePath = 'C://your_project_path';
 
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
* when ns=java it will check if that java class exists on the * allowed list 
* when ns=local it will check if that type name exist on DTO wide config, it will check if this DTO has that name as Generic Param Type 
*/
// JAVA LIST

export const JAVA_TYPES: Map<string, TypeMetadata> = new Map(Object.entries({
  'boolean': { name: 'boolean', primitive: true },
  'char': { name: 'char', primitive: true },
  'short': { name: 'short', primitive: true },
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
  'LocalTime': { name: 'LocalDateTime', primitive: false, namespace: 'java.time' },

  'List': { name: 'List', primitive: false, namespace: 'java.util', },
}));
```

```ts
/**
 * Deletes a dto from the API.
 *
 * This function removes a dto configuration based on the provided configuration.
 * It ensures that the dto is properly deleted from the specified API base path.
 *
 * @param {DTOBaseConfig} config - The dto configuration object, which primarily includes the type and name of the model to be deleted.
 * @param {string} basePath - The base path of the application where the dto and repository are located.
 *
 * @throws {Error} Will throw an error if the dto configuration is invalid.
 * @throws {Error} Will throw an error if the base path is not provided.
 * @throws {Error} Will throw an error the DTO is beeing used in other json configuration.
 *
 * @example
 * // Example usage:
 *  */

import { deleteDTO } from "@igrp/spring-engine";
import { DTOBaseConfig } from "@igrp/spring-engine/dist/interfaces/types";;
 
const config: DTOBaseConfig = {
  type: 'dto',
  name: 'User'
};
const basePath = 'C://your_project_path';
  
const removeDTO = async () => {
  try {
    await deleteDTO(config, basePath);
  } catch (error) {
    console.error(error);
  }
};
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

const controllerConfig: ControllerConfig = {
  type: "controller",
  name: "Greeting",
  basePath: "greetings",
  actions: [
    {
      path: 'hello',
      method: 'GET',
      actionName: 'hello',
      accepts: 'application/x-cdf',
      requestParams: [{ type: 'String', name: 'greetingName' }],
      response: 'String'
    },
    {
      path: 'addGreeting',
      method: 'POST',
      actionName: 'addGreeting',
      requestBody: 'greeting',
      pathVariables:[],
      requestParams: [],
      response: 'Object',
    },
    {
      path: 'goodbye',
      method: 'GET',
      actionName: 'goodBye',
      pathVariables:[{ type: 'Long', name: 'id' }],
      requestParams: [{ type: 'String', name: 'greetingName' }],
      response: 'String',
    }
  ]
};

const applicationBasePath = 'C://your_project_path';

const generateGreetingController = async () => {
  try {
    await addController(config, applicationBasePath);
    console.log('UserController has been successfully generated.');
  } catch (error) {
    console.error('Error generating UserController:', error);
  }
};
```
Note: To access the generated endpoints, it is necessary to implement the methods declared in the controller interface automatically generated. This implementation is done by the programmer.
The implemented methods will be available at:
```ts
GET: http://localhost:8080/greetings/hello
POST: http://localhost:8080/greetings/addGreeting
GET: http://localhost:8080/greetings/goodbye/<id>
```

### Types

```ts

export interface TypeMetadata {
  name: string;
  primitive: boolean; 
  namespace?:string;
}

export interface ApiConfig {
  type: 'baseApi';
  apiName: string;
  group: string;
  artifact: string;
  database: DatabaseTypes;
  description?: string;
  package?: string;
  name?: string;
}

export interface ModelConfig {
  type: 'model';
  name: string;
  tableName: string;
  attributes: Attribute[];
  primaryKey?: PrimaryKey[];
  crud?: Crud;
  relations?: Relation[];
}

export interface GenericType {
  name: string;
  namespace?: string;
  ns: 'dto'|'model'|'java'|'local';
}

export interface JavaType {
  name: string;
  namespace?: string;
  generics?: GenericType[];
}

export interface JavaAttribute {
  name: string;
  type: string | JavaType;
  ns: 'dto'|'model'|'java';
}

export interface DTOBaseConfig {
  type: 'dto';
  name: string;
}

export interface DTOConfig extends DTOBaseConfig {
  generics?: string[];
  template: 'classic' | 'record';
  attributes: JavaAttribute[];
}

export interface Icontroller {
  type: 'icontroller';
  name: string;
}

export interface PrimaryKey extends Pick<Attribute, 'type' | 'name' | 'length'> {}

export interface Attribute {
  type: AttributeType;
  name: string;
  length?: number;
  nullable?: boolean;
  unique?: boolean;
  primaryKey?: boolean;
  generationType?: GenerationType
  defaultValue?: string;
}

export interface Relation {
  relationType: string;
  entity: string;
  mappedBy?: string;
  joinColumn?: string;
  joinTable?: string;
  inverseJoinColumn?: string;
}

export interface Crud {
  enabled: boolean;
  path: string;
  disabledMethods: DisabledMethods[];
}

export interface Table {
  name: string;
  joinColumns: string;
  inverseJoinColumns: string;
}

export interface ControllerConfig {
  type: 'controller';
  name: string;
  basePath: string;
  actions: ControllerAction[];
}

export interface ControllerAction {
  path: string;
  actionName: string;
  method: HttpMethod;
  accepts?: MimeTypes;
  contentType?: MimeTypes;
  requestBody?: string;
  requestParams?: RequestParams[];
  response: string;
  pathVariables?: PathVariables[];
}

export interface RequestParams {
  type: ParamsTypes;
  name: string;
}

export interface PathVariables {
  type: string;
  name: string;
}

export type RenderContext<T = undefined> = {
  resourceConfig: T;
  basePath: string;
  baseConfig: ApiConfig;
  mathAttributes?: string[];
  dateTimeUniqueAttributes?: string[];
};

export type HttpMethod = (typeof HTTP_METHOD_TYPES)[number];
export type AttributeType = (typeof ATTRIBUTE_TYPES)[number];
export type DatabaseTypes = (typeof DATABASE_TYPES)[number];
export type DisabledMethods = (typeof CRUD_DISABLED_OPTIONS)[number];
export type RelationshipTypes = (typeof RELATIONSHIP_TYPES)[number];
export type ParamsTypes = (typeof PARAMS_TYPES)[number];
export type MimeTypes = (typeof MIME_TYPES)[number];
export type SimpleResponseTypes = (typeof SIMPLE_RESPONSE_TYPES)[number];
export type ResponseTypes = SimpleResponseTypes | `List<${SimpleResponseTypes}>`
export type GenerationType = (typeof GENERATION_TYPES)[number]
```
