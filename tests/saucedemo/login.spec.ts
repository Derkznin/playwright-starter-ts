import { test } from '../../fixtures';
import { testUsers } from '../../config/test-users-config';

test.describe('Connexion', { tag: '@login' }, () => {
  test.beforeEach(async ({ basePage }) => {
    await basePage.navigateTo('/');
  });

  // Test : copier ce bloc pour ajouter un nouveau test
  test('Connexion autorisé', async ({ loginPage }) => {
    await test.step('Remplir le formulaire de connexion', async () => {
      await loginPage.login(testUsers.standard.username, testUsers.standard.password);
    });

    await test.step('Vérifier que la connexion a fonctionné', async () => {
      await loginPage.verifyLogin();
    });
  });
});
