# 🎭 Playwright TypeScript Test Template

## 📖 Présentation du projet

Projet basé sur **Playwright** et **TypeScript**, visant à fournir un template de tests automatisés robuste, réutilisable et maintenable.

## ⚙️ Prérequis et installation

- Node.js
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

Après l'installation du projet, créer un fichier `.env` à la racine du projet, au même niveau que `package.json`.

Ce fichier permet de définir les variables d'environnement nécessaires à l'exécution des tests, comme l'URL de l'application ou les identifiants de test.

Exemple de fichier `.env` :

```dotenv
BASE_URL=https://example.com
TEST_USERNAME=your-username
TEST_PASSWORD=your-password
```

Adapter les variables aux besoins du projet.

⚠️ **Important :** ne jamais versionner le fichier `.env` s'il contient des informations sensibles. Ajouter `.env` au fichier `.gitignore` et, si nécessaire, fournir un fichier `.env.example` contenant uniquement les noms des variables et des valeurs fictives.

## 🚀 Commandes principales

| Commande                       | Description                                   |
| ------------------------------ | --------------------------------------------- |
| `npx playwright test`          | Exécuter tous les tests                       |
| `npx playwright test --ui`     | Lancer le mode UI                             |
| `npx playwright test --headed` | Exécuter les tests avec le navigateur visible |
| `npx playwright show-report`   | Afficher le rapport HTML                      |

Pour les commandes de qualité du code et de vérification, consultez la [documentation des commandes de développement](docs/commandes-developpement.md).

## 🧰 Fonctionnalités

- **TypeScript** : typage statique pour sécuriser et structurer le code.
- **Playwright** : exécution des tests end-to-end sur plusieurs navigateurs.
- **ESLint** : analyse statique du code avec des règles adaptées à TypeScript et Playwright.
- **Prettier** : formatage automatique et homogène du code.
- **Page Object Model** : séparation des interactions avec les pages et des scénarios de test.
- **Fixtures personnalisées** : réutilisation et gestion du contexte de test.

## 📁 Structure du projet

```text
my-playwright-project/
├── .github/
│   └── workflows/              # Pipelines CI/CD (optionnel)
├── docs/                       # Documentation détaillée
├── fixtures/                   # Fixtures personnalisées Playwright
├── pages/                      # Page Objects
├── tests/                      # Tests end-to-end (.spec.ts)
├── utils/                      # Fonctions et classes utilitaires
├── .eslintrc.json              # Configuration ESLint
├── .prettierrc                 # Configuration Prettier
├── .prettierignore             # Fichiers ignorés par Prettier
├── playwright.config.ts        # Configuration Playwright
├── package.json                # Dépendances et scripts npm
└── tsconfig.json               # Configuration TypeScript
```

## 📚 Documentation détaillée

- 🖥️ [Commandes de développement](docs/commandes-developpement.md)
- 📝 [Conventions de nommage](docs/conventions-nommage.md)
- 🧩 [Fixtures](docs/fixtures.md)
- 🔄 [Mettre à jour Playwright](docs/mise-a-jour-Playwright.md)

👤 Auteur

Projet développé par Corentin HARDON.
