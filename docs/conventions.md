# Conventions

## Conventions de nommage

| Élément                        | Convention         | Exemple                       |
| ------------------------------ | ------------------ | ----------------------------- |
| Dossiers                       | `kebab-case`       | `page-objects/`               |
| Tous les fichiers              | `kebab-case`       | `login-page.ts`               |
| Fichiers de test               | `kebab-case.spec`  | `login.spec.ts`               |
| Fichiers de fixtures           | `kebab-case`       | `index.ts`, `api-fixtures.ts` |
| Classes, interfaces et types   | `PascalCase`       | `LoginPage`, `UserProfile`    |
| Variables, fonctions, méthodes | `camelCase`        | `baseUrl`, `getUserProfile()` |
| Constantes globales immuables  | `UPPER_SNAKE_CASE` | `DEFAULT_TIMEOUT`             |

## Règles complémentaires

- Un fichier de test se termine toujours par `.spec.ts` : c'est ce que Playwright reconnaît comme test.
- Une méthode dont le nom contient `verifier` contient au moins un `expect`, et toute méthode qui contient un `expect` a `verifier` dans son nom. ESLint ne contrôle que le nom : c'est à la revue de code de garantir le contenu.
- Les identifiants (méthodes, variables) sont écrits en anglais.
