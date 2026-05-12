import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateUserSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
