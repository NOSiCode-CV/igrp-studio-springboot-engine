import { DTOConfig } from "../src/interfaces/types";
import {loadConfig} from "../src/utils/helpers";

const BASE_PATH = '';

describe('Load IGRP Config', () => {

    it('load dtos configs', async () => {
        await loadConfig<DTOConfig>(`${BASE_PATH}/.igrpstudio/dto`);
        expect(true).toBeTruthy();
    })
})