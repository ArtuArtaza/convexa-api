import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
});

//TODO: This could be re-usable. The schemas are the same basically.

export const loginSchema = z.object({
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  password: z.string().min(6, 'Password is required'),
});

export class CreateUserDto extends createZodDto(createUserSchema) {}
export class LoginDto extends createZodDto(loginSchema) {}
