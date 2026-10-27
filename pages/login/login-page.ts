import { expect, Page } from '@playwright/test';

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
    await this.page.locator('[data-test="username"]').fill(username);
    await this.page.locator('[data-test="password"]').fill(password);
    await this.page.locator('[data-test="login-button"]').click();
  }

  /**
   * Déconnexion de la plateforme
   */
  async logout() {
    // Déconnecter l'utilisateur
  }

  /**
   * Vérifier que la connexion a fonctionnée
   */
  async verifyLogin() {
    await expect(this.page.locator('[data-test="inventory-container"]')).toBeVisible;
  }
}
