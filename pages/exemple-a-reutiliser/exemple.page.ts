import { expect, Page } from '@playwright/test';

export class ExemplePage {
  readonly page: Page;

  /**
   * @param {Page} page - Instance de la page Playwright
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Exemple de méthode de redirection
   */
  async exempleMethode() {
    await this.page.goto('/');
  }

  /**
   * Exemple pour vérifier que la page affiche un titre
   */
  async exempleVerifierTitre() {
    await expect(this.page).toHaveTitle(/.+/);
  }
}
