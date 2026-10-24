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
