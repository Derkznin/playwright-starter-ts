import { expect, Page, Response } from '@playwright/test';

export class NetworkUtils {
  /**
   * Attend une réponse HTTP et vérifie son statut.
   * À utiliser dans un Promise.all, placé AVANT l'action qui déclenche la requête.
   *
   * @param page - L'instance de Page Playwright
   * @param url - Fin du chemin de l'URL (sans query string)
   * @param status - Statut HTTP attendu
   * @returns La réponse, au cas où vous devez inspecter son contenu
   */
  static async waitForResponseWithStatus(
    page: Page,
    url: string,
    status: number,
  ): Promise<Response> {
    const response = await page.waitForResponse((r) => new URL(r.url()).pathname.endsWith(url));

    expect(response.status(), `${response.request().method()} ${response.url()}`).toBe(status);

    return response;
  }
}
