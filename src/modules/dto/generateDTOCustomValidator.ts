import path from 'path';
import fs from 'fs-extra';
import { DTOBaseConfig, RenderContext } from '../../interfaces/types';
import { PROJECT_STRUCTURE_STYLE, TEMPLATES } from '../../utils/constants';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import { getDToValidatorDir, getDToValidatorDirDDD } from '../../utils/helpers';
import { normalizeInterfaceValidatorName, normalizeImplValidatorName } from './helpers';
import { EXTENSIONS } from '../../utils/constants';


export const generateValidatorDTO = async (context: RenderContext<DTOBaseConfig>) => {
    const validatorDirectoryPath = getValidatorDirectory(context);


    if (!(await fs.pathExists(validatorDirectoryPath))) {
        await fs.mkdir(validatorDirectoryPath, { recursive: true });
    }

    const validatorInterfacePath = getValidatorInterfacePath(context);
    const validatorInterfaceTemplate = await renderInterfaceValidator(context);
    await saveToFile(validatorInterfaceTemplate, validatorInterfacePath, false);

    const validatorImplPath = getValidatorImplPath(context);
    const validatorImplTemplate = await renderImplValidator(context);
    await saveToFile(validatorImplTemplate, validatorImplPath, false);
};

const getValidatorInterfacePath = (context: RenderContext<DTOBaseConfig>) => {
    const outputDir = getValidatorDirectory(context);
    context.fullPath = outputDir;
    const interfaceValidatorName = normalizeInterfaceValidatorName(context.resourceConfig.name) + EXTENSIONS.JAVA;
    return path.join(outputDir, interfaceValidatorName);
};

export const renderInterfaceValidator = async (context: RenderContext<DTOBaseConfig>) => {
    return await renderTemplate(TEMPLATES.VALIDATOR_DTO_INTERFACE, context);
};

const getValidatorImplPath = (context: RenderContext<DTOBaseConfig>) => {
    const outputDir = getValidatorDirectory(context);
    context.fullPath = outputDir;
    const implValidatorName = normalizeImplValidatorName(context.resourceConfig.name) + EXTENSIONS.JAVA
    return path.join(outputDir, implValidatorName);
};

export const renderImplValidator = async (context: RenderContext<DTOBaseConfig>) => {
    return await renderTemplate(TEMPLATES.VALIDATOR_DTO_IMPL, context);
};

const getValidatorDirectory = (context: RenderContext<DTOBaseConfig>) => {
    return context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN
        ? getDToValidatorDirDDD(context)
        : getDToValidatorDir(context);
};
