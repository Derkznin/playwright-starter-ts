import { mergeTests, expect } from '@playwright/test';
import { baseTest } from './base-fixtures';
import { exempleTest } from './exemple-a-utiliser-fixtures';
import { loginTest } from './login-fixtures';

export const test = mergeTests(baseTest, exempleTest, loginTest);
export { expect };
