import { test as base, expect } from '@playwright/test';
import { BasePage } from '../pages/base/base-page';

// Liste des fixtures personnalisées disponibles dans les tests
type BaseFixtures = {
  basePage: BasePage;
};

// Étend le test de base de Playwright avec les fixtures
export const baseTest = base.extend<BaseFixtures>({
  // Copier ce bloc pour ajouter une page
  basePage: async ({ page }, use) => {
    await use(new BasePage(page));
  },
});

// Réexporte expect pour n'avoir qu'un seul import dans les tests
export { expect };
