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

## 🔐 2. Configurer les variables d'environnement

Les tests utilisent des variables d'environnement pour récupérer leur configuration, notamment l'URL de l'application testée. Ces variables sont définies dans un fichier `.env`, qui ne doit **jamais être versionné**.

### Créer le fichier `.env`

1. À la racine du projet, au même niveau que `package.json`, copie le fichier modèle :

   ```bash
   cp .env.example .env
   ```

2. Ouvre le fichier `.env` et remplace lA valeur fictive par celle correspondant à ton environnement de test :

   ```dotenv
   BASE_URL=https://example.com
   ```

3. Vérifie que le fichier `.env` est bien ignoré par Git :

   ```bash
   git status
   ```

   Si le fichier `.env` apparaît parmi les fichiers à commiter, vérifie qu'il est bien ajouté au fichier `.gitignore`.

### Variables d'environnement

| Variable   | Rôle                         |
| ---------- | ---------------------------- |
| `BASE_URL` | URL de l'application testée. |

#### Plusieurs environnements (facultatif)

Lancer cette commande :

```bash
npm install -D cross-env
```

Pour tester plusieurs environnements, créer un fichier par environnement (`.env.dev`, `.env.staging`, etc...) contenant la variable `BASE_URL`, puis choisir l'environnement au lancement :

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

- **TypeScript** : typage statique pour améliorer la fiabilité et la maintenabilité du code.
- **Playwright** : automatisation des tests end-to-end sur plusieurs navigateurs.
- **ESLint** : analyse statique du code avec des règles adaptées à TypeScript et Playwright.
- **Prettier** : formatage homogène du code pour faciliter sa lecture et sa maintenance.
- **Page Object Model (POM)** : séparation des interactions avec les pages et des scénarios de test.
- **Fixtures personnalisées** : réutilisation des ressources et gestion du contexte de test.
- **Comptes de test par profil** : identifiants stockés dans `config/test-users.json`, avec sélection du profil utilisé par chaque test (voir [Connexion et comptes de test](docs/connexion.md)).
- **Intégration continue avec GitHub Actions** : exécution automatique des vérifications ESLint, Prettier et TypeScript lors des push et des pull requests.
- **Exécution manuelle des tests E2E** : lancement des tests Playwright sur l'environnement choisi (`staging` ou `production`) depuis GitHub Actions.

## 📁 Structure du projet

```text
playwright-starter-ts/
├── .github/
│   └── workflows/
│       ├── code-quality.yml       # Vérifications automatiques du code
│       └── playwright.yml         # Exécution manuelle des tests E2E
├── config/
│   ├── test-users.example.json    # Modèle des comptes de test
│   └── test-users-config.ts       # Chargement des comptes de test
├── docs/                          # Documentation détaillée
├── fixtures/                      # Fixtures personnalisées Playwright
├── pages/                         # Page Objects
├── tests/                         # Tests end-to-end (.spec.ts)
├── utils/                         # Fonctions et classes utilitaires
├── .env.example                   # Modèle des variables d'environnement
├── .gitignore                     # Fichiers ignorés par Git
├── .prettierignore                # Fichiers ignorés par Prettier
├── .prettierrc                    # Configuration Prettier
├── eslint.config.mjs              # Configuration ESLint
├── package.json                   # Dépendances et scripts npm
├── package-lock.json              # Versions verrouillées des dépendances
├── playwright.config.ts           # Configuration Playwright
└── tsconfig.json                  # Configuration TypeScript
```

**Remarque :** les fichiers `.env` et `config/test-users.json` sont des fichiers locaux contenant la configuration et les identifiants des comptes de test. Ils ne doivent pas être versionnés. Seuls leurs modèles respectifs sont suivis par Git.

## 📚 Documentation détaillée

- 🚀 [CI/CD — Intégration et exécution des tests](docs/ci-cd.md)
- 🖥️ [Commandes de développement](docs/commandes-developpement.md)
- 🔐 [Connexion et comptes de test](docs/connexion.md)
- 📝 [Conventions de nommage](docs/conventions.md)
- 🧩 [Fixtures](docs/fixtures.md)
- 🔄 [Mettre à jour Playwright](docs/mettre-a-jour-playwright.md)

## 👤 Auteur

Projet développé par Corentin H.
