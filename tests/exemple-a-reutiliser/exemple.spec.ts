import { test } from '../../fixtures';
import { testUsers } from '../../config/test-users-config';

/**
 * Modèle de fichier de test : un fichier = une fonctionnalité.
 * À copier, puis à adapter (nom du groupe, fixtures, étapes, vérifications).
 */
test.describe('Nom de la fonctionnalité (A REMPLACER)', { tag: '@tag-a-remplacer' }, () => {
  // Exécuté avant chaque test du groupe : FACULTATIF
  test.beforeEach(async ({ basePage }) => {
    await basePage.navigateTo('/');
  });

  // Exécuté après chaque test du groupe : FACULTATIF
  test.afterEach(async () => {
    // Nettoyage des données créées par le test
  });

  // Test : copier ce bloc pour ajouter un nouveau test
  test('décrit le comportement attendu (A REMPLACER)', async ({ exemplePage, loginPage }) => {
    // Exemple de connexion : FACULTATIF. Voir le document "docs/connexion.md"
    await test.step('Connexion : exemple (FACULTATIF)', async () => {
      await loginPage.login(testUsers.standard.username, testUsers.standard.password);
    });

    // Step : copier ce bloc pour ajouter une nouvelle étape à votre test
    await test.step('Vérifier : résultat attendu (A REMPLACER)', async () => {
      await exemplePage.exempleVerifierTitre();
    });
  });
});
