# 🔐 Connexion et comptes de test

Cette page explique comment configurer les comptes de test, choisir un profil dans les tests et fournir les identifiants nécessaires à l'exécution locale ou en intégration continue (CI).

## 🧭 Principe

- Le fichier `.env` contient la configuration générale de l'application, notamment `BASE_URL`.
- Le fichier `config/test-users.json` contient les identifiants des comptes de test. Il ne doit pas être versionné.
- Le fichier `config/test-users-config.ts` lit le fichier JSON et rend les comptes accessibles aux tests.
- Chaque test choisit le profil dont il a besoin et transmet ses identifiants à la page de connexion.
- Les Page Objects ne stockent pas les identifiants : ils les reçoivent en paramètres.

## 📁 Fichiers concernés

| Fichier                          | Rôle                                                           |
| -------------------------------- | -------------------------------------------------------------- |
| `.env`                           | Configuration locale, notamment l'URL de base                  |
| `.env.example`                   | Modèle versionné de la configuration locale                    |
| `config/test-users.json`         | Comptes de test et identifiants ; fichier ignoré par Git       |
| `config/test-users.example.json` | Exemple versionné de la structure des comptes                  |
| `config/test-users-config.ts`    | Lecture et mise à disposition des comptes de test              |
| `pages/login/login-page.ts`      | Page de connexion, avec la méthode `login(username, password)` |
| `playwright.config.ts`           | Configuration Playwright, dont l'URL de base                   |

> **À vérifier :** les noms des fichiers d'exemple doivent être cohérents dans le dépôt. Cette documentation utilise `config/test-users.example.json`.

## ⚙️ Configuration locale

### 1. Configurer `.env`

Le fichier `.env` se trouve à la racine du projet, au même niveau que `package.json`. Il contient les paramètres généraux de l'application testée.

Exemple :

```dotenv
# URL de base de l'application
BASE_URL=https://www.exemple.com
```

Copiez le modèle `.env.example` pour créer votre propre fichier `.env`, puis adaptez `BASE_URL` à l'application testée.

Le fichier `.env` ne doit pas être versionné lorsqu'il contient des informations propres à votre environnement. Vérifiez que `.env` figure dans `.gitignore`.

### 2. Comprendre `.env.example`

Le fichier `.env.example` sert de modèle aux personnes qui récupèrent le projet. Il peut être versionné à condition de ne contenir aucune donnée sensible.

Exemple :

```dotenv
# URL de base de l'application
BASE_URL=https://www.exemple.com
```

Remplacez cette URL par une valeur fictive adaptée à votre documentation, et non par une URL ou une donnée confidentielle.

### 3. Créer `config/test-users.json`

Le fichier `config/test-users.example.json` fournit un exemple de structure pour les comptes de test.

Dans le dossier `config/`, copiez ce fichier et nommez la copie `test-users.json`.

La structure du dossier sera alors :

```text
config/
├── test-users-config.ts
├── test-users.example.json
└── test-users.json
```

#### Contenu du fichier

Les comptes sont regroupés par profil. Exemple :

```json
{
  "standard": {
    "username": "standard_user",
    "password": "standard_password"
  },
  "locked": {
    "username": "locked_user",
    "password": "locked_password"
  }
}
```

Ces valeurs sont fictives : remplacez-les par les identifiants de comptes dédiés aux tests de votre application.

Chaque entrée contient :

- `username` : l'identifiant de connexion ;
- `password` : le mot de passe ;
- un nom de profil, par exemple `standard` ou `locked`, qui permet de sélectionner le compte dans les tests.

#### Ignorer le fichier avec Git

Le fichier `test-users.json` peut contenir des identifiants confidentiels. Il ne doit donc pas être versionné.

Ajoutez cette ligne au fichier `.gitignore`, à la racine du projet :

```gitignore
# Comptes de test
config/test-users.json
```

Le fichier `config/test-users.example.json` doit, lui, rester versionné afin de servir de modèle.

Si `test-users.json` est déjà suivi par Git, l'ajout dans `.gitignore` ne suffit pas à arrêter son suivi. Retirez-le de l'index Git avec :

```bash
git rm --cached config/test-users.json
```

Cette commande retire le fichier de l'index Git sans supprimer votre copie locale. Si de véritables identifiants ont déjà été envoyés vers un dépôt distant, retirez-les du dépôt et faites-les renouveler.

## 💻 Charger les comptes de test

Le fichier `config/test-users-config.ts` lit le JSON et exporte les comptes pour qu'ils puissent être utilisés dans les tests.

Exemple :

```typescript
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

interface TestUser {
  username: string;
  password: string;
}

const usersPath = resolve(process.cwd(), 'config', 'test-users.json');
const usersData = readFileSync(usersPath, 'utf-8');

export const testUsers: Record<string, TestUser> = JSON.parse(usersData);
```

L'interface `TestUser` décrit la structure d'un compte. L'objet `testUsers` regroupe les profils présents dans le fichier JSON.

Par exemple :

```typescript
testUsers.standard.username;
testUsers.standard.password;
```

Ces expressions permettent de récupérer l'identifiant et le mot de passe du profil `standard`.

Avec le type `Record<string, TestUser>`, TypeScript ne garantit pas que le nom de profil utilisé existe réellement dans le JSON. Si un profil est absent, l'accès peut échouer à l'exécution. Vérifiez que chaque profil utilisé par un test est bien défini dans `test-users.json`.

## 🔑 Page de connexion

La page de connexion ne lit ni `.env` ni `test-users.json`. Elle reçoit l'identifiant et le mot de passe en paramètres.

Exemple à adapter aux champs de l'application testée :

```typescript
import { type Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async login(username: string, password: string): Promise<void> {
    await this.page.getByLabel('Identifiant').fill(username);
    await this.page.getByLabel('Mot de passe').fill(password);
    await this.page.getByRole('button', { name: 'Se connecter' }).click();
  }
}
```

Les libellés des champs et du bouton doivent correspondre à ceux de l'application testée.

## 🧪 Utiliser un profil dans un test

Le test importe les comptes depuis `config/test-users-config.ts`, choisit un profil et transmet ses identifiants à la page de connexion.

Exemple :

```typescript
import { test } from '../../fixtures';
import { testUsers } from '../../config/test-users-config';

test.describe('Connexion', { tag: '@smoke' }, () => {
  test('un utilisateur standard peut se connecter', async ({ loginPage }) => {
    const user = testUsers.standard;

    await loginPage.login(user.username, user.password);
    // Ajouter les assertions correspondant au résultat attendu.
  });

  test('un utilisateur bloqué ne peut pas se connecter', async ({ loginPage }) => {
    const user = testUsers.locked;

    await loginPage.login(user.username, user.password);
    // Ajouter les assertions correspondant au résultat attendu.
  });
});
```

Le chemin `../../fixtures` dépend de l'emplacement du test : adaptez-le à l'organisation réelle du projet.

Les tests doivent vérifier le résultat attendu, par exemple la redirection vers la page d'accueil pour un utilisateur valide ou l'affichage d'un message d'erreur pour un utilisateur bloqué.

## ➕ Ajouter un compte de test

Pour ajouter un compte :

1. Ajoutez un nouveau profil dans `config/test-users.json`.
2. Renseignez son `username` et son `password`.
3. Utilisez ce profil dans le test concerné.

Exemple :

```json
{
  "standard": {
    "username": "standard_user",
    "password": "standard_password"
  },
  "admin": {
    "username": "admin_user",
    "password": "admin_password"
  }
}
```

Le profil `admin` peut ensuite être utilisé dans un test :

```typescript
const user = testUsers.admin;

await loginPage.login(user.username, user.password);
```

Aucune modification de la page de connexion n'est nécessaire pour ajouter un compte.

## 🚀 Exécution dans la CI

> [!WARNING]
> Les instructions ci-dessous concernent **GitHub Actions**, utilisé par défaut dans ce template. Si vous utilisez une autre plateforme CI/CD, comme GitLab CI/CD, Azure DevOps ou Jenkins, adaptez la configuration du pipeline à votre environnement. Le principe reste le même : fournir les identifiants de test de manière sécurisée et rendre `config/test-users.json` disponible avant l'exécution des tests.

Le fichier `config/test-users.json` n'étant pas versionné, GitHub Actions ne le récupère pas automatiquement lors du checkout du dépôt. Le workflow doit donc le créer avant de lancer les tests.

### 1. Créer le secret GitHub

Dans le dépôt GitHub, ouvrez :

**Settings → Secrets and variables → Actions → New repository secret**

Créez le secret suivant :

- **Name :** `TEST_USERS_JSON`
- **Secret :** le contenu JSON complet du fichier `config/test-users.json`.

Le contenu doit être un JSON valide contenant tous les profils nécessaires aux tests.

### 2. Recréer le fichier pendant le workflow

Dans `.github/workflows/playwright.yml`, ajoutez cette étape **avant celle qui lance les tests Playwright** :

```yaml
- name: Create test users file
  env:
    TEST_USERS_JSON: ${{ secrets.TEST_USERS_JSON }}
  run: node -e "require('node:fs').writeFileSync('config/test-users.json', process.env.TEST_USERS_JSON)"
```

Cette étape recrée le fichier à partir du secret GitHub. Le fichier `config/test-users-config.ts` peut ensuite charger les comptes comme en local.

Le dossier `config/` doit exister dans le dépôt pour que le fichier puisse y être créé.

### 3. Fournir l'URL de l'application

Le workflow doit fournir `BASE_URL` à Playwright. Pour choisir entre plusieurs environnements, par exemple `staging` et `production`, créez les variables suivantes dans GitHub Actions :

**Settings → Secrets and variables → Actions → Variables**

Créez ces variables de dépôt :

| Nom                   | Valeur                               |
| --------------------- | ------------------------------------ |
| `STAGING_BASE_URL`    | URL de l'environnement de staging    |
| `PRODUCTION_BASE_URL` | URL de l'environnement de production |

Les URL sont généralement des variables de configuration plutôt que des secrets, sauf si elles contiennent elles-mêmes des informations confidentielles.

Dans l'étape qui lance les tests de `.github/workflows/playwright.yml`, configurez `BASE_URL` en fonction de l'environnement choisi :

```yaml
- name: Run Playwright tests
  run: npx playwright test
  env:
    BASE_URL: ${{ inputs.environment == 'production' && vars.PRODUCTION_BASE_URL || vars.STAGING_BASE_URL }}
```

Cette expression suppose que le workflow possède un input `environment` dont les valeurs possibles sont `staging` et `production`.

- `staging` utilise `STAGING_BASE_URL`.
- `production` utilise `PRODUCTION_BASE_URL`.

Vérifiez que les noms des variables GitHub correspondent exactement à ceux utilisés dans le workflow.

### 4. Utiliser `BASE_URL` dans Playwright

Dans `playwright.config.ts`, la configuration Playwright peut récupérer l'URL fournie par l'environnement :

```typescript
use: {
  baseURL: process.env.BASE_URL,
},
```

Les tests et les pages peuvent alors utiliser des chemins relatifs, par exemple `page.goto('/')`, sans répéter l'URL complète.

En local, `BASE_URL` peut être chargée depuis `.env` si le projet charge ce fichier. Dans GitHub Actions, le workflow la fournit directement à l'étape d'exécution des tests.

### Points de vigilance

- Le secret `TEST_USERS_JSON` doit contenir un JSON valide.
- Le workflow doit créer `config/test-users.json` avant l'import du module qui le lit et avant le lancement des tests.
- N'affichez jamais le contenu du secret dans les logs.
- Utilisez des comptes dédiés aux tests et évitez les comptes personnels.
- Évitez d'exécuter des tests destructifs sur un environnement de production ou avec des comptes de production.

## 🛡️ Règles et précautions

- Ne versionnez pas `.env` ni `config/test-users.json` lorsqu'ils contiennent des données propres à votre environnement ou des identifiants.
- Vérifiez que ces fichiers sont ignorés par Git. `git status` permet de vérifier les fichiers qui seront inclus dans un commit.
- Utilisez uniquement des comptes dédiés aux tests.
- Ne placez pas les identifiants directement dans les tests ou les Page Objects : les tests choisissent un profil et transmettent ses identifiants à la page.
- Les rapports, traces et vidéos Playwright peuvent contenir des informations saisies pendant les tests. Évitez d'y faire apparaître des données sensibles.
- Si un ancien utilitaire de gestion des variables d'environnement, par exemple `utils/env-utils.ts`, n'est plus utilisé, vérifiez les imports avant de le supprimer.

## 🩺 Dépannage

| Symptôme                                | Cause probable                                                | Vérification                                                               |
| --------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Erreur de lecture de `test-users.json`  | Le fichier est absent ou le chemin est incorrect              | Vérifiez que le fichier existe dans `config/` avant le lancement des tests |
| Erreur de syntaxe JSON                  | Le contenu n'est pas un JSON valide                           | Vérifiez les guillemets, les virgules et les accolades                     |
| Un profil est introuvable               | Le nom utilisé dans le test ne correspond pas à celui du JSON | Comparez le nom du profil dans le test et dans `test-users.json`           |
| Fonctionne en local, mais échoue en CI  | Le secret est absent ou le fichier n'est pas recréé           | Vérifiez le secret, le chemin et l'ordre des étapes du workflow            |
| L'application testée n'est pas la bonne | `BASE_URL` est absente ou incorrecte                          | Vérifiez la valeur locale ou la variable fournie par le workflow           |
| Erreur de connexion                     | Les identifiants ou l'URL ne sont pas corrects                | Vérifiez `BASE_URL` et le profil utilisé                                   |
