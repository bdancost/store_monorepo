import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { Server } from 'node:http';

interface LoginResponse {
  access_token: string;
}

describe('OrdersController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let server: Server;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
    server = app.getHttpServer() as Server;

    // Limpa e cria usuário de teste
    await prisma.user.deleteMany({ where: { email: 'orders@teste.com' } });
    await request(server).post('/users').send({
      name: 'Orders Test',
      email: 'orders@teste.com',
      password: 'correct_password',
    });

    // Faz login e salva o token
    const loginRes = await request(server).post('/auth/login').send({
      email: 'orders@teste.com',
      password: 'correct_password',
    });
    token = (loginRes.body as LoginResponse).access_token;
  });

  it('POST /orders -> deve falhar com carrinho vazio', async () => {
    const res = await request(server)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });

  it('POST /orders -> deve criar pedido com carrinho válido', async () => {
    // Busca um produto existente
    const products = await prisma.product.findMany({ take: 1 });
    const productId = products[0].id;

    // Adiciona ao carrinho
    await request(server)
      .post('/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 2 });

    // Cria o pedido
    const res = await request(server)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('status', 'PENDING');
    expect(res.body).toHaveProperty('total');
  });

  it('GET /orders -> deve listar pedidos do usuário', async () => {
    const res = await request(server)
      .get('/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('PATCH /orders/:id/cancel -> deve cancelar pedido PENDING', async () => {
    const orders = await prisma.order.findMany({
      where: { user: { email: 'orders@teste.com' } },
    });
    const orderId = orders[0].id;

    const res = await request(server)
      .patch(`/orders/${orderId}/cancel`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'CANCELLED');
  });

  it('PATCH /orders/:id/cancel -> deve falhar ao cancelar pedido SHIPPED', async () => {
    // Cria um pedido e muda para SHIPPED direto no banco
    const products = await prisma.product.findMany({ take: 1 });
    await request(server)
      .post('/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: products[0].id, quantity: 1 });

    const orderRes = await request(server)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`);

    const orderId = (orderRes.body as { id: string }).id;

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'SHIPPED' },
    });

    const res = await request(server)
      .patch(`/orders/${orderId}/cancel`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: 'orders@teste.com' } });
    await app.close();
  });
});
