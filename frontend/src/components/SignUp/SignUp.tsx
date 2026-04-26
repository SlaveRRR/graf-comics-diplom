import { Button, Checkbox, Divider, Flex, Form, Image, Input, Space, Typography } from 'antd';
import { FC } from 'react';
import { Controller, SubmitHandler } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';
import { useLocation } from 'react-router-dom';

import { useForm } from '@hooks';
import { SignUpParams } from '@types';
import { getRedirectFromSearch, SocialProvider, startHeadlessSocialAuth } from '@utils';
import GoogleIcon from '@assets/icons/google.svg';
import VkIcon from '@assets/icons/vk.svg';
import YandexIcon from '@assets/icons/yandex.svg';

import { SignUpFormSchema, signUpFormSchema } from './constants';
import { useSignUpMutation } from './hooks';

const { Title, Link, Text } = Typography;

export const SignUp: FC = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    trigger,
  } = useForm(signUpFormSchema);
  const { mutate, isLoading } = useSignUpMutation();
  const location = useLocation();
  const redirectTo = getRedirectFromSearch(location.search);

  const submitHanlder: SubmitHandler<SignUpFormSchema> = (data) => mutate(data as SignUpParams);

  const auth = async (type: SocialProvider) => {
    await trigger();

    const values = getValues();

    if (values?.email && values?.password && values?.userAgreement && values?.username) {
      startHeadlessSocialAuth(type, redirectTo);
    }
  };

  return (
    <section>
      <div className="my-container">
        <Form onFinish={handleSubmit(submitHanlder)}>
          <Title className="text-center" level={3}>
            Регистрация
          </Title>

          <FormItem control={control} name="username" label="Имя пользователя">
            <Input placeholder="Заполните это поле" />
          </FormItem>

          <FormItem control={control} name="email" label="Электронная почта">
            <Input placeholder="Заполните это поле" />
          </FormItem>

          <FormItem control={control} name="password" label="Пароль">
            <Input.Password placeholder="Заполните это поле" />
          </FormItem>

          <Divider plain>
            <Text type="secondary">или создать аккаунт через</Text>
          </Divider>

          <Space size={12} className="w-full justify-center mb-3">
            <Button
              className="px-7 py-5 flex items-center [&_img]:inline"
              size="large"
              icon={<Image src={GoogleIcon} preview={false} />}
              block
              onClick={() => auth('google')}
            />
            <Button
              className="px-7 py-5 flex items-center [&_img]:inline"
              size="large"
              icon={<Image src={YandexIcon} preview={false} />}
              block
              onClick={() => auth('yandex')}
            />
            <Button
              className="px-7 py-5 flex items-center [&_img]:inline"
              size="large"
              icon={<Image src={VkIcon} preview={false} />}
              block
              onClick={() => auth('vk')}
            />
          </Space>

          <Flex justify="center" gap={9} align="center" vertical className="pt-3">
            <Button loading={isLoading} type="primary" htmlType="submit">
              Зарегистрироваться
            </Button>
            <Controller
              name="userAgreement"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <Flex gap={12}>
                  <Text>
                    Я ознакомлен с <Link href="/user-agreement">пользовательским соглашением</Link>
                  </Text>
                  <Checkbox {...field} checked={value} onChange={(e) => onChange(e.target.checked)}></Checkbox>
                </Flex>
              )}
            />
            {!!errors?.userAgreement?.message && <Text type="danger">{errors?.userAgreement?.message}</Text>}
            <Link href="/signin">Уже есть аккаунт?</Link>
          </Flex>
        </Form>
      </div>
    </section>
  );
};
