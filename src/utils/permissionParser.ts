import fs from 'fs-extra';
import path from 'path';
import {GroupPermissionDef, PermissionDef} from '../interfaces/types';

/**
 * Extrair todas as permissões anotadas com @IgrpPermission dentro de uma classe Java.
 */
export function extractPermissions(fileContent: string): PermissionDef[] {
    const permissionRegex =
        /@IgrpPermission\s*\(\s*name\s*=\s*"([^"]+)"\s*,\s*description\s*=\s*"([^"]+)"(?:\s*,\s*enabled\s*=\s*(true|false))?\s*\)\s*public\s+static\s+String\s+[A-Z0-9_]+\s*=\s*"[^"]+"/g;

    const permissions: PermissionDef[] = [];
    let match: RegExpExecArray | null;

    while ((match = permissionRegex.exec(fileContent)) !== null) {
        const enabledValue = match[3] ? match[3] === 'true' : true;

        permissions.push({
            name: match[1],
            description: match[2],
            enabled: enabledValue,
        });
    }

    return permissions;
}


export async function buildPermissionGroup(filePath: string): Promise<GroupPermissionDef | null> {
    const content = await fs.readFile(filePath, 'utf-8');
    const classNameMatch = /public\s+class\s+(\w+)/.exec(content);
    const name = classNameMatch ? classNameMatch[1] : path.basename(filePath, '.java');
    const permissions = extractPermissions(content);

    if (permissions.length === 0) {
        console.log(`Ignorando classe sem permissões: ${name}`);
        return null;
    }

    return { name, permissions };
}


