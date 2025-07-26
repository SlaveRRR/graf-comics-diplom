import { useForm } from '@hooks';
import { SignInParams } from '@types';
import { Button, Flex, Form, Input, Typography } from 'antd';
import { FC } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { SignInFormSchema, signInFormSchema } from './constants';
import { useSignInMutation } from './hooks';

const { Title, Link } = Typography;

export const SignIn: FC = () => {
  const { handleSubmit, control } = useForm(signInFormSchema);

  const { mutate, isLoading } = useSignInMutation();

  const submitHanlder: SubmitHandler<SignInFormSchema> = (data) => mutate(data as SignInParams);

  return (
    <section>
      <div className="my-container">
        <Form onFinish={handleSubmit(submitHanlder)}>
          <Title level={3}>Авторизация</Title>
          <FormItem control={control} name="username" label="Имя пользователя">
            <Input placeholder="Заполните это поле" />
          </FormItem>

          <FormItem control={control} name="password" label="Пароль">
            <Input.Password placeholder="Заполните это поле" />
          </FormItem>

          <Form.Item wrapperCol={{ span: 2, offset: 8 }}>
            <Button loading={isLoading} type="primary" htmlType="submit">
              Войти
            </Button>
          </Form.Item>
        </Form>
        <Flex justify="center" gap={9} align="center">
          <Link href="/signup">Еще нет аккаунта?</Link>
        </Flex>
      </div>
    </section>
  );
};
