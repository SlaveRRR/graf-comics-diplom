import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useFormCore } from 'react-hook-form';
import { ZodSchema } from 'zod';

export const useForm = <TFormSchema>(schema: ZodSchema<TFormSchema>) =>
  useFormCore<TFormSchema>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
  });
