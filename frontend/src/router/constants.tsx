import { HomePage, LayoutPage, SignInPage, SignUpPage, SwaggerPage } from '@pages';

import { Route } from './types';

export const ROUTES: Route[] = [
  {
    page: <LayoutPage />,
    path: '/',
    children: [
      {
        path: '/',
        page: <HomePage />,
      },
      {
        path: '/signin',
        page: <SignUpPage />,
      },
      {
        path: '/signup',
        page: <SignInPage />,
      },
      {
        path: '/swagger',
        page: <SwaggerPage />,
      },
    ],
  },
];
