import { addDTO, deleteDTO, deleteResponse } from '../src';
import { ApiConfig, DTOConfig, ResponseConfig } from '../src/interfaces/types';
import { readJsonFile } from '../src/utils/readJsonFiles';
import { DIRECTORIES, EXTENSIONS } from "../src/utils/constants";
import { getMainPath } from '../src/utils/helpers';
import path from 'path';
import fs from 'fs-extra';

const OUTPUT_DIR = 'C:\\spring-engine\\generatedNewVersion'

describe('Response deletion', () => {
    it('should delete a response', async () => {
        const model: ResponseConfig = {
          template: "record",
          statusCode: "200",
          name: "TestResponseIsolated",
          description: "OK",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  newField1: {
                    type: "string",
                    description: "New field 1",
                    example: "newValue1",
                    default: "newValue"
                  }
                }
              }
            }
          }
        };

        await deleteResponse(model, OUTPUT_DIR)
    });

});