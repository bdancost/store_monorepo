import { z } from 'zod';

export const UpdateCartSchema = z.object({
  quantity: z.int().min(1, 'Quantidade mínima é 1'),
});

export type UpdateCartDto = z.infer<typeof UpdateCartSchema>;
