import { z } from 'zod';

export const AddToCartSchema = z.object({
  productId: z.string().min(1, 'productId é obrigatório'),
  quantity: z.int().min(1, 'Quantidade mínima é 1'),
});

export type AddToCartDto = z.infer<typeof AddToCartSchema>;
