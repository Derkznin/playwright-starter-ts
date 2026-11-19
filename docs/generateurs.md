# 🛠️ Génération de fichiers avec Plop

## 📖 Présentation

Le projet utilise **Plop** pour automatiser la création de fichiers à partir de templates prédéfinis.

L'objectif est de faciliter l'ajout de nouveaux éléments tout en conservant une structure homogène, des conventions de nommage cohérentes et un code de base réutilisable.

## 🚀 Utilisation

Pour lancer le générateur, exécuter la commande suivante à la racine du projet :

```bash
npm run plop
```

Plop propose ensuite plusieurs types de fichiers :

| Choix       | Description                                             | Extension     |
| ----------- | ------------------------------------------------------- | ------------- |
| Page Object | Créer une classe représentant une page de l'application | `.page.ts`    |
| Fixture     | Créer une fixture personnalisée Playwright              | `.fixture.ts` |
| Test        | Créer un fichier de test automatisé                     | `.spec.ts`    |
| Util        | Créer une classe utilitaire                             | `.utils.ts`   |

## 📂 Création des fichiers

Pour chaque génération, plusieurs informations sont demandées :

1. **Type de fichier** : choisir le type de fichier à générer.
2. **Création de dossiers** : choisir si un ou plusieurs sous-dossiers doivent être créés.
3. **Chemin des dossiers** : renseigner le chemin souhaité si la création de dossiers est activée.
4. **Nom du fichier** : renseigner le nom du fichier à générer.

La création de dossiers est facultative et permet de définir librement l'organisation des fichiers.

### 📝 Exemples de génération

Sans sous-dossier :

```text
tests/
└── login.spec.ts
```

Avec un sous-dossier :

```text
tests/
└── authentication/
    └── login.spec.ts
```

Avec plusieurs niveaux de sous-dossiers :

```text
tests/
└── authentication/
    └── login/
        └── scenarios/
            └── login-success.spec.ts
```

Le même fonctionnement est disponible pour les Page Objects, les Fixtures et les Utilitaires.

## 🏷️ Conventions de nommage

Les noms saisis sont automatiquement convertis au format `kebab-case` pour les noms de fichiers et les chemins de dossiers.

Les classes générées utilisent le format `PascalCase` avec le suffixe correspondant à leur type.

| Élément             | Convention               | Exemple            |
| ------------------- | ------------------------ | ------------------ |
| Page Object         | `PascalCase` + `Page`    | `LoginPage`        |
| Fixture             | `PascalCase` + `Fixture` | `LoginFixture`     |
| Test                | Nom en `kebab-case`      | `login.spec.ts`    |
| Utilitaire          | `PascalCase` + `Utils`   | `DateUtils`        |
| Fichier Page Object | `.page.ts`               | `login.page.ts`    |
| Fichier Fixture     | `.fixture.ts`            | `login.fixture.ts` |
| Fichier Utilitaire  | `.utils.ts`              | `date.utils.ts`    |

## 🛡️ Validations et interdictions

Afin d'éviter les erreurs lors de la génération, plusieurs contrôles sont effectués sur les noms et les chemins saisis.

### 📄 Noms de fichiers et de dossiers

Les règles suivantes sont appliquées :

- Les noms vides ou composés uniquement d'espaces sont interdits.
- Les caractères suivants sont interdits : `< > : " / \ | ? *`.
- Les caractères de contrôle ASCII (0 à 31 et 127) sont interdits.
- Les noms `.` et `..` sont interdits.
- Les noms ne peuvent pas se terminer par un point ou un espace.
- Les noms réservés par Windows sont interdits : `CON`, `PRN`, `AUX`, `NUL`, `COM1` à `COM9` et `LPT1` à `LPT9`.

### 📁 Chemins des dossiers

Les chemins doivent respecter les règles suivantes :

- Utiliser `/` pour séparer les différents niveaux de dossiers.
- Ne pas commencer ou terminer un chemin par `/`.
- Ne pas utiliser de `\` comme séparateur.
- Ne pas laisser de niveau de dossier vide.
- Ne pas utiliser `.` ou `..` comme nom de dossier.

Exemple de chemin accepté :

```text
authentication/login/scenarios
```

Exemples de chemins refusés :

```text
/authentication/login
authentication/login/
authentication//login
../authentication
authentication\login
```

## 🧩 Templates

Les fichiers modèles utilisés par Plop sont regroupés dans le dossier `plop-templates/`.

```text
plop-templates/
├── page.hbs
├── fixture.hbs
├── test.hbs
└── utils.hbs
```

Chaque template contient la structure de base du fichier à générer. Les noms de classes et les chemins d'import peuvent être adaptés automatiquement grâce aux helpers et aux données transmis par Plop.

Pour modifier la structure d'un fichier généré, il suffit d'adapter le template correspondant.
