import { test } from '../../fixtures';

/**
 * Modèle de fichier de test : un fichier = une fonctionnalité.
 * À copier, puis à adapter (nom du groupe, fixtures, étapes, vérifications).
 */
test.describe('Nom de la fonctionnalité (A REMPLACER)', { tag: '@tag-a-remplacer' }, () => {
  // Exécuté avant chaque test du groupe : FACULTATIF
  test.beforeEach(async ({ exemplePage }) => {
    await exemplePage.exempleMethode();
  });

  // Exécuté après chaque test du groupe : FACULTATIF
  test.afterEach(async ({ exemplePage }) => {
    await exemplePage.exempleMethode();
  });

  // Test : copier ce bloc pour ajouter un cas
  test('décrit le comportement attendu (A REMPLACER)', async ({ exemplePage }) => {
    await test.step('Vérifier : résultat attendu (A REMPLACER)', async () => {
      await exemplePage.exempleVerifierTitre();
    });
  });
});
