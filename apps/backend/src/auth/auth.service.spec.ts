import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

// Por que não usar jest-mock-extended aqui?
// AuthService usa apenas prisma.user — um mock simples basta
// jest-mock-extended vale mais para services com muitos models
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

const mockJwtService = {
  signAsync: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Limpa todos os mocks antes de cada teste
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────
  // hashPassword e comparePasswords
  // Por que testar funções de bcrypt?
  // Para garantir que o hash é irreversível e
  // que a comparação funciona corretamente
  // ─────────────────────────────────────────────
  describe('hashPassword', () => {
    it('deve gerar um hash diferente da senha original', async () => {
      const password = 'minha_senha_123';
      const hash = await service.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      // Hash do bcrypt sempre começa com $2b$
      expect(hash).toMatch(/^\$2b\$/);
    });

    it('deve gerar hashes diferentes para a mesma senha', async () => {
      // bcrypt usa salt aleatório — mesmo input, outputs diferentes
      // Isso é importante para segurança: dois usuários com a
      // mesma senha têm hashes diferentes no banco
      const password = 'mesma_senha';
      const hash1 = await service.hashPassword(password);
      const hash2 = await service.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePasswords', () => {
    it('deve retornar true para senha correta', async () => {
      const password = 'senha_correta';
      const hash = await service.hashPassword(password);

      const result = await service.comparePasswords(password, hash);
      expect(result).toBe(true);
    });

    it('deve retornar false para senha incorreta', async () => {
      const password = 'senha_correta';
      const hash = await service.hashPassword(password);

      const result = await service.comparePasswords('senha_errada', hash);
      expect(result).toBe(false);
    });
  });

  // ─────────────────────────────────────────────
  // login
  // ─────────────────────────────────────────────
  describe('login', () => {
    const mockUser = {
      id: 'user-123',
      name: 'Daniel Fernandes',
      email: 'daniel@test.com',
      password: '', // será preenchido nos testes que precisam
    };

    it('deve retornar access_token e dados do usuário no login bem-sucedido', async () => {
      // Gera um hash real para o teste ser realista
      const hashedPassword = await service.hashPassword('senha123');
      const userWithHash = { ...mockUser, password: hashedPassword };

      mockPrismaService.user.findUnique.mockResolvedValue(userWithHash);
      mockJwtService.signAsync.mockResolvedValue('fake.jwt.token');

      const result = await service.login({
        email: 'daniel@test.com',
        password: 'senha123',
      });

      // Verifica estrutura do retorno
      expect(result).toEqual({
        access_token: 'fake.jwt.token',
        user: {
          id: 'user-123',
          name: 'Daniel Fernandes',
          email: 'daniel@test.com',
        },
      });

      // A senha NUNCA deve estar no retorno
      expect(result).not.toHaveProperty('password');
    });

    it('deve lançar UnauthorizedException se o usuário não existir', async () => {
      // findUnique retorna null — usuário não encontrado
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Verifica que a exceção correta é lançada
      await expect(
        service.login({ email: 'nao@existe.com', password: '123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException para senha incorreta', async () => {
      const hashedPassword = await service.hashPassword('senha_correta');
      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      await expect(
        service.login({ email: 'daniel@test.com', password: 'senha_errada' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve usar a mensagem genérica para ambos os erros', async () => {
      // Segurança: a mensagem de erro não deve dizer se o
      // email existe ou não — isso evita user enumeration attack
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'x@x.com', password: '123' }),
      ).rejects.toThrow('Credenciais inválidas');
    });

    it('deve chamar signAsync com sub e email corretos', async () => {
      const hashedPassword = await service.hashPassword('senha123');
      mockPrismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });
      mockJwtService.signAsync.mockResolvedValue('token');

      await service.login({ email: 'daniel@test.com', password: 'senha123' });

      // O payload do JWT deve conter sub (userId) e email
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: 'user-123',
        email: 'daniel@test.com',
      });
    });
  });
});
