import {
  AccountPage,
  CatalogPage,
  ComicDetailsPage,
  ComicReaderPage,
  CreateComicPage,
  FavoritesPage,
  HomePage,
  LayoutPage,
  ProfilePage,
  SignInPage,
  SignUpPage,
  SwaggerPage,
} from '@pages';

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
        path: '/catalog',
        page: <CatalogPage />,
      },
      {
        path: '/favorites',
        page: <FavoritesPage />,
        privateRoute: true,
      },
      {
        path: '/comics/:comicId',
        page: <ComicDetailsPage />,
      },
      {
        path: '/comics/:comicId/chapters/:chapterId',
        page: <ComicReaderPage />,
      },
      {
        path: '/signin',
        page: <SignInPage />,
      },
      {
        path: '/signup',
        page: <SignUpPage />,
      },
      {
        path: '/swagger',
        page: <SwaggerPage />,
      },
      {
        path: '/comics/create',
        page: <CreateComicPage />,
        privateRoute: true,
      },
      {
        path: '/account',
        page: <AccountPage />,
        privateRoute: true,
      },
      {
        path: '/profile/:userId',
        page: <ProfilePage />,
      },
    ],
  },
];
