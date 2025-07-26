import { render, screen } from '@testing-library/react';
import { RequiredAuth } from './RequiredAuth';

const AuthorizedContent = <div data-testid="auth-required" />;

const mockUseApp = vi.fn();

vi.mock('@hooks', () => ({
  useApp: () => mockUseApp(),
}));

describe('RequiredAuth', () => {
  test('проверка отрисовки компонента для авторизованного пользователя', () => {
    mockUseApp.mockReturnValue({ auth: true });
    render(<RequiredAuth>{AuthorizedContent}</RequiredAuth>);

    expect(screen.getByTestId('auth-required')).toBeInTheDocument();
  });

  test('проверка отрисовки компонента для неавторизованного пользователя', () => {
    mockUseApp.mockReturnValue({ auth: false });
    render(<RequiredAuth>{AuthorizedContent}</RequiredAuth>);

    expect(screen.queryByTestId('auth-required')).not.toBeInTheDocument();
    expect(screen.getByTestId('title')).toBeInTheDocument();
    expect(screen.getByTestId('button')).toBeInTheDocument();
  });
});
