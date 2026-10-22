# Playwright TypeScript Test Template

Template de test automatisé robuste, réutilisable et maintenable basé sur **Playwright** et **TypeScript**.

## 🚀 Fonctionnalités

- **TypeScript** : Typage statique pour sécuriser et structurer le code.
- **Playwright Test** : Exécution rapide et fiable des tests end-to-end multi-navigateurs.
- **ESLint** : Analyse statique du code avec support de TypeScript et règles spécifiques pour Playwright (`eslint-plugin-playwright`).
- **Prettier** : Formatage automatique et homogène du code.
- **Architecture modulaire** : Prêt pour l'implémentation du design pattern _Page Object Model (POM)_.

---

## 📁 Structure du Projet

```text
my-playwright-project/
├── .github/
│   └── workflows/             # Pipelines CI/CD (optionnel)
├── fixtures/                  # Fixtures personnalisées Playwright
├── pages/                     # Page Objects (pages de l'application)
├── tests/                     # Fichiers de tests E2E (.spec.ts)
├── utils/                     # Fonctions et classes utilitaires
├── .eslintrc.json             # Configuration ESLint
├── .prettierrc                # Configuration Prettier
├── .prettierignore            # Fichiers/dossiers ignorés par Prettier
├── playwright.config.ts       # Configuration globale de Playwright
├── package.json               # Dépendances et scripts NPM
└── tsconfig.json              # Configuration TypeScript
```

## Commande à utiliser dans le terminal

npm run lint : Vérifier les erreurs dans le code
npm run lint:fix : Corriger automatiquement les erreurs ESLint
npm run format : Formater automatiquement tous les fichiers du projet
npm run format:check : Vérifier si le code est correctement formaté (utile pour la CI/CD)
npm run typecheck : Vérifier l'intégrité des types sans compiler les fichiers

## Découper les fixtures en plusieurs fichiers

Par défaut, toutes les fixtures sont dans `fixtures/index.ts`. Quand ce fichier devient
trop long, ou que les fixtures sont de natures différentes (pages, API, authentification),
on les sépare par domaine et on les regroupe avec `mergeTests`.

```
fixtures/
  pages.fixtures.ts   -> les Page Objects
  api.fixtures.ts     -> les données liées à l'API
  index.ts            -> regroupe les deux
```

Chaque fichier exporte son propre `test` (avec `base.extend`), puis `index.ts` les fusionne :

```typescript
import { mergeTests } from '@playwright/test';
import { test as pagesTest } from './pages.fixtures';
import { test as apiTest } from './api.fixtures';

export const test = mergeTests(pagesTest, apiTest);

export { expect } from '@playwright/test';
```

Les tests continuent d'importer `test` et `expect` depuis `../fixtures`, sans rien changer.
Deux fichiers ne doivent pas déclarer une fixture du même nom.

## Conventions de nommage

| Élément                           | Convention         | Exemple                       |
| --------------------------------- | ------------------ | ----------------------------- |
| Dossiers                          | `kebab-case`       | `page-objects/`, `test-data/` |
| Fichiers de test                  | `kebab-case`       | `login.spec.ts`               |
| Fichiers de classes               | `PascalCase`       | `LoginPage.ts`                |
| Fichiers de fixtures              | `kebab-case`       | `test-fixtures.ts`            |
| Fichiers utilitaires avec classes | `PascalCase`       | `DateUtils.ts`                |
| Classes                           | `PascalCase`       | `LoginPage`                   |
| Interfaces et types               | `PascalCase`       | `UserProfile`                 |
| Variables                         | `camelCase`        | `baseUrl`                     |
| Fonctions et méthodes             | `camelCase`        | `getUserProfile()`            |
| Constantes globales immuables     | `UPPER_SNAKE_CASE` | `DEFAULT_TIMEOUT`             |
