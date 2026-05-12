import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import type { ZodType } from 'zod';
import { ZodError } from 'zod'; // Importe a classe ZodError

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      // O parse direto é mais simples aqui se usarmos o try/catch
      return this.schema.parse(value);
    } catch (error: unknown) {
      // O erro vem como unknown

      // Verificamos se o erro é do Zod para satisfazer o TS e o ESLint
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: error.flatten().fieldErrors,
        });
      }

      // Se for um erro desconhecido, lançamos um erro genérico
      throw new BadRequestException('Unexpected validation error');
    }
  }
}
