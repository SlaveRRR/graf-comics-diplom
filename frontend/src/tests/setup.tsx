import { QueryClientProvider as CoreQueryClientProvider, QueryClient } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import { afterEach } from 'vitest';

beforeAll(() => {
  vi.mock('antd');
  vi.mock('react-router-dom');
  vi.mock('react-hook-form-antd');
  vi.mock('swagger-ui-react');
});

afterEach(() => {
  vi.resetAllMocks();
  cleanup();
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
const QueryClientProvider = ({ children }) => (
  <CoreQueryClientProvider client={queryClient}>{children}</CoreQueryClientProvider>
);

function customRender(ui: React.ReactElement, options = {}) {
  return render(ui, {
    wrapper: ({ children }) => children,
    ...options,
  });
}

export { customRender, QueryClientProvider };
