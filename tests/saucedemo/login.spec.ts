import { test } from '../../fixtures';
import { EnvUtils } from '../../utils/env-utils';

test.describe('Connexion', { tag: '@login' }, () => {
  test.beforeEach(async ({ basePage }) => {
    await basePage.navigateTo('/');
  });

  // Test : copier ce bloc pour ajouter un nouveau test
  test('Connexion autorisé', async ({ loginPage }) => {
    await test.step('Remplir le formulaire de connexion', async () => {
      const { username, password } = EnvUtils.getCredentials('standard');

      await loginPage.login(username, password);
    });

    await test.step('Vérifier que la connexion a fonctionné', async () => {
      await loginPage.verifyLogin();
    });
  });
});
