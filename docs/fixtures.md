# 🧩 Fixtures

## 📂 Découper les fixtures en plusieurs fichiers

Au début du projet, les fixtures personnalisées peuvent être regroupées dans un seul fichier, par exemple `fixtures/index.ts`.

Lorsque ce fichier devient trop volumineux ou que les fixtures ont des responsabilités différentes (Page Objects, API, authentification), il est préférable de les séparer par domaine.

### Exemple de structure

```text
fixtures/
├── pages-fixtures.ts    # Fixtures liées aux Page Objects
├── api-fixtures.ts      # Fixtures liées à l'API
└── index.ts             # Regroupement des fixtures
```

### 1. Déclarer les fixtures par domaine

Chaque fichier définit et exporte son propre objet `test`, créé à partir de `base.extend()`.

Par exemple, dans `pages-fixtures.ts` :

```typescript
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type PagesFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<PagesFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});
```

Le fichier `api-fixtures.ts` suit le même principe pour les fixtures liées à l'API.

### 2. Regrouper les fixtures avec `mergeTests`

Le fichier `index.ts` fusionne les objets `test` exportés par les différents fichiers à l'aide de `mergeTests()`.

```typescript
import { mergeTests } from '@playwright/test';
import { test as pagesTest } from './pages-fixtures';
import { test as apiTest } from './api-fixtures';

export const test = mergeTests(pagesTest, apiTest);

export { expect } from '@playwright/test';
```

### 3. Utiliser les fixtures dans les tests

Les tests importent `test` et `expect` depuis le fichier central `index.ts`.

```typescript
import { test, expect } from '../fixtures';

test('should display the login page', async ({ page, loginPage }) => {
  await page.goto('/login');

  // Ajouter les vérifications nécessaires.
});
```

L'import depuis `../fixtures` fonctionne si le fichier `index.ts` est bien résolu comme point d'entrée du dossier.

### ⚠️ Points d'attention

- Chaque fichier doit exporter son propre objet `test`, étendu avec ses fixtures.
- Les noms des fixtures doivent être uniques entre les différents groupes fusionnés.
- `mergeTests()` permet de combiner plusieurs objets `test` personnalisés sans devoir redéclarer toutes les fixtures dans un seul fichier.
- Il est inutile de séparer les fixtures trop tôt : commence avec un seul fichier et découpe-le lorsque cela améliore réellement la lisibilité du projet.
