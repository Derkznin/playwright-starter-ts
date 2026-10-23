import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login/login-page';

// Liste des fixtures personnalisées disponibles dans les tests
type LoginFixtures = {
  loginPage: LoginPage;
};

// Étend le test de base de Playwright avec les fixtures
export const loginTest = base.extend<LoginFixtures>({
  // Copier ce bloc pour ajouter une page
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

// Réexporte expect pour n'avoir qu'un seul import dans les tests
export { expect };
