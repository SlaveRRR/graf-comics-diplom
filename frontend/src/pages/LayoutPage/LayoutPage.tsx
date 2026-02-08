import { Layout } from '@components';
import { message } from 'antd';
import { Outlet } from 'react-router-dom';

import { OutletContext } from './types';

export const LayoutPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <Layout>
      {contextHolder}
      <Outlet context={{ messageApi } satisfies OutletContext} />
    </Layout>
  );
};
