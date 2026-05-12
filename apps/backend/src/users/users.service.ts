/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService, // Injetamos para usar o Hash de senha
  ) {}

  async create(data: CreateUserDto) {
    // 1. Verificamos se o e-mail já existe
    const userExists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userExists) {
      throw new ConflictException('Este e-mail já está em uso');
    }

    // 2. Transformamos a senha em Hash (Segurança!)
    const hashedPassword = await this.authService.hashPassword(data.password);

    // 3. Salvamos no banco
    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    // 4. Removemos a senha do objeto de retorno (Privacidade!)
    const { password: _password, ...result } = user;
    return result;
  }
}
