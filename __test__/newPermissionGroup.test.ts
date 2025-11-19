import {addPermissionConfig, setEngineConfiguration} from '../src';
import {GroupPermissionDef} from '../src/interfaces/types';
// @ts-ignore
import {TEST_OUTPUT_DIR, TEST_OUTPUT_TEC} from './outputDirPath';

const groupPermissionDef: GroupPermissionDef = {
    name: 'AppPermissionTres',
    permissions: [
        { name: 'hr.employee.view', description: 'Permission to view employee', enabled: false },
        { name: 'hr.employee.edit', description: 'Permission to edit employee' },
        { name: 'hr.leave.approve', description: 'Permission to approve leave requests' }
    ]
};

beforeEach(async () => {
    setEngineConfiguration({ environment: 'development' });
});


describe('New Group Permission Config', () => {

    it('should create the Permission class.', async () => {
        await addPermissionConfig(TEST_OUTPUT_DIR, groupPermissionDef);
    });
});