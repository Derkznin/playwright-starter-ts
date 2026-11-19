/**
 * Vérifie qu'un nom de fichier ou de dossier est valide.
 */
function validateName(value, label) {
  const name = value.trim();

  if (!name) {
    return `Le nom ${label} est obligatoire.`;
  }

  // Vérifie les caractères interdits dans les noms de fichiers et dossiers
  if (/[<>:"\\|?*]/.test(name) || name.includes('/')) {
    return `Le nom ${label} contient des caractères interdits.`;
  }

  // Vérifie les caractères de contrôle (ASCII 0 à 31 et 127)
  if (
    [...name].some((character) => {
      const code = character.charCodeAt(0);
      return code < 32 || code === 127;
    })
  ) {
    return `Le nom ${label} contient des caractères de contrôle interdits.`;
  }
  if (/[. ]$/.test(name)) {
    return `Le nom ${label} ne peut pas se terminer par un point ou un espace.`;
  }

  const reservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/i;

  if (reservedNames.test(name)) {
    return `Le nom ${label} est réservé par Windows.`;
  }

  return true;
}

/**
 * Vérifie un chemin composé de plusieurs dossiers.
 */
function validateFolderPath(value) {
  const path = value.trim();

  if (!path) {
    return 'Le chemin des dossiers est obligatoire.';
  }

  if (path.startsWith('/') || path.endsWith('/')) {
    return 'Le chemin ne doit pas commencer ou se terminer par "/".';
  }

  if (path.includes('\\')) {
    return 'Utilisez "/" pour séparer les dossiers.';
  }

  const folders = path.split('/');

  for (const folder of folders) {
    const validation = validateName(folder, 'du dossier');

    if (validation !== true) {
      return validation;
    }
  }

  return true;
}

export default function (plop) {
  plop.setGenerator('generate', {
    description: 'Générer un nouveau fichier',

    prompts: [
      {
        type: 'list',
        name: 'target',
        message: 'Que souhaitez-vous générer ?',
        choices: [
          { name: 'Page Object', value: 'pages' },
          { name: 'Fixture', value: 'fixtures' },
          { name: 'Test', value: 'tests' },
          { name: 'Util', value: 'utils' },
        ],
      },
      {
        type: 'confirm',
        name: 'createFolder',
        message: 'Souhaitez-vous créer un ou plusieurs sous-dossiers ?',
        default: true,
      },
      {
        type: 'input',
        name: 'folderPath',
        message: 'Quel est le chemin des dossiers ? (ex : authentication/login)',
        when: (answers) => answers.createFolder,
        validate: validateFolderPath,
      },
      {
        type: 'input',
        name: 'fileName',
        message: 'Quel est le nom du fichier ?',
        validate: (value) => validateName(value, 'du fichier'),
      },
    ],

    actions: (answers) => {
      const folderPath = answers.createFolder
        ? answers.folderPath
            .split('/')
            .map((folder) => plop.getHelper('kebabCase')(folder.trim()))
            .join('/')
        : '';

      const fileName = plop.getHelper('kebabCase')(answers.fileName);

      const extensions = {
        pages: 'page.ts',
        fixtures: 'fixture.ts',
        tests: 'spec.ts',
        utils: 'utils.ts',
      };

      const templates = {
        pages: 'page.hbs',
        fixtures: 'fixture.hbs',
        tests: 'test.hbs',
        utils: 'utils.hbs',
      };

      const extension = extensions[answers.target];
      const template = templates[answers.target];

      if (!extension || !template) {
        return [() => `Le template ${answers.target} n'est pas encore disponible.`];
      }

      const relativePath = '../'.repeat(folderPath ? folderPath.split('/').length + 1 : 1);

      return [
        {
          type: 'add',
          path: `${answers.target}/${folderPath ? `${folderPath}/` : ''}${fileName}.${extension}`,
          templateFile: `plop-templates/${template}`,
          skipIfExists: true,
          ...(answers.target === 'tests'
            ? {
                data: {
                  relativePath,
                },
              }
            : {}),
        },
      ];
    },
  });
}
