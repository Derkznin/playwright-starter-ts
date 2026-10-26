import { test as base, expect } from '@playwright/test';
import { ExemplePage } from '../pages/exemple-a-reutiliser/exemple-page';

// Liste des fixtures personnalisées disponibles dans les tests
type ExempleFixtures = {
  exemplePage: ExemplePage;
};

// Étend le test de base de Playwright avec les fixtures
export const exempleTest = base.extend<ExempleFixtures>({
  // Copier ce bloc pour ajouter une page
  exemplePage: async ({ page }, use) => {
    await use(new ExemplePage(page));
  },
});

// Réexporte expect pour n'avoir qu'un seul import dans les tests
export { expect };
