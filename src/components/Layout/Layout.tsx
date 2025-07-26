import { FC } from 'react';
import { LayoutProps } from './types';

export const Layout: FC<LayoutProps> = ({ children }) => {
  return <main>{children}</main>;
};
