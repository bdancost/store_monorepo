import { z } from 'zod';

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'], {
    message: 'Status inválido',
  }),
});

export type UpdateOrderStatusDto = z.infer<typeof UpdateOrderStatusSchema>;
