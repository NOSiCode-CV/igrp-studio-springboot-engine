import path from 'path';
import fs from 'fs-extra';
import { DTOBaseConfig, RenderContext } from '../../interfaces/types';
import { PROJECT_STRUCTURE_STYLE, TEMPLATES } from '../../utils/constants';
import { renderTemplate } from '../common/renderTemplate';
import { saveToFile } from '../common/saveToFile';
import { getDToValidatorDir, getDToValidatorDirDDD } from '../../utils/helpers';


const DTO_INTERFACE_VALIDAOTR_SUFFIXX = 'Validator.java';

/**
 * 
 * @param context 
 */

export const generateValidatorDTO = async (context: RenderContext<DTOBaseConfig>) => {

    const validatorDirectoryPath = validatorDirectory(context);

    // Apenas cria o diretório se ele não existir
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

    if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
        const outputDir = getDToValidatorDirDDD(context)
        context.fullPath = outputDir
        return path.join(outputDir, `I${context.resourceConfig.name}DTO${DTO_INTERFACE_VALIDAOTR_SUFFIXX}`);
    } else {
        const outputDir = getDToValidatorDir(context)
        context.fullPath = outputDir
        return path.join(outputDir, `I${context.resourceConfig.name}DTO${DTO_INTERFACE_VALIDAOTR_SUFFIXX}`);
    }
}

export const renderInterfaceValidator = async (context: RenderContext<DTOBaseConfig>) => {
    return await renderTemplate(TEMPLATES.VALIDATOR_DTO_INTERFACE, context);
}

const getValidatorImplPath = (context: RenderContext<DTOBaseConfig>) => {

    if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
        const outputDir = getDToValidatorDirDDD(context)
        context.fullPath = outputDir
        return path.join(outputDir, `${context.resourceConfig.name}DTO${DTO_INTERFACE_VALIDAOTR_SUFFIXX}`);
    } else {
        const outputDir = getDToValidatorDir(context)
        context.fullPath = outputDir
        return path.join(outputDir, `${context.resourceConfig.name}DTO${DTO_INTERFACE_VALIDAOTR_SUFFIXX}`);
    }
}

export const renderImplValidator = async (context: RenderContext<DTOBaseConfig>) => {
    return await renderTemplate(TEMPLATES.VALIDATOR_DTO_IMPL, context);
}

const validatorDirectory = (context: RenderContext<DTOBaseConfig>) => {
    if (context.baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
        const outputDir = getDToValidatorDirDDD(context);
        if (!context.fullPath) context.fullPath = outputDir;
        return path.join(outputDir);
    } else {
        const outputDir = getDToValidatorDir(context);
        if (!context.fullPath) context.fullPath = outputDir;
        return path.join(outputDir);
    }
};




