import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// 1. Definimos o Schema de validação
export const CreateProductSchema = z.object({
  title: z.string().min(3, 'Nome muito curto'),
  price: z.number().positive('Preço deve ser maior que zero'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  image: z.url('URL da imagem inválida'),
});

// 2. Extraímos o tipo TypeScript para usar no código
export class CreateProductDto extends createZodDto(CreateProductSchema) {}
