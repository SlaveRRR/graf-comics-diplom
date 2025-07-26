import { EXPIRED_TIME, getIsTokenExpired } from './getIsTokenExpired';

const getFakeToken = (time: number) => {
  const expTime = Math.floor(time / 1000);
  const payload = JSON.stringify({ exp: expTime });
  const base64Payload = btoa(payload);
  const token = `header.${base64Payload}.signature`;
  return token;
};

describe('getIsTokenExpired', () => {
  test('проверка работы функции для свежего токена', () => {
    const token = getFakeToken(Date.now() + EXPIRED_TIME * 2);

    const result = getIsTokenExpired(token);

    expect(result).toBe(false);
  });

  test('проверка работы функции для протухшего токена', () => {
    const token = getFakeToken(Date.now() - EXPIRED_TIME);

    const result = getIsTokenExpired(token);

    expect(result).toBe(true);
  });
});
