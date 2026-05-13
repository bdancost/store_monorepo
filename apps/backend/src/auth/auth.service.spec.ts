import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    // Criamos um "módulo de teste" que simula o ambiente do NestJS
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        // Usamos "mocks" (simulações) para as dependências que não queremos testar agora
        { provide: JwtService, useValue: {} },
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('deve gerar um hash de senha e validar corretamente', async () => {
    const password = 'minha_senha_segura';

    // 1. Gera o hash
    const hash = await service.hashPassword(password);

    // Verificamos se o hash não é igual à senha pura e se não está vazio
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);

    // 2. Compara a senha correta com o hash
    const isMatch = await service.comparePasswords(password, hash);
    expect(isMatch).toBe(true);

    // 3. Compara uma senha errada com o hash
    const isWrong = await service.comparePasswords('senha_errada', hash);
    expect(isWrong).toBe(false);
  });
});
