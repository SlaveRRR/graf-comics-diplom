import { render, screen } from '@testing-library/react';

import { SwaggerPage } from './SwaggerPage';

describe('SwaggerPage', () => {
  test('проверка отрисовки компонента', () => {
    render(<SwaggerPage />);

    expect(screen.getByTestId('swagger')).toBeInTheDocument();
  });
});
