# Connexion et comptes de test

Cette page explique comment gérer les identifiants de connexion dans le template : où les stocker, comment choisir le compte utilisé par un test, et comment les fournir à la CI.

## Principe

- Les identifiants et mots de passe sont stockés dans le fichier `.env`, qui n'est **jamais** versionné.
- Chaque compte est un **profil** (`standard`, `locked`, etc.) qui correspond à deux variables : `<PROFIL>_ID` et `<PROFIL>_PASSWORD`.
- Le **test** choisit son profil. Les **pages** ne contiennent aucune donnée : elles reçoivent un identifiant et un mot de passe en paramètres.

## Fichiers concernés

| Fichier                | Rôle                                                       |
| ---------------------- | ---------------------------------------------------------- |
| `.env`                 | Les vrais identifiants (ignoré par Git)                    |
| `.env.example`         | Le modèle du `.env`, avec des valeurs factices (versionné) |
| `utils/env-utils.ts`   | Lit les variables et retrouve les identifiants d'un profil |
| `pages/login-page.ts`  | Page de connexion : méthode `login(username, password)`    |
| `playwright.config.ts` | Charge le `.env` avec `dotenv` avant l'exécution des tests |

## Configuration

### 1. Le fichier `.env`

Deux variables par profil, avec le modèle `<PROFIL>_ID` et `<PROFIL>_PASSWORD` :

```
BASE_URL=https://www.saucedemo.com

STANDARD_ID=standard_user
STANDARD_PASSWORD=secret_sauce

LOCKED_ID=locked_out_user
LOCKED_PASSWORD=secret_sauce
```

> Ne pas utiliser `USERNAME` : Windows définit déjà cette variable (le nom de la session), et `dotenv` n'écrase pas une variable existante.

### 2. Le fichier `.env.example`

Mêmes noms de variables, valeurs factices. Il est versionné pour que chacun sache quelles variables créer :

```
BASE_URL=https://www.saucedemo.com

STANDARD_ID=votre-identifiant
STANDARD_PASSWORD=votre-mot-de-passe

LOCKED_ID=votre-identifiant
LOCKED_PASSWORD=votre-mot-de-passe
```

### 3. L'utilitaire `utils/env-utils.ts`

```typescript
// Liste des profils disponibles : ajouter ici chaque nouveau compte
export type UserProfile = 'standard' | 'locked';

export interface Credentials {
  username: string;
  password: string;
}

export class EnvUtils {
  /**
   * Lit une variable d'environnement obligatoire.
   * Lève une erreur claire si elle est absente.
   */
  static getEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
      throw new Error(`Variable d'environnement manquante : ${name}`);
    }
    return value;
  }

  /**
   * Récupère l'identifiant et le mot de passe d'un profil depuis le .env.
   * Les variables suivent le modèle <PROFIL>_ID et <PROFIL>_PASSWORD.
   *
   * @param {UserProfile} profile - Nom du profil (ex. 'standard')
   */
  static getCredentials(profile: UserProfile): Credentials {
    const prefix = profile.toUpperCase();
    return {
      username: EnvUtils.getEnv(`${prefix}_ID`),
      password: EnvUtils.getEnv(`${prefix}_PASSWORD`),
    };
  }
}
```

Le type `UserProfile` est une liste fermée : un profil qui n'existe pas est signalé par TypeScript, et l'éditeur propose les profils disponibles.

### 4. La page de connexion

La page ne lit pas le `.env` : elle reçoit les identifiants en paramètres. Les libellés des champs sont des exemples à adapter à l'application testée.

```typescript
import { Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  /**
   * @param {Page} page - Instance de la page Playwright
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Se connecte avec l'identifiant et le mot de passe fournis
   *
   * @param {string} username - Identifiant
   * @param {string} password - Mot de passe
   */
  async login(username: string, password: string) {
    await this.page.getByLabel('Identifiant').fill(username);
    await this.page.getByLabel('Mot de passe').fill(password);
    await this.page.getByRole('button', { name: 'Se connecter' }).click();
  }
}
```

## Utilisation dans un test

Le test choisit son compte avec `EnvUtils.getCredentials`, puis le transmet à la page :

```typescript
import { test } from '../../fixtures';
import { EnvUtils } from '../../utils/env-utils';

test.describe('Connexion', { tag: '@smoke' }, () => {
  test('un utilisateur standard peut se connecter', async ({ loginPage }) => {
    const { username, password } = EnvUtils.getCredentials('standard');

    await loginPage.login(username, password);
  });

  test('un utilisateur bloqué ne peut pas se connecter', async ({ loginPage }) => {
    const { username, password } = EnvUtils.getCredentials('locked');

    await loginPage.login(username, password);
  });
});
```

## Ajouter un compte

1. Ajouter les deux variables dans `.env` et `.env.example` (par exemple `ADMIN_ID` et `ADMIN_PASSWORD`).
2. Ajouter le nom du profil dans le type `UserProfile` (`'standard' | 'locked' | 'admin'`).
3. Ajouter les deux secrets dans GitHub et leurs lignes dans le workflow (voir ci-dessous).

Rien à modifier dans les pages ni dans les fixtures.

## Exécution dans la CI (GitHub Actions)

Le `.env` n'est pas dans le dépôt, donc la CI ne le voit pas. Les identifiants sont fournis par des **secrets** GitHub.

1. Dans le dépôt : **Settings > Secrets and variables > Actions**, créer un secret par variable (`STANDARD_USERNAME`, `STANDARD_PASSWORD`, etc.).
2. Les transmettre à l'étape qui lance les tests, dans `.github/workflows/playwright.yml` :

```yaml
- name: Run Playwright tests
  run: npx playwright test
  env:
    STANDARD_USERNAME: ${{ secrets.STANDARD_USERNAME }}
    STANDARD_PASSWORD: ${{ secrets.STANDARD_PASSWORD }}
    LOCKED_USERNAME: ${{ secrets.LOCKED_USERNAME }}
    LOCKED_PASSWORD: ${{ secrets.LOCKED_PASSWORD }}
```

Les secrets sont masqués dans les logs GitHub.

## Règles et précautions

- Ne jamais commiter le `.env` : vérifier avec `git status` qu'il n'apparaît pas.
- Utiliser uniquement des **comptes de test dédiés**, jamais un compte réel. Les rapports, traces et vidéos des tests en échec sont conservés et peuvent contenir les valeurs saisies.
- Aucune donnée (identifiant, mot de passe, URL) dans les pages : elles reçoivent tout en paramètres.
- Le choix du compte se fait dans le test, avec le nom du profil.

## Dépannage

| Symptôme                                                 | Cause probable                                                                                   |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `Variable d'environnement manquante : STANDARD_USERNAME` | La variable n'existe pas dans `.env` (en local) ou le secret n'est pas transmis dans le workflow |
| Erreur TypeScript sur `getCredentials('xxx')`            | Le profil n'est pas déclaré dans le type `UserProfile`                                           |
| Fonctionne en local mais échoue en CI                    | Un secret ou une ligne `env:` du workflow est manquant                                           |
