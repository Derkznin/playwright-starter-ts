import { Page } from '@playwright/test';

export class ExemplePage {
  readonly page: Page;

  /**
   * @param {Page} page - Instance de la page Playwright
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Exemple de méthode
   *
   */
  async exempleMethode() {
    await this.page.goto('/');
  }
}
