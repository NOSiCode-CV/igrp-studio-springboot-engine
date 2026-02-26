import {GroupPermissionDef, RenderContext} from "../../interfaces/types";
import {saveToFile} from "../common/saveToFile";
import {DIRECTORIES, ERROR_MESSAGE, EXTENSIONS, TEMPLATES} from "../../utils/constants";
import {renderTemplate} from "../common/renderTemplate";
import {getMainPath} from "../../utils/helpers";
import path from "path";


export const saveGroupPermissionDef = async (context: RenderContext<GroupPermissionDef>) => {
    const content = await _renderGroupPermissionDef(context);

    let outputDir = path.join(
        context.basePath,
        getMainPath(context.baseConfig.group, context.baseConfig.packageName)
    );

    if (context.baseConfig.projectStructureStyle === "domain") {
        outputDir = path.join(
            outputDir,
            context.resourceConfig.module ?? DIRECTORIES.SHARED,
            DIRECTORIES.INFRASTRUCTURE,
            DIRECTORIES.AUTHORIZATION,
            DIRECTORIES.PERMISSION
        );
    } else {
        outputDir = path.join(outputDir, DIRECTORIES.AUTHORIZATION, DIRECTORIES.PERMISSION);
    }

    const outputPath = path.join(outputDir, `${context.resourceConfig.name}.java`);

    await saveToFile(
        content,
        outputPath,
        true,
        undefined,
        undefined,
        context.resourceConfig.module,
        context.basePath,
        EXTENSIONS.JAVA
    );

};


export const _renderGroupPermissionDef = async (context: RenderContext<GroupPermissionDef>) => {
    if (context.resourceConfig.permissions.length === 0) {
        throw ERROR_MESSAGE.EMPTY_ATTRIBUTE;
    }

    return await renderTemplate(TEMPLATES.PERMISSION_GROUP, context);
};
