import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Form,
  Input,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tag,
  Typography,
  Upload,
} from 'antd';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  BookOutlined,
  CameraOutlined,
  CommentOutlined,
  EditOutlined,
  EyeOutlined,
  HeartOutlined,
  LinkOutlined,
  LogoutOutlined,
  SaveOutlined,
} from '@ant-design/icons';

import { colors } from '@constants';
import { UserProfileComic, UserProfileUpdatePayload } from '@types';
import { useUpdateCurrentProfileMutation } from '@components/Profile/hooks/useUpdateCurrentProfileMutation';
import { OutletContext } from '@pages/LayoutPage/types';

import { useAccountAvatarUploadMutation, useAccountQuery, useLogoutMutation } from './hooks';

const { Paragraph, Text, Title } = Typography;

const roleLabels: Record<string, string> = {
  admin: 'Администратор',
  author: 'Автор',
  reader: 'Читатель',
};

const statusLabels: Record<UserProfileComic['status'], string> = {
  draft: 'Черновик',
  under_review: 'На модерации',
  published: 'Опубликован',
};

const statusColors: Record<UserProfileComic['status'], string> = {
  draft: 'default',
  under_review: 'processing',
  published: 'success',
};

const formatCount = (value: number) => value.toLocaleString('ru-RU');

const formatDate = (value?: string | null) => {
  if (!value) {
    return 'Пока без даты публикации';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
};

export const Account: FC = () => {
  const { messageApi } = useOutletContext<OutletContext>();
  const [form] = Form.useForm<UserProfileUpdatePayload>();
  const [isEditing, setIsEditing] = useState(false);
  const [localAvatarPreview, setLocalAvatarPreview] = useState<string | null>(null);

  const { data, isLoading, isError } = useAccountQuery();
  const updateProfileMutation = useUpdateCurrentProfileMutation(data?.id);
  const avatarUploadMutation = useAccountAvatarUploadMutation(data?.id);
  const logoutMutation = useLogoutMutation();

  useEffect(() => {
    if (!data) {
      return;
    }

    form.setFieldsValue({
      username: data.username,
      email: data.email,
      name: data.name,
      surname: data.surname,
    });
  }, [data, form]);

  useEffect(() => {
    return () => {
      if (localAvatarPreview) {
        URL.revokeObjectURL(localAvatarPreview);
      }
    };
  }, [localAvatarPreview]);

  const resolvedAvatar = localAvatarPreview || data?.avatar || undefined;
  const authorComics = useMemo(() => data?.comics ?? [], [data?.comics]);
  const isAuthor = data?.role === 'author';

  const handleSaveProfile = async (values: UserProfileUpdatePayload) => {
    try {
      await updateProfileMutation.mutateAsync({
        username: values.username?.trim(),
        email: values.email?.trim(),
        name: values.name?.trim(),
        surname: values.surname?.trim(),
      });

      setIsEditing(false);
      messageApi.success('Личные данные обновлены.');
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : 'Не удалось сохранить изменения.');
    }
  };

  const handleAvatarUpload = async (file: File) => {
    const nextPreview = URL.createObjectURL(file);

    if (localAvatarPreview) {
      URL.revokeObjectURL(localAvatarPreview);
    }

    setLocalAvatarPreview(nextPreview);

    try {
      await avatarUploadMutation.mutateAsync(file);
      setLocalAvatarPreview(null);
      messageApi.success('Аватар обновлён.');
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : 'Не удалось загрузить аватар.');
    }

    return false;
  };

  if (isLoading) {
    return (
      <Flex vertical gap={24} className="w-full">
        <Card className="border-0 shadow-sm">
          <Skeleton active avatar paragraph={{ rows: 5 }} />
        </Card>
        <Card className="border-0 shadow-sm">
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      </Flex>
    );
  }

  if (isError || !data) {
    return (
      <Card className="border-0 shadow-sm">
        <Empty description="Личный кабинет пока недоступен." />
      </Card>
    );
  }

  return (
    <Flex vertical gap={24} className="w-full">
      <Card
        className="overflow-hidden border-0 shadow-sm"
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <div className="bg-[radial-gradient(circle_at_top_left,rgba(114,84,230,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(46,144,250,0.12),transparent_28%),linear-gradient(135deg,#ffffff_0%,#f5f7fc_100%)] p-4 sm:p-6 lg:p-8">
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} xl={15}>
              <Flex gap={20} align="start" wrap="wrap">
                <Flex vertical gap={14} align="center">
                  <Avatar
                    size={{ xs: 88, sm: 104, md: 120 }}
                    src={resolvedAvatar}
                    className="border-4 border-white/80 shadow-[0_12px_36px_rgba(32,20,82,0.12)]"
                  >
                    {data.username[0]?.toUpperCase()}
                  </Avatar>

                  <Upload
                    accept="image/*"
                    beforeUpload={(file) => handleAvatarUpload(file)}
                    showUploadList={false}
                    disabled={!isEditing || avatarUploadMutation.isLoading}
                  >
                    <Button icon={<CameraOutlined />} loading={avatarUploadMutation.isLoading} disabled={!isEditing}>
                      Загрузить аватар
                    </Button>
                  </Upload>
                </Flex>

                <Flex vertical gap={14} className="min-w-[220px] flex-1">
                  <Flex vertical gap={8}>
                    <Space wrap>
                      <Tag
                        color={colors.brand.primary}
                        className="m-0 rounded-full border-0 px-3 py-1 text-xs font-semibold"
                      >
                        {roleLabels[data.role] ?? data.role}
                      </Tag>
                      <Tag
                        color={colors.brand.secondary}
                        className="m-0 rounded-full border-0 px-3 py-1 text-xs font-semibold"
                      >
                        Личный кабинет
                      </Tag>
                    </Space>

                    <div>
                      <Title level={1} className="!mb-1 !text-3xl sm:!text-4xl">
                        @{data.username}
                      </Title>
                    </div>
                  </Flex>

                  <Flex gap={12} wrap="wrap">
                    <AccountMetric label="Подписчики" value={formatCount(data.followersCount)} />
                    <AccountMetric label="Подписки" value={formatCount(data.followingCount)} />
                    {isAuthor ? <AccountMetric label="Мои комиксы" value={formatCount(authorComics.length)} /> : null}
                  </Flex>
                </Flex>
              </Flex>
            </Col>

            <Col xs={24} xl={9}>
              <Card className="border-0 bg-white/80 shadow-none backdrop-blur-sm" styles={{ body: { padding: 20 } }}>
                <Flex vertical gap={14}>
                  <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                    Быстрые действия
                  </Text>

                  <Flex gap={12} wrap="wrap">
                    <Button
                      type={isEditing ? 'default' : 'primary'}
                      icon={<EditOutlined />}
                      onClick={() => setIsEditing((current) => !current)}
                    >
                      {isEditing ? 'Закрыть редактирование' : 'Редактировать данные'}
                    </Button>
                    <Link to={data.publicProfilePath}>
                      <Button icon={<LinkOutlined />}>Открыть публичный профиль</Button>
                    </Link>
                    <Link to="/comics/create">
                      <Button icon={<BookOutlined />}>Создать комикс</Button>
                    </Link>
                    <Button
                      icon={<LogoutOutlined />}
                      danger
                      loading={logoutMutation.isLoading}
                      onClick={() => logoutMutation.mutate()}
                    >
                      Выйти из аккаунта
                    </Button>
                  </Flex>

                  <Text className="text-sm text-[var(--color-text-secondary)]">
                    Публичный профиль видят все, а кабинет содержит только ваши персональные данные и все работы,
                    включая черновики.
                  </Text>
                </Flex>
              </Card>
            </Col>
          </Row>
        </div>
      </Card>

      <Card className="border-0 shadow-sm">
        <Flex vertical gap={20}>
          <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
            <Flex vertical gap={4}>
              <Title level={3} className="!mb-0">
                Личные данные
              </Title>
            </Flex>
          </Flex>

          <Form<UserProfileUpdatePayload>
            form={form}
            layout="vertical"
            disabled={!isEditing}
            onFinish={handleSaveProfile}
          >
            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item label="Никнейм" name="username" rules={[{ required: true, message: 'Введите никнейм.' }]}>
                  <Input prefix="@" placeholder="Введите публичный никнейм" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Почта" name="email" rules={[{ type: 'email', message: 'Введите корректную почту.' }]}>
                  <Input placeholder="name@example.com" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Имя" name="name">
                  <Input placeholder="Как к вам обращаться" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Фамилия" name="surname">
                  <Input placeholder="Необязательно" />
                </Form.Item>
              </Col>
            </Row>

            <Flex justify="end">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={updateProfileMutation.isLoading}
                disabled={!isEditing}
              >
                Сохранить изменения
              </Button>
            </Flex>
          </Form>
        </Flex>
      </Card>

      {isAuthor ? (
        <Card className="border-0 shadow-sm">
          <Flex vertical gap={20}>
            <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
              <Flex vertical gap={4}>
                <Title level={3} className="!mb-0">
                  Мои работы
                </Title>
                <Text type="secondary">
                  В кабинете собраны все ваши комиксы, поэтому здесь удобно отслеживать статусы публикации и живые
                  метрики по каждой работе.
                </Text>
              </Flex>
            </Flex>

            {authorComics.length ? (
              <Row gutter={[16, 16]}>
                {authorComics.map((comic) => (
                  <Col key={comic.id} xs={24} lg={12}>
                    <AuthorComicCard comic={comic} />
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty description="Пока нет комиксов. Первый можно создать прямо из кабинета.">
                <Link to="/comics/create">
                  <Button type="primary">Создать комикс</Button>
                </Link>
              </Empty>
            )}
          </Flex>
        </Card>
      ) : null}
    </Flex>
  );
};

const AccountMetric: FC<{ label: string; value: string }> = ({ label, value }) => (
  <Card className="min-w-[132px] border-0 bg-white/80 shadow-none">
    <Statistic title={label} value={value} />
  </Card>
);

const AuthorComicCard: FC<{ comic: UserProfileComic }> = ({ comic }) => (
  <Card className="h-full border border-black/6 shadow-none transition-transform duration-200 hover:-translate-y-0.5">
    <Flex gap={16} align="start" wrap>
      <img
        alt={comic.title}
        src={comic.coverUrl || comic.cover}
        className="h-32 w-24 rounded-2xl object-cover sm:h-36 sm:w-28"
      />

      <Flex vertical gap={12} className="min-w-0 flex-1">
        <Flex justify="space-between" align="start" gap={12} wrap="wrap">
          <Flex vertical gap={8} className="min-w-0">
            <Space wrap>
              <Tag color={statusColors[comic.status]} className="m-0 rounded-full px-3 py-1 text-xs font-semibold">
                {statusLabels[comic.status]}
              </Tag>
              <Tag className="m-0 rounded-full border-0 bg-black/5 px-3 py-1 text-xs font-semibold">
                {comic.ageRating}
              </Tag>
            </Space>

            <div>
              <Title level={4} className="!mb-1" ellipsis={{ rows: 1 }}>
                {comic.title}
              </Title>
              <Text type="secondary">{comic.genre ?? 'Без жанра'}</Text>
            </div>
          </Flex>

          <Link to={`/comics/${comic.id}`}>
            <Button icon={<LinkOutlined />}>Страница комикса</Button>
          </Link>
        </Flex>

        <Paragraph className="!mb-0" type="secondary" ellipsis={{ rows: 3 }}>
          {comic.description || 'Описание пока не заполнено.'}
        </Paragraph>

        <Flex gap={8} wrap="wrap">
          {comic.tags.length ? (
            comic.tags.map((tag) => (
              <Tag key={tag} className="m-0 rounded-full border-0 bg-[rgba(114,84,230,0.08)] px-3 py-1">
                #{tag}
              </Tag>
            ))
          ) : (
            <Tag className="m-0 rounded-full">Без тегов</Tag>
          )}
        </Flex>

        <Row gutter={[12, 12]}>
          <Col xs={12} sm={8}>
            <ComicStat icon={<HeartOutlined />} label="Лайки" value={formatCount(comic.likesCount)} />
          </Col>
          <Col xs={12} sm={8}>
            <ComicStat icon={<CommentOutlined />} label="Комментарии" value={formatCount(comic.commentsCount)} />
          </Col>
          <Col xs={12} sm={8}>
            <ComicStat icon={<EyeOutlined />} label="Читатели" value={formatCount(comic.readersCount)} />
          </Col>
          <Col xs={12} sm={8}>
            <ComicStat icon={<BookOutlined />} label="Главы" value={formatCount(comic.chaptersCount)} />
          </Col>
        </Row>

        <Text type="secondary">
          {comic.status === 'published' ? 'Опубликован' : 'Последнее обновление'}:{' '}
          {formatDate(comic.publishedAt ?? comic.updatedAt)}
        </Text>
      </Flex>
    </Flex>
  </Card>
);

const ComicStat: FC<{ icon: ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <Flex vertical gap={4} className="rounded-2xl bg-black/[0.025] p-3">
    <Text type="secondary" className="flex items-center gap-1.5 text-xs">
      {icon}
      {label}
    </Text>
    <Text strong>{value}</Text>
  </Flex>
);
