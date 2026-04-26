import * as z from 'zod';

import { passwordSchema } from '@constants';

export const signUpFormSchema = z.object({
  username: z.string(),
  email: z.string().email().toLowerCase(),
  password: passwordSchema,
  userAgreement: z.boolean({ message: 'Поле является обязательным!' }),
});

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;
