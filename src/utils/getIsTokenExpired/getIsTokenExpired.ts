export const EXPIRED_TIME = 600000; // 10 минут в мс

export const getIsTokenExpired = (token: string) => {
  const { exp }: { exp: number } = JSON.parse(atob(token.split('.')[1]));

  if (exp && exp * 1000 - Date.now() <= EXPIRED_TIME) {
    return true;
  }
  return false;
};
