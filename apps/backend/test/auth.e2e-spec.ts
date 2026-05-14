import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { Server } from 'node:http'; // Importante para o cast

// Interface para evitar o erro de 'unsafe-member-access' no res.body
interface LoginResponse {
  access_token: string;
  user: {
    email: string;
  };
}

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    const server = app.getHttpServer() as Server;

    await prisma.user.deleteMany();

    // Usamos await aqui para garantir que o usuário exista antes dos testes
    await request(server).post('/users').send({
      name: 'User Test',
      email: 'login@teste.com',
      password: 'correct_password',
    });
  });

  it('/auth/login (POST) -> deve retornar token JWT com credenciais certas', async () => {
    const server = app.getHttpServer() as Server;

    const response = await request(server).post('/auth/login').send({
      email: 'login@teste.com',
      password: 'correct_password',
    });

    const body = response.body as LoginResponse;

    expect(response.status).toBe(201);
    expect(body).toHaveProperty('access_token');
    expect(body.user.email).toEqual('login@teste.com');
  });

  it('/auth/login (POST) -> deve dar erro 401 com senha errada', async () => {
    const server = app.getHttpServer() as Server;

    const response = await request(server).post('/auth/login').send({
      email: 'login@teste.com',
      password: 'wrong_password',
    });

    expect(response.status).toBe(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
