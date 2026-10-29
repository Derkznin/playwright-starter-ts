# 🚀 CI/CD — Playwright TypeScript Test Template

## 📋 1. Présentation

Ce projet utilise **GitHub Actions** pour automatiser les contrôles qualité et permettre l'exécution des tests end-to-end (E2E).

La configuration est séparée en deux workflows :

- **✅ Check code quality** : exécute automatiquement les contrôles qualité du code lors d'un push ou d'une pull request.
- **🎭 Playwright tests** : permet de lancer manuellement les tests E2E sur l'environnement souhaité.

Cette organisation permet de vérifier la qualité du code régulièrement tout en gardant le contrôle sur l'exécution des tests E2E.

> ⚠️ **Note :** GitHub Actions est la plateforme utilisée par défaut dans ce template. Les principes décrits ici peuvent être adaptés à GitLab CI/CD, Azure DevOps, Jenkins ou une autre solution.

## 🗂️ 2. Organisation des workflows

Les workflows sont définis dans le dossier `.github/workflows/`.

| Workflow           | Déclenchement        | Objectif                    |
| ------------------ | -------------------- | --------------------------- |
| `code-quality.yml` | Push et pull request | Vérifier la qualité du code |
| `playwright.yml`   | Déclenchement manuel | Exécuter les tests E2E      |

### 🧹 2.1. Contrôles qualité

Le workflow `code-quality.yml` exécute les commandes suivantes :

```bash
npm ci
npm run lint
npm run format:check
npm run typecheck
```

- 📦 `npm ci` installe les dépendances à partir du fichier `package-lock.json`.
- 🔎 `npm run lint` vérifie les règles ESLint.
- 🎨 `npm run format:check` vérifie le formatage avec Prettier sans modifier les fichiers.
- 🛠️ `npm run typecheck` vérifie les types TypeScript.

Ce workflow permet de détecter rapidement les erreurs de qualité avant l'intégration des modifications dans la branche principale.

### 🎭 2.2. Tests E2E Playwright

Le workflow `playwright.yml` permet de lancer les tests E2E manuellement sur un environnement sélectionné.

Les environnements proposés sont :

- 🧪 `staging` : environnement de test ou de préproduction.
- 🌐 `production` : environnement de production, si l'exécution des tests y est autorisée.

Le workflow doit rendre les identifiants de test disponibles et définir l'URL de l'application avant de lancer les tests.

> ⚠️ **Attention :** les tests exécutés sur un environnement de production doivent être conçus pour ne pas modifier ni supprimer de données réelles.

## ▶️ 3. Déclencher les tests E2E

Pour lancer le workflow manuellement :

1. Ouvrir le dépôt sur GitHub.
2. Accéder à l'onglet **Actions**.
3. Sélectionner le workflow **Playwright tests**.
4. Cliquer sur **Run workflow**.
5. Choisir la branche et l'environnement souhaités (`staging` ou `production`).
6. Cliquer sur le bouton de lancement du workflow.

Une fois l'exécution terminée, sélectionner le job pour consulter les étapes exécutées et les éventuelles erreurs.

Les options affichées dépendent de la configuration présente dans `.github/workflows/playwright.yml`.

## ⚙️ 4. Configurer les variables et les secrets

Le workflow utilise des variables d'environnement pour sélectionner l'application cible et un secret pour accéder aux comptes de test.

### 🌍 4.1. Variables d'environnement

Dans le dépôt GitHub, accéder à :

**Settings → Secrets and variables → Actions → Variables**

Créer les variables suivantes :

| Nom                   | Description                                      | Exemple                       |
| --------------------- | ------------------------------------------------ | ----------------------------- |
| `STAGING_BASE_URL`    | URL de l'application de test ou de préproduction | `https://staging.example.com` |
| `PRODUCTION_BASE_URL` | URL de l'application de production               | `https://example.com`         |

Remplacer les exemples par les URL réelles des environnements.

### 🔐 4.2. Secret des comptes de test

Dans :

**Settings → Secrets and variables → Actions → Secrets**

Créer le secret suivant :

| Nom               | Description                                                          |
| ----------------- | -------------------------------------------------------------------- |
| `TEST_USERS_JSON` | Contenu JSON des comptes de test nécessaires à l'exécution des tests |

Le secret doit contenir un JSON valide correspondant à la structure attendue par `config/test-users-config.ts`.

Exemple de structure :

```json
{
  "standard": {
    "username": "test-user",
    "password": "test-password"
  }
}
```

Les valeurs ci-dessus sont fictives et doivent être remplacées par des identifiants de test appropriés.

> 🛡️ Ne jamais publier de véritables mots de passe dans le dépôt, les logs ou la documentation.

## 🔑 5. Mise à disposition des comptes de test

Le fichier `config/test-users.json` contient les comptes de test utilisés localement par les tests. Ce fichier est exclu du dépôt afin de ne pas versionner les identifiants.

GitHub Actions ne récupère donc pas ce fichier lors du checkout du dépôt.

Le workflow doit le recréer à partir du secret `TEST_USERS_JSON` **avant l'exécution des tests**.

Exemple d'étape dans `.github/workflows/playwright.yml` :

```yaml
- name: Create test users configuration
  env:
    TEST_USERS_JSON: ${{ secrets.TEST_USERS_JSON }}
  run: |
    node -e "require('node:fs').writeFileSync(
      'config/test-users.json',
      process.env.TEST_USERS_JSON
    )"
```

Cette étape suppose que le répertoire `config/` existe déjà dans le dépôt.

L'étape qui exécute les tests doit venir après la création du fichier.

## 🌐 6. Sélection de l'environnement

Le workflow peut transmettre à Playwright l'URL correspondant à l'environnement sélectionné.

Exemple d'étape d'exécution :

```yaml
- name: Run Playwright tests
  run: npx playwright test
  env:
    BASE_URL: ${{ inputs.environment == 'production' && vars.PRODUCTION_BASE_URL || vars.STAGING_BASE_URL }}
```

Cette expression suppose que le workflow définit une entrée `environment` avec les valeurs `staging` et `production`.

Dans `playwright.config.ts`, la configuration doit utiliser la variable `BASE_URL` :

```ts
use: {
  baseURL: process.env.BASE_URL,
},
```

Si le projet prévoit une valeur par défaut, celle-ci peut être définie avec l'opérateur `??`. En CI, il est toutefois préférable de vérifier qu'une URL valide est bien fournie pour éviter d'exécuter les tests sur un environnement inattendu.

## 🔄 7. Ordre général des étapes

Le workflow des tests E2E doit respecter l'ordre suivant :

1. 📥 Récupérer le dépôt.
2. 📦 Installer Node.js et les dépendances avec `npm ci`.
3. 🌐 Installer les navigateurs nécessaires avec `npx playwright install --with-deps`.
4. 🔐 Créer `config/test-users.json` à partir du secret `TEST_USERS_JSON`.
5. ⚙️ Définir `BASE_URL` selon l'environnement sélectionné.
6. 🧪 Exécuter les tests avec `npx playwright test`.
7. 📊 Consulter les résultats et les logs en cas d'échec.

L'ordre exact des étapes peut varier selon le workflow, mais les dépendances, la configuration et les navigateurs doivent être prêts avant l'exécution des tests.

## 📊 8. Consulter les résultats

Après l'exécution d'un workflow :

1. Ouvrir **Actions** dans GitHub.
2. Sélectionner l'exécution concernée.
3. Ouvrir le job correspondant.
4. Examiner les étapes et les logs pour identifier la cause d'un éventuel échec.

Pour reproduire un problème localement, vérifier que l'environnement, les comptes de test et les versions des dépendances correspondent à la configuration utilisée en CI.

## 🛡️ 9. Sécurité

Quelques règles doivent être respectées :

- 🔒 Ne jamais versionner `config/test-users.json` s'il contient des identifiants réels.
- 🔑 Ne jamais enregistrer de mots de passe dans le code ou dans les logs.
- 🤫 Utiliser les secrets GitHub Actions pour les informations sensibles.
- 👤 Utiliser des comptes dédiés aux tests, avec des droits limités.
- ⚠️ Éviter les tests destructifs sur un environnement de production.
- 🔍 Limiter l'accès aux secrets aux workflows et aux personnes qui en ont besoin.
- 📁 Vérifier qu'aucune donnée sensible n'est publiée dans les rapports ou les pièces jointes générés par les tests.

## 🔧 10. Adapter la CI/CD à une autre plateforme

GitHub Actions est la solution configurée par défaut, mais ce template peut être adapté à d'autres plateformes.

Lors de l'adaptation, conserver les mêmes principes :

- 📦 Installer la version de Node.js attendue par le projet.
- 📥 Installer les dépendances à partir du fichier `package-lock.json`.
- 🌐 Installer les navigateurs Playwright nécessaires.
- ⚙️ Fournir `BASE_URL` pour sélectionner l'application cible.
- 🔐 Rendre `config/test-users.json` disponible de manière sécurisée avant les tests.
- 🔄 Exécuter les contrôles qualité et les tests E2E selon les déclencheurs souhaités.
- 📊 Conserver les logs et, si nécessaire, les rapports de tests comme artefacts.

La configuration propre à chaque plateforme doit être documentée dans son pipeline respectif.

---

## 📚 Documentation associée

- [Gestion des comptes de test](connexion.md)
