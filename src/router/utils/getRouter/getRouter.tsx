import { createBrowserRouter } from 'react-router-dom';

import { RequiredAuth } from '@components';

import { Route } from '../../types';

export const getRouter = (routes: Route[]) => {
  const mapRoutes = (routeList: Route[]) =>
    routeList.map(({ page, path, children, privateRoute }) => ({
      element: privateRoute ? <RequiredAuth>{page}</RequiredAuth> : page,
      path: path,
      children: children ? mapRoutes(children) : undefined,
    }));

  return createBrowserRouter(mapRoutes(routes));
};
