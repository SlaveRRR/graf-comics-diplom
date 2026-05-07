import * as z from 'zod';

import { REQUIRED_FIELD_PLACEHOLDER } from './common';

export const passwordSchema = z
  .string({ message: REQUIRED_FIELD_PLACEHOLDER })
  .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/gi, {
    message: 'Пароль должен содержать 8 символов или более, включая 1 цифру.',
  });
