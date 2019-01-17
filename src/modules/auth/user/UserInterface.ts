import { User } from './User';


export interface IUser extends User {
  // Password Types
  verifyPassword(
    value: string,
    callback?: (
      err,
      valid: boolean
    ) => void
  ): () => Promise<boolean>;

  verifyPasswordSync(value: string): () => boolean;

  encryptPassword(
    value: string,
    callback?: (
      err,
      encryptedValue: string
    ) => void
  ): () => Promise<string>;
}
