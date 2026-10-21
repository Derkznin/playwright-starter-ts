# Playwright TypeScript Test Template

Template de test automatisé robuste, réutilisable et maintenable basé sur **Playwright** et **TypeScript**.

## 🚀 Fonctionnalités

- **TypeScript** : Typage statique pour sécuriser et structurer le code.
- **Playwright Test** : Exécution rapide et fiable des tests end-to-end multi-navigateurs.
- **ESLint** : Analyse statique du code avec support de TypeScript et règles spécifiques pour Playwright (`eslint-plugin-playwright`).
- **Prettier** : Formatage automatique et homogène du code.
- **Architecture modulaire** : Prêt pour l'implémentation du design pattern _Page Object Model (POM)_.

---

## 📁 Structure du Projet

```text
my-playwright-project/
├── .github/workflows/    # Pipelines CI/CD (optionnel)
├── tests/                # Fichiers de tests E2E (.spec.ts)
├── .eslintrc.json        # Configuration ESLint
├── .prettierrc           # Configuration Prettier
├── .prettierignore       # Fichiers/dossiers ignorés par Prettier
├── playwright.config.ts  # Configuration globale de Playwright
├── package.json          # Dépendances et scripts NPM
└── tsconfig.json         # Configuration TypeScript
```

## Commande à utiliser

npm run lint : Vérifier les erreurs dans le code
npm run lint:fix : Corriger automatiquement les erreurs ESLint
npm run format : Formater automatiquement tous les fichiers du projet
npm run format:check : Vérifier si le code est correctement formaté (utile pour la CI/CD)
npm run typecheck : Vérifier l'intégrité des types sans compiler les fichiers
