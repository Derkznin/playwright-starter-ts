# Connexion et comptes de test

Cette page explique comment gérer les identifiants de connexion dans le template : où les stocker, comment choisir le compte utilisé par un test et comment les fournir à la CI avec GitHub Actions.

## Principe

- Le fichier `.env` contient la configuration générale de l'application, notamment `BASE_URL`.
- Le fichier `test-users.json` contient les identifiants des comptes de test. Il ne doit pas être versionné.
- Le fichier `config/test-users-config.ts` lit le fichier JSON et rend les comptes accessibles aux tests.
- Le test choisit le profil à utiliser et transmet ses identifiants à la page de connexion.
- Les pages ne contiennent aucune donnée de connexion : elles reçoivent l'identifiant et le mot de passe en paramètres.

## Fichiers concernés

| Fichier                       | Rôle                                                                  |
| ----------------------------- | --------------------------------------------------------------------- |
| `.env`                        | Configuration locale, notamment l'URL de base                         |
| `.env.example`                | Modèle de configuration versionné                                     |
| `test-users.json`             | Comptes de test et identifiants, ignorés par Git                      |
| `config/test-users-config.ts` | Lecture et mise à disposition des comptes de test                     |
| `utils/env-utils.ts`          | Utilitaires pour les variables d'environnement, si encore nécessaires |
| `pages/login/login-page.ts`   | Page de connexion avec la méthode `login(username, password)`         |
| `playwright.config.ts`        | Configuration Playwright et chargement des variables d'environnement  |

## Configuration

### 1. Le fichier `.env`

Ce fichier se trouve à la racine du projet, à côté de `package.json`.

Il contient les paramètres généraux de l'environnement testé.

Exemple :

```dotenv
# URL de base de l'application
BASE_URL=https://www.saucedemo.com
```

Le fichier `.env` ne doit pas être versionné s'il contient des informations sensibles.

### 2. Le fichier `.env.example`

Ce fichier sert de modèle aux personnes qui récupèrent le projet. Il peut être versionné puisqu'il ne contient pas de mot de passe.

Exemple :

```dotenv
# URL de base de l'application
BASE_URL=https://www.saucedemo.com
```

### 3. Le fichier `test-users.json`

Ce fichier se trouve à la racine du projet. Il contient les identifiants des comptes de test, regroupés par profil.

Exemple :

```json
{
  "standard": {
    "username": "standard_user",
    "password": "secret_sauce"
  },
  "locked": {
    "username": "locked_out_user",
    "password": "secret_sauce"
  }
}
```

Les identifiants ci-dessus sont des exemples publics de SauceDemo.

Chaque compte possède :

- `username` : l'identifiant de connexion ;
- `password` : le mot de passe ;
- un nom de profil, par exemple `standard` ou `locked`, qui permet de sélectionner le compte dans les tests.

**Important :** ajouter `test-users.json` dans `.gitignore` afin d'éviter de versionner les identifiants.

```gitignore
# Comptes de test
test-users.json
```

Si le fichier a déjà été suivi par Git, l'ajout dans `.gitignore` ne suffit pas à arrêter son suivi. Il faut également le retirer de l'index Git.

### 4. Le fichier `config/test-users-config.ts`

Ce fichier lit le JSON et exporte les comptes pour qu'ils puissent être utilisés dans les tests.

Exemple :

```typescript
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

interface TestUser {
  username: string;
  password: string;
}

const usersPath = resolve(process.cwd(), 'test-users.json');
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

### 5. La page de connexion

La page de connexion ne lit ni `.env` ni `test-users.json`. Elle reçoit les identifiants en paramètres.

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

## Utilisation dans un test

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

## Ajouter un compte de test

Pour ajouter un compte :

1. Ajouter un nouveau profil dans `test-users.json`.
2. Renseigner son `username` et son `password`.
3. Utiliser le nouveau profil dans le test concerné.

Exemple d'un profil `admin` :

```json
{
  "standard": {
    "username": "standard_user",
    "password": "secret_sauce"
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

## Exécution dans la CI avec GitHub Actions

Le fichier `test-users.json` n'étant pas versionné, GitHub Actions ne le récupère pas automatiquement.

Pour exécuter les tests dans la CI, il faut fournir les comptes de test de manière sécurisée.

### 1. Créer un secret GitHub

Dans le dépôt GitHub, ouvrir :

**Settings > Secrets and variables > Actions > New repository secret**

Créer le secret suivant :

- **Name :** `TEST_USERS_JSON`
- **Secret :** le contenu JSON complet de `test-users.json`.

Le contenu doit être un JSON valide contenant les profils nécessaires aux tests.

### 2. Recréer le fichier pendant le workflow

Dans `.github/workflows/playwright.yml`, ajouter cette étape **avant "Run Playwright tests" qui lance les tests** :

```yaml
- name: Create test users file
  env:
    TEST_USERS_JSON: ${{ secrets.TEST_USERS_JSON }}
  run: node -e "require('node:fs').writeFileSync('test-users.json', process.env.TEST_USERS_JSON)"
```

Cette étape recrée le fichier `test-users.json` à la racine du projet. Le fichier `config/test-users-config.ts` peut alors le lire comme en local.

Le workflow doit également fournir `BASE_URL` si cette variable est nécessaire à l'environnement testé.

**Attention :** la présence du secret ne suffit pas à elle seule. Le workflow doit recréer le fichier avant l'exécution des tests. Il faut également éviter d'afficher son contenu dans les logs.

Utiliser uniquement des comptes dédiés aux tests, jamais des comptes personnels ou de production.

## Règles et précautions

- Ne jamais versionner `.env` ou `test-users.json` lorsqu'ils contiennent des informations sensibles.
- Vérifier avec `git status` que ces fichiers ne sont pas suivis par Git.
- Utiliser uniquement des comptes de test dédiés.
- Ne pas placer les identifiants directement dans les tests ou les pages : les tests choisissent un profil et transmettent ses identifiants à la page.
- Les rapports, traces et vidéos Playwright peuvent contenir des informations saisies pendant les tests. Éviter d'y utiliser des données sensibles.
- Ne pas conserver plusieurs systèmes de gestion des identifiants en parallèle sans nécessité. Si `utils/env-utils.ts` n'est plus utilisé, il peut être supprimé après vérification des imports.

## Dépannage

| Symptôme                               | Cause probable                                                        | Vérification                                                |
| -------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------- |
| Erreur de lecture de `test-users.json` | Le fichier est absent ou le chemin est incorrect                      | Vérifier que le fichier se trouve à la racine du projet     |
| Erreur de syntaxe JSON                 | Le contenu du fichier n'est pas un JSON valide                        | Vérifier les guillemets, les virgules et les accolades      |
| Un profil est introuvable              | Le nom utilisé dans le test ne correspond pas à celui du JSON         | Comparer le nom du profil dans les deux fichiers            |
| Fonctionne en local, mais échoue en CI | Le secret est absent ou le fichier n'est pas recréé                   | Vérifier le secret GitHub et l'ordre des étapes du workflow |
| Erreur de connexion                    | Les identifiants ou l'URL ne sont pas corrects                        | Vérifier `BASE_URL` et les comptes utilisés                 |
| Erreur TypeScript sur un profil        | La structure des données ou le type utilisé ne correspond pas au code | Vérifier le profil et la structure de `TestUser`            |
