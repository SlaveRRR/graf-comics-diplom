import { ReactNode } from 'react';

export interface Route {
  path: string;
  page: ReactNode;
  /**
   * защищенный роут
   */
  privateRoute?: boolean;
  children?: Route[];
}
