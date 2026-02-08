import { RouterProvider } from 'react-router-dom';

import { ROUTES } from './constants';
import { getRouter } from './utils';

const router = getRouter(ROUTES);

export const Router = () => {
  return <RouterProvider router={router} />;
};
