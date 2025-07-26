import { PropsWithChildren } from 'react';

import { RequiredAuth } from '@components';

import { getRouter } from './getRouter';

vi.mock('@components', () => ({
  RequiredAuth: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

describe('getRouter', () => {
  test('проверка получения роутера', () => {
    expect(
      getRouter([
        {
          page: 'page',
          path: '/',
          privateRoute: true,
          children: [{ path: '/children', page: 'children' }],
        },
      ]),
    ).toMatchObject([
      {
        element: <RequiredAuth>page</RequiredAuth>,
        path: '/',
        children: [
          {
            path: '/children',
            element: 'children',
          },
        ],
      },
    ]);
  });
});
