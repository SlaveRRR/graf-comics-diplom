import { FC, PropsWithChildren } from 'react';

export const Typography = () => <div data-testid="typography" />;

Typography.Title = () => <div data-testid="title" />;
Typography.Link = () => <div data-testid="link" />;

export const Flex: FC<PropsWithChildren> = ({ children }) => <div>{children}</div>;

export const Button: FC<{ onClick: () => void }> = ({ onClick }) => <button onClick={onClick} data-testid="button" />;

interface FormComponent extends FC<PropsWithChildren<{ onFinish: () => void }>> {
  Item: FC;
}

export const Form: FormComponent = ({ children, onFinish }) => (
  <form onSubmit={onFinish} data-testid="form">
    {children}
  </form>
);

Form.Item = () => <div />;

export const Input = () => <div data-testid="input" />;

Input.Password = () => <div data-testid="input-password" />;

export const message = {
  useMessage: () => [{}, <div data-testid="context-holder" />],
};

export const ConfigProvider: FC<PropsWithChildren> = ({ children }) => <div>{children}</div>;
