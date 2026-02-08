import { User } from '@types';

export interface AppContext {
  auth: boolean;
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
}
