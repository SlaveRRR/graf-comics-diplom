import { Typography } from 'antd';
import { FC } from 'react';

const { Title } = Typography;

export const Home: FC = () => {
  return (
    <div className="my-container">
      <Title level={1}>Приветствуем в</Title>
    </div>
  );
};
