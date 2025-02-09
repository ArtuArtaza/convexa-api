import { z } from 'zod';

export const paginationSchema = z.object({
  page: z
    .number()
    .int()
    .min(1, 'Page must be greater than 0')
    .optional()
    .default(1),
  limit: z
    .number()
    .int()
    .min(1, 'Limit must be greater than 0')
    .max(100, 'Limit must be less than or equal to 100')
    .optional()
    .default(10),
  search: z.string().optional(),
});

export type PaginationDto = z.infer<typeof paginationSchema>;
