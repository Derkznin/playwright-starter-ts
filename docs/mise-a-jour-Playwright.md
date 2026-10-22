# 🔄 Mettre à jour Playwright

Il est recommandé de mettre régulièrement à jour Playwright afin de bénéficier des dernières fonctionnalités, corrections et améliorations.

## 1. Mettre à jour Playwright

Exécuter la commande suivante pour installer la dernière version de Playwright Test :

```bash
npm install @playwright/test@latest --save-dev
```

## 2. Mettre à jour les navigateurs

Installer les versions des navigateurs compatibles avec la version de Playwright installée :

```bash
npx playwright install
```

## 3. Vérifier la découverte des tests

Lister les tests détectés par Playwright :

```bash
npx playwright test --list
```

Une liste de tests doit apparaître. Cela permet de vérifier que Playwright détecte correctement les tests du projet.

## 4. Exécuter les tests

Lancer les tests pour vérifier qu'ils fonctionnent toujours après la mise à jour :

```bash
npx playwright test
```

Vérifier les résultats et corriger les éventuelles erreurs.

## ⚠️ Points d'attention

- Vérifier les notes de version en cas de changements incompatibles.
- Vérifier les éventuelles mises à jour nécessaires de TypeScript, ESLint et des autres dépendances.
- Conserver le fichier `package-lock.json` à jour et le versionner.
