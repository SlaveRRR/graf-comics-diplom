import { FC, PropsWithChildren } from 'react';

export const FormItem: FC<PropsWithChildren> = ({ children }) => <div data-testid="form-item">{children}</div>;
