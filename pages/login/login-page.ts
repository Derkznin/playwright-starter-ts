import { Page } from '@playwright/test';

export class LoginPage {
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
  async login(username: string, password: string) {
    // Remplir les champs et soumettre le formulaire
    await this.page.locator('').fill(username);
    await this.page.locator('').fill(password);
  }

  /**
   * Déconnexion de la plateforme
   */
  async logout() {
    // Déconnecter l'utilisateur
  }
}
