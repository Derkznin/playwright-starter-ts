import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// --- Variables d'environnement ---
// Si ENV est défini (ex. ENV=staging), on charge d'abord .env.staging.
// dotenv n'écrase pas une variable déjà définie : le premier fichier chargé a la priorité.
if (process.env.ENV) {
  dotenv.config({ path: `.env.${process.env.ENV}` });
}
// Puis on charge le .env par défaut (valeurs communes, utilisées en l'absence d'ENV).
dotenv.config();

// GitHub Actions (et la plupart des CI) définit automatiquement la variable CI.
// On s'en sert pour adapter la config entre ton poste et la CI.
const isCI = !!process.env.CI;

export default defineConfig({
  // Dossier où Playwright cherche les fichiers de tests (*.spec.ts)
  testDir: './tests',

  // --- Exécution ---
  fullyParallel: true, // les tests d'un même fichier tournent en parallèle
  forbidOnly: isCI, // en CI, échoue si un test.only traîne dans le code
  retries: isCI ? 2 : 0, // en CI, relance 2 fois un test échoué (utile contre les tests instables)
  workers: isCI ? 1 : undefined, // CI : 1 seul worker (stabilité) ; local : valeur automatique selon ton CPU

  // --- Délais (timeouts) ---
  timeout: 120_000, // durée maximale d'un test entier (2 min)
  expect: { timeout: 5_000 }, // durée pendant laquelle une vérification (expect) réessaie avant d'échouer

  // --- Rapports ---
  // Le premier élément de chaque liste est le format, le second ses options.
  reporter: isCI
    ? [
        ['list'], // une ligne par test dans les logs
        ['github'], // annotations d'erreur directement dans l'interface GitHub
        ['html', { open: 'never' }], // rapport HTML complet, sans l'ouvrir automatiquement
      ]
    : [
        ['list'],
        ['html', { open: 'on-failure' }], // en local, ouvre le rapport seulement si un test échoue
      ],

  // --- Options communes à tous les projets (navigateurs) ---
  use: {
    // URL de base : permet d'écrire page.goto("/") dans les tests.
    // Vient du .env (BASE_URL).
    baseURL: process.env.BASE_URL,

    actionTimeout: 10_000, // durée maximale d'une action (clic, saisie…)
    navigationTimeout: 15_000, // durée maximale d'un chargement de page

    // Éléments de débogage : conservés uniquement quand un test échoue, pour ne pas encombrer le dossier de résultats.
    trace: 'retain-on-failure', // trace complète (ouvrable avec le trace viewer)
    screenshot: 'only-on-failure', // capture d'écran au moment de l'échec
    video: {
      mode: 'retain-on-failure', // vidéo gardée seulement pour les tests échoués
      size: { width: 1280, height: 720 }, // résolution de la vidéo (720p)
    },

    // Langue et fuseau horaire du navigateur : mêmes résultats sur ton PC et en CI
    locale: 'fr-FR',
    timezoneId: 'Europe/Paris',
  },

  // --- Navigateurs ---
  projects: [
    // Chromium : lancé par défaut avec un simple `npx playwright test`
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: !!process.env.CI, // Headless sur CI, avec navigateur visible en local
      },
    },

    // Firefox et WebKit restent configurés mais ne tournent pas par défaut (`default: false`,
    // Pour les lancer : `npx playwright test --project=firefox` ou tous à la fois (ex. en CI) : `npx playwright test --project="*"`
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        headless: !!process.env.CI, // Headless sur CI, avec navigateur visible en local
      },
      default: false,
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        headless: !!process.env.CI, // Headless sur CI, avec navigateur visible en local
      },
      default: false,
    },
  ],
});
