import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

interface TestUser {
  username: string;
  password: string;
}

const usersPath = resolve(process.cwd(), 'test-users.json');
const usersData = readFileSync(usersPath, 'utf-8');

export const testUsers: Record<string, TestUser> = JSON.parse(usersData);
