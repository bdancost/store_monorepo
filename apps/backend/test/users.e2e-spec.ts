import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { Server } from 'node:http';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  interface UserResponse {
    id: number;
    name: string;
    email: string;
  }

  // 1. Adicionamos o 'async' aqui para poder usar o 'await'
  it('/users (POST) -> deve cadastrar um novo usuário', async () => {
    // 2. O cast para 'Server' resolve o erro de 'any'
    const server = app.getHttpServer() as Server;

    const response = await request(server).post('/users').send({
      name: 'Dev Pleno',
      email: 'pleno@teste.com',
      password: 'password123',
    });

    const body = response.body as UserResponse;

    // 3. Usamos o 'expect' do Jest de forma clara, o que o ESLint adora
    expect(response.status).toBe(201);
    expect(body).not.toHaveProperty('password');
    expect(body.email).toBe('pleno@teste.com');
  });

  afterAll(async () => {
    await app.close();
  });
});
