import { AppProvider } from '@context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { FC } from 'react';

import { Router } from './router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <ConfigProvider
          theme={{
            token: {
              fontFamily: '"Inter",sans-serif',
            },
          }}
        >
          <Router />
        </ConfigProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};
