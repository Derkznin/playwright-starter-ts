import { mergeTests, expect } from '@playwright/test';
import { baseTest } from './base.fixture';
import { exempleTest } from './exemple-a-reutiliser.fixture';
import { loginTest } from './login.fixture';

export const test = mergeTests(baseTest, exempleTest, loginTest);
export { expect };
