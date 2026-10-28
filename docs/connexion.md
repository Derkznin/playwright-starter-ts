# 🔐 Connexion et comptes de test

Cette page explique comment gérer les identifiants de connexion dans le template : où les stocker, comment choisir le compte utilisé par un test et comment les fournir à la CI avec GitHub Actions.

## 🧭 Principe

- Le fichier `.env` contient la configuration générale de l'application, notamment `BASE_URL`.
- Le fichier `config/test-users.json` contient les identifiants des comptes de test. Il ne doit pas être versionné.
- Le fichier `config/test-users-config.ts` lit le fichier JSON et rend les comptes accessibles aux tests.
- Le test choisit le profil à utiliser et transmet ses identifiants à la page de connexion.
- Les pages ne contiennent aucune donnée de connexion : elles reçoivent l'identifiant et le mot de passe en paramètres.

## 📁 Fichiers concernés

| Fichier                          | Rôle                                                                 |
| -------------------------------- | -------------------------------------------------------------------- |
| `.env`                           | Configuration locale, notamment l'URL de base                        |
| `.env.example`                   | Modèle de configuration versionné                                    |
| `config/test-users.json`         | Comptes de test et identifiants, ignorés par Git                     |
| `config/test-users-example.json` | Comptes de test et identifiants d'exemple                            |
| `config/test-users-config.ts`    | Lecture et mise à disposition des comptes de test                    |
| `pages/login/login-page.ts`      | Page de connexion avec la méthode `login(username, password)`        |
| `playwright.config.ts`           | Configuration Playwright et chargement des variables d'environnement |

## ⚙️ Configuration

### 📄 1. Le fichier .env

Ce fichier se trouve à la racine du projet, à côté de `package.json`.

Il contient les paramètres généraux de l'environnement testé.

Exemple :

```dotenv
# URL de base de l'application
BASE_URL=https://www.exemple.com
```

Le fichier `.env` ne doit pas être versionné s'il contient des informations sensibles.

### 📄 2. Le fichier .env.example

Ce fichier sert de modèle aux personnes qui récupèrent le projet. Il peut être versionné puisqu'il ne contient pas de mot de passe.

Exemple :

```dotenv
# URL de base de l'application
BASE_URL=https://www.exemple.com
```

### 📄 3. Le fichier test-users.json

#### 📋 Fichier d'exemple

Le fichier `config/test-users.example.json` fournit un modèle de configuration contenant des exemples de comptes de test.

#### 🛠️ Création du fichier

Dans le dossier `config/`, copiez le fichier `test-users.example.json` et nommez la copie `test-users.json`.

La structure du dossier sera la suivante :

```text
config/
├── test-users-config.ts
├── test-users.example.json
└── test-users.json
```

#### 📝 Contenu du fichier

Le fichier `test-users.json` contient les identifiants des comptes de test, regroupés par profil.

Exemple :

```json
{
  "standard": {
    "username": "standard_user",
    "password": "standard_user"
  },
  "locked": {
    "username": "locked_user",
    "password": "locked_user"
  }
}
```

Les identifiants ci-dessus sont des exemples. Adaptez-les aux comptes de test de votre application.

Chaque compte possède :

- `username` : l'identifiant de connexion ;
- `password` : le mot de passe ;
- un nom de profil, par exemple `standard` ou `locked`, qui permet de sélectionner le compte dans les tests.

#### 🚫 Ignorer le fichier avec Git

Le fichier `test-users.json` peut contenir des identifiants confidentiels. Il ne doit donc pas être versionné dans le dépôt.

Ajoutez la ligne suivante au fichier `.gitignore`, situé à la racine du projet :

```gitignore
# Comptes de test
config/test-users.json
```

Le fichier `config/test-users.example.json`, quant à lui, doit rester versionné afin de servir de modèle.

Si `test-users.json` a déjà été suivi par Git, l'ajout dans `.gitignore` ne suffit pas à arrêter son suivi. Retirez-le de l'index Git avec la commande suivante :

```bash
git rm --cached config/test-users.json
```

### 💻 4. Le fichier `config/test-users-config.ts`

Ce fichier lit le JSON et exporte les comptes pour qu'ils puissent être utilisés dans les tests.

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

Le type `TestUser` décrit la structure d'un compte. L'objet `testUsers` regroupe tous les profils présents dans le fichier JSON.

Par exemple :

```typescript
testUsers.standard.username;
testUsers.standard.password;
```

Ces expressions permettent de récupérer l'identifiant et le mot de passe du profil `standard`.

### 🔑 5. La page de connexion

La page de connexion ne lit ni `.env` ni `test-users-config.json`. Elle reçoit les identifiants en paramètres.

Exemple à adapter aux champs de l'application testée :

```typescript
import { type Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async login(username: string, password: string): Promise<void> {
    await this.page.getByLabel('Identifiant').fill(username);
    await this.page.getByLabel('Mot de passe').fill(password);
    await this.page
      .getByRole('button', {
        name: 'Se connecter',
      })
      .click();
  }
}
```

Les libellés des champs et du bouton doivent correspondre à ceux de l'application testée.

## 🧪 Utilisation dans un test

Le test importe les comptes depuis `config/test-users-config.ts`, choisit un profil et transmet ses identifiants à la page de connexion.

Exemple :

```typescript
import { test } from '../../fixtures';
import { testUsers } from '../../config/test-users-config';

test.describe('Connexion', { tag: '@smoke' }, () => {
  test('un utilisateur standard peut se connecter', async ({ loginPage }) => {
    const user = testUsers.standard;

    await loginPage.login(user.username, user.password);
  });

  test('un utilisateur bloqué ne peut pas se connecter', async ({ loginPage }) => {
    const user = testUsers.locked;

    await loginPage.login(user.username, user.password);
  });
});
```

Le chemin `../../fixtures` dépend de l'emplacement du test. Il faut l'adapter à l'organisation réelle du projet.

Les tests doivent également vérifier le résultat attendu : par exemple, la redirection vers la page d'accueil pour un utilisateur valide ou l'affichage d'un message d'erreur pour un utilisateur bloqué.

## ➕ Ajouter un compte de test

Pour ajouter un compte :

1. Ajouter un nouveau profil dans `config/test-users.json`.
2. Renseigner son `username` et son `password`.
3. Utiliser le nouveau profil dans le test concerné.

Exemple d'un profil `admin` :

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

Avec le type `Record<string, TestUser>`, TypeScript ne vérifie toutefois pas automatiquement que le nom du profil existe dans le JSON. Si le profil est absent, il faudra corriger le fichier ou le nom utilisé dans le test.

## 🚀 Exécution dans la CI avec GitHub Actions

Le fichier `config/test-users.json` n'étant pas versionné, GitHub Actions ne le récupère pas automatiquement lors de la récupération du dépôt.

Pour exécuter les tests dans la CI, il faut fournir les comptes de test de manière sécurisée, puis recréer ce fichier pendant le workflow.

### 🔒 1. Créer un secret GitHub

Dans le dépôt GitHub, ouvrez :

**Settings > Secrets and variables > Actions > New repository secret**

Créez le secret suivant :

- **Name :** `TEST_USERS_JSON`
- **Secret :** le contenu JSON complet du fichier `config/test-users.json`.

Le contenu doit être un JSON valide contenant les profils nécessaires aux tests.

### 🧰 2. Recréer le fichier pendant le workflow

Dans `.github/workflows/playwright.yml`, ajoutez l'étape suivante **avant "name: Run Playwright tests" qui lance les tests Playwright** :

```yaml
- name: Create test users file
  env:
    TEST_USERS_JSON: ${{ secrets.TEST_USERS_JSON }}
  run: node -e "require('node:fs').writeFileSync('config/test-users.json', process.env.TEST_USERS_JSON)"
```

Cette étape recrée le fichier `config/test-users.json` à partir du secret GitHub. Le fichier `config/test-users-config.ts` peut alors charger les comptes de test comme en local.

Le dossier `config/` doit exister dans le dépôt pour que le fichier puisse y être créé.

### 🌍 3. Fournir l'URL de l'application

Si les tests utilisent la variable d'environnement `BASE_URL`, le workflow doit lui fournir l'URL de l'application à tester.

Pour pouvoir choisir entre plusieurs environnements, par exemple _staging_ et _production_, vous pouvez créer des variables dans GitHub Actions.

#### ⚙️ Créer les variables dans GitHub

Dans votre dépôt GitHub, ouvrez :

**Settings > Secrets and variables > Actions > Variables**

1. Cliquez sur **New repository variable**.
2. Créez la variable :
   - **Name :** `PRODUCTION_BASE_URL`
   - **Value :** l'URL de votre environnement de staging, par exemple `https://production.exemple.com`.

Remplacez l'URL par celle de votre application.

Ces valeurs sont des **variables GitHub Actions**, et non des secrets, car les URL ne sont généralement pas confidentielles. Si une URL contient des informations sensibles, utilisez plutôt un secret.

#### 🔗 Utiliser les variables dans le workflow

Dans `.github/workflows/playwright.yml`, configurez la variable `BASE_URL` dans l'étape qui lance les tests :

```yaml
- name: Run Playwright tests
  run: npx playwright test
  env:
    BASE_URL: ${{ inputs.environment == 'production' && vars.PRODUCTION_BASE_URL || vars.STAGING_BASE_URL }}
```

Cette configuration sélectionne l'URL selon l'environnement choisi au lancement manuel du workflow :

- **`staging`** : utilise `STAGING_BASE_URL`.
- **`production`** : utilise `PRODUCTION_BASE_URL`.

Vérifiez que les noms des variables dans GitHub correspondent exactement à ceux utilisés dans le fichier YAML.

#### 🧪 Utilisation dans Playwright

Dans `playwright.config.ts`, Playwright récupère l'URL fournie par le workflow grâce à `process.env.BASE_URL` :

```typescript
use: {
  baseURL: process.env.BASE_URL,
},
```

Les tests et les pages peuvent alors utiliser des chemins relatifs, par exemple `page.goto('/')`, sans avoir à définir l'URL complète dans chaque test.

En local, la variable `BASE_URL` peut être définie dans le fichier `.env`. Dans GitHub Actions, elle est fournie directement par le workflow.

### ⚠️ Points de vigilance

- Le secret `TEST_USERS_JSON` doit contenir un JSON valide.
- Le workflow doit recréer le fichier avant l'exécution des tests.
- N'affichez jamais le contenu du secret dans les logs.
- Utilisez des comptes dédiés aux tests et évitez les comptes personnels ou les identifiants de production.

## 🛡️ Règles et précautions

- Ne jamais versionner `.env` ou `config/test-users.json` lorsqu'ils contiennent des informations sensibles.
- Vérifier avec `git status` que ces fichiers ne sont pas suivis par Git.
- Utiliser uniquement des comptes de test dédiés.
- Ne pas placer les identifiants directement dans les tests ou les pages : les tests choisissent un profil et transmettent ses identifiants à la page.
- Les rapports, traces et vidéos Playwright peuvent contenir des informations saisies pendant les tests. Éviter d'y utiliser des données sensibles.
- Ne pas conserver plusieurs systèmes de gestion des identifiants en parallèle sans nécessité. Si `utils/env-utils.ts` n'est plus utilisé, il peut être supprimé après vérification des imports.

## 🩺 Dépannage

| Symptôme                               | Cause probable                                                | Vérification                                                |
| -------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------- |
| Erreur de lecture de `test-users.json` | Le fichier est absent ou le chemin est incorrect              | Vérifier que le fichier se trouve à la racine du projet     |
| Erreur de syntaxe JSON                 | Le contenu du fichier n'est pas un JSON valide                | Vérifier les guillemets, les virgules et les accolades      |
| Un profil est introuvable              | Le nom utilisé dans le test ne correspond pas à celui du JSON | Comparer le nom du profil dans les deux fichiers            |
| Fonctionne en local, mais échoue en CI | Le secret est absent ou le fichier n'est pas recréé           | Vérifier le secret GitHub et l'ordre des étapes du workflow |
| Erreur de connexion                    | Les identifiants ou l'URL ne sont pas corrects                | Vérifier `BASE_URL` et les comptes utilisés                 |
