import { render, screen } from '@testing-library/react';
import { Layout } from './Layout';

describe('Layout', () => {
  test('проверка отрисовки компонента', () => {
    render(
      <Layout>
        <p>test</p>
      </Layout>,
    );
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
