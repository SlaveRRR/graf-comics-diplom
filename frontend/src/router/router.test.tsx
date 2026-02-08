import { render, screen } from '@testing-library/react';
import { Router } from './Router';

vi.mock('@pages', () => ({
  HomePage: () => <></>,
  LayoutPage: () => <></>,
  SignInPage: () => <></>,
  SignUpPage: () => <></>,
  SwaggerPage: () => <></>,
}));

vi.mock('./utils', () => ({
  getRouter: () => {},
}));

describe('router', () => {
  test('проверка отрисовки компонента', () => {
    render(<Router />);

    expect(screen.getByTestId('router-provider')).toBeInTheDocument();
  });
});
