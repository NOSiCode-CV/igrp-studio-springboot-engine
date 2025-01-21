import fs from 'fs-extra';
import { addController } from '../src';
import { ControllerConfig } from '../src/interfaces/types';

const TECHNICAL_OUTPUT_DIR = 'C:\\spring-engine\\demoTechnical'
const DOMAIN_OUTPUT_DIR = 'C:\\spring-engine\\demoDomain'

const domainControllerConfig: ControllerConfig = {
  type: "controller",
  name: "Animals",
  basePath: "animals",
  actions: [
    {
      actionName: "getAnimalById",
      path: "get-animal",
      method: "GET",
      pathVariables: [
        {
          type: "string",
          name: "id",
          isRequired: true,
        },
      ],
      responses: {
        "200": {
          module: "core",
          name: "AnimalResponse",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    description: "The unique ID of the animal",
                  },
                  name: {
                    type: "string",
                    description: "Name of the animal",
                  },
                  species: {
                    type: "string",
                    description: "Species of the animal",
                  },
                },
              },
            },
          },
        },
        "404": {
          name: "AnimalNotFound",
          module: "core",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "Error message indicating animal not found",
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      actionName: "createAnimal",
      path: "create-animal",
      method: "POST",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "Name of the new animal",
                  required: true
                },
                species: {
                  type: "string",
                  description: "Species of the new animal",
                  required: true,
                  minimum: 0,
                  maximum: 255
                },
                age: {
                  type: "integer",
                  description: "Age of the new animal",
                },
              },
            },
          },
        },
      },
      responses: {
        "201": {
          module: "core",
          name: "AnimalCreatedResponse",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    description: "The unique ID of the created animal",
                  },
                  name: {
                    type: "string",
                    description: "Name of the created animal",
                  },
                  species: {
                    type: "string",
                    description: "Species of the created animal",
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      actionName: "updateAnimal",
      path: "update-animal",
      method: "PUT",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "AnimalDTO",
              objectType: "dto"
            },
          },
        },
      },
      responses: {
        "200": {
          module: "core",
          name: "AnimalUpdatedResponse",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Name of the updated animal",
                  },
                  species: {
                    type: "string",
                    description: "Species of the updated animal",
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      actionName: "deleteAnimal",
      path: "delete-animal",
      method: "DELETE",
      pathVariables: [
        {
          type: "string",
          name: "id",
          isRequired: true,
        },
      ],
      responses: {
        "200": {
          module: "core",
          name: "AnimalDeleted",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  deleted: {
                    type: "boolean",
                    description: "Boolean value to confirm the deletion",
                  },
                },
              },
            }
          },
        },
        "404": {
          name: "AnimalNotFound",
          module: "core",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "Error message indicating animal not found",
                  },
                },
              },
            },
          },
        },
      },
    },
  ],
  module: "core",
};

const technicalControllerConfig: ControllerConfig = {
  type: "controller",
  name: "Users",
  basePath: "users",
  actions: [
    {
      actionName: "getUserById",
      path: "get-user",
      method: "GET",
      pathVariables: [
        {
          type: "string",
          name: "id",
          isRequired: true
        },
      ],
      responses: {
        "200": {
          name: "UserResponse",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    description: "Unique ID of the user",
                  },
                  username: {
                    type: "string",
                    description: "Username of the user",
                  },
                  email: {
                    type: "string",
                    description: "Email address of the user",
                  },
                },
              },
            },
          },
        },
        "404": {
          name: "UserNotFound",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "Error message indicating user not found",
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      actionName: "createUser",
      path: "create-user",
      method: "POST",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                username: {
                  type: "string",
                  description: "Username of the new user",
                  required: true
                },
                email: {
                  type: "string",
                  description: "Email address of the new user",
                  required: true
                },
                password: {
                  type: "string",
                  description: "Password for the new user",
                  required: true
                },
              },
            },
          },
        },
      },
      responses: {
        "201": {
          name: "UserCreatedResponse",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    description: "Unique ID of the created user",
                  },
                  username: {
                    type: "string",
                    description: "Username of the created user",
                  },
                  email: {
                    type: "string",
                    description: "Email of the created user",
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      actionName: "updateUser",
      path: "update-user",
      method: "PUT",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "UserDTO",
              objectType: "dto"
            },
          },
        },
      },
      responses: {
        "201": {
          name: "UserUpdatedResponse",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: {
                    type: "string",
                    description: "Username of the updated user",
                  },
                  email: {
                    type: "string",
                    description: "Email of the updated user",
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      actionName: "deleteUser",
      path: "delete-user",
      method: "DELETE",
      pathVariables: [
        {
          type: "string",
          name: "id",
          isRequired: true,
        },
      ],
      responses: {
        "200": {
          name: "UserDeleted",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  deleted: {
                    type: "boolean",
                    description: "Boolean value to confirm the deletion",
                  },
                },
              },
            }
          },
        },
        "404": {
          name: "UserNotFound",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    description: "Error message indicating user not found",
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

beforeAll(async () => {
  await fs.mkdir(TECHNICAL_OUTPUT_DIR, { recursive: true });
  await fs.mkdir(DOMAIN_OUTPUT_DIR, { recursive: true });
});

afterAll(async () => {
  // await fs.rm(OUTPUT_DIR, { recursive: true });
});

describe('Domain Controller Module', () => {
  it('should create the controller class and the handlers in domain driven design style', async () => {
    await addController(domainControllerConfig, DOMAIN_OUTPUT_DIR);
  });
});

describe('Technical Controller Module', () => {
  it('should create the controller class and the service interface in technical style', async () => {
    await addController(technicalControllerConfig, TECHNICAL_OUTPUT_DIR);
  });
});