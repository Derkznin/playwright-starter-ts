import { test as base, expect } from '@playwright/test';
import { ExemplePage } from '../pages/exemple-a-reutiliser/ExemplePage';

// Liste des fixtures personnalisées disponibles dans les tests
type IndexFixtures = {
  exemplePage: ExemplePage;
};

// Étend le test de base de Playwright avec nos fixtures
export const test = base.extend<IndexFixtures>({
  exemplePage: async ({ page }, use) => {
    await use(new ExemplePage(page));
  },
  // A compléter
});

// Réexporte expect pour n'avoir qu'un seul import dans les tests
export { expect };
