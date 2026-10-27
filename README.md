# 🎭 Playwright TypeScript Test Template

## 📖 Présentation du projet

Projet basé sur **Playwright** et **TypeScript**, visant à fournir un template de tests automatisés robuste, réutilisable et maintenable.

## ⚙️ Prérequis et installation

- Node.js (testé avec la version 24)
- npm
- Git

### 📥 1. Installer le projet

Cloner le projet et installer les dépendances :

```bash
git clone <url-du-depot>
cd my-playwright-project
npm install
npx playwright install
```

### 🔐 2. Configurer les variables d'environnement

Les tests lisent leur configuration (URL de l'application, identifiants de test) dans un fichier `.env`, qui n'est **jamais versionné**.

#### Créer le fichier `.env`

1. Copier le modèle fourni, à la racine du projet (au même niveau que `package.json`) :

   ```bash
   cp .env.example .env
   ```

2. Remplacer les valeurs factices par celles de l'application testée :

   ```dotenv
   BASE_URL=https://example.com

   STANDARD_ID=votre-identifiant
   STANDARD_PASSWORD=votre-mot-de-passe
   ```

3. Vérifier avec `git status` que `.env` n'apparaît pas dans les fichiers à commiter.

#### Les variables

| Variable            | Rôle                                                      |
| ------------------- | --------------------------------------------------------- |
| `BASE_URL`          | URL de l'application testée                               |
| `<PROFIL>_ID`       | Identifiant du compte de test du profil (ex. `STANDARD_`) |
| `<PROFIL>_PASSWORD` | Mot de passe du compte de test du profil                  |

Chaque compte est un **profil** : le test choisit celui qu'il utilise. Pour ajouter un compte, voir [docs/connexion.md](docs/connexion.md).

#### Plusieurs environnements (facultatif)

Lancer cette commande :

```bash
npm install -D cross-env
```

Pour tester plusieurs environnements, créer un fichier par environnement (`.env.dev`, `.env.staging`, etc...) contenant **toutes** les variables, puis choisir l'environnement au lancement :

```bash
npx cross-env ENV=staging npx playwright test
```

Sans `ENV`, seul le `.env` par défaut est chargé.

#### ⚠️ Sécurité

- Ne jamais versionner un fichier contenant des identifiants. Le `.gitignore` doit contenir :

  ```
  /.env
  /.env.*
  !/.env.example
  ```

- `.env.example` est versionné : il ne contient que les noms des variables et des **valeurs fictives**.
- Utiliser uniquement des **comptes de test dédiés**, jamais un compte réel.
- En CI, les valeurs viennent des secrets GitHub (voir [docs/connexion.md](docs/connexion.md)).

## 🚀 Commandes principales

| Commande                                | Description                                   |
| --------------------------------------- | --------------------------------------------- |
| `npx playwright test`                   | Exécuter tous les tests                       |
| `npx playwright test --ui`              | Lancer le mode UI                             |
| `npx playwright test --headed`          | Exécuter les tests avec le navigateur visible |
| `npx playwright test --project=firefox` | Lancer sur Firefox (non lancé par défaut)     |
| `npx playwright test --project="*"`     | Lancer sur tous les navigateurs configurés    |
| `npx playwright test --grep @smoke`     | Lancer seulement les tests d'un tag           |
| `npx playwright test --list`            | Lister les tests sans les exécuter            |
| `npx playwright show-report`            | Afficher le rapport HTML                      |

Pour les commandes de qualité du code et de vérification, consultez la [documentation des commandes de développement](docs/commandes-developpement.md).

## 🧰 Fonctionnalités

- **TypeScript** : typage statique pour sécuriser et structurer le code.
- **Playwright** : exécution des tests end-to-end sur plusieurs navigateurs.
- **ESLint** : analyse statique du code avec des règles adaptées à TypeScript et Playwright.
- **Prettier** : formatage automatique et homogène du code.
- **Page Object Model** : séparation des interactions avec les pages et des scénarios de test.
- **Fixtures personnalisées** : réutilisation et gestion du contexte de test.
- **Comptes de test par profils** : identifiants stockés dans le `.env`, avec un profil choisi dans chaque test (voir [Connexion et comptes de test](docs/connexion.md)).

## 📁 Structure du projet

```text
playwright-starter-ts/
├── .github/
│   └── workflows/              # Pipeline CI (GitHub Actions)
├── docs/                       # Documentation détaillée
├── fixtures/                   # Fixtures personnalisées Playwright
├── pages/                      # Page Objects
├── tests/                      # Tests end-to-end (.spec.ts)
├── utils/                      # Fonctions et classes utilitaires
├── .env.example                # Modèle du fichier .env (valeurs factices)
├── .prettierignore             # Fichiers ignorés par Prettier
├── .prettierrc                 # Configuration Prettier
├── eslint.config.mjs           # Configuration ESLint
├── package.json                # Dépendances et scripts npm
├── playwright.config.ts        # Configuration Playwright
└── tsconfig.json               # Configuration TypeScript
```

## 📚 Documentation détaillée

- 🖥️ [Commandes de développement](docs/commandes-developpement.md)
- 📝 [Conventions](docs/conventions.md)
- 🧩 [Fixtures](docs/fixtures.md)
- 🔄 [Mettre à jour Playwright](docs/mettre-a-jour-playwright.md)

## 👤 Auteur

Projet développé par Corentin H.
