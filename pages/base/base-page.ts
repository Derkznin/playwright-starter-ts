import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  /**
   * @param {Page} page - Instance de la page Playwright
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Connexion à la plateforme
   */
  async navigateTo(path: string) {
    await this.page.goto(path);
  }
}
