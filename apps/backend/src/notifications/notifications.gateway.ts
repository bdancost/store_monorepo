/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

// @WebSocketGateway configura o servidor WebSocket
// cors: permite conexões do frontend (ajuste a origem em produção)
// namespace: '/notifications' — isola esse gateway de outros
// Por que namespace? Permite ter múltiplos gateways no mesmo servidor
// cada um com seu propósito (notificações, chat, etc)
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3001',
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  // @WebSocketServer injeta a instância do servidor Socket.IO
  // usamos para emitir eventos para clientes específicos
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  // Map de userId → socketId
  // Por que Map e não só usar socket.id?
  // Porque precisamos encontrar o socket de um usuário
  // pelo userId (ex: quando o admin muda um status)
  // sem esse mapa, teríamos que percorrer todas as conexões
  private userSockets = new Map<string, string>();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Chamado quando um cliente conecta
  async handleConnection(client: Socket) {
    try {
      // Extrai o token do handshake
      // O cliente envia via auth: { token } na conexão
      const token =
        (client.handshake.auth.token as string | undefined) ??
        client.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        // Desconecta clientes sem token
        client.disconnect();
        return;
      }

      // Valida o JWT — mesmo processo do AuthGuard
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // Associa o userId ao socketId
      this.userSockets.set(payload.sub, client.id);

      // Coloca o cliente em uma "room" com seu userId
      // Rooms permitem emitir para um grupo específico
      // por que usar room além do Map?
      // Porque o usuário pode ter múltiplas abas abertas
      // a room agrupa todos os sockets do mesmo usuário
      await client.join(`user:${payload.sub}`);

      this.logger.log(
        `Cliente conectado: ${client.id} (userId: ${payload.sub})`,
      );

      // Envia confirmação de conexão
      client.emit('connected', {
        message: 'Conectado às notificações em tempo real',
        userId: payload.sub,
      });
    } catch {
      // Token inválido — desconecta
      client.disconnect();
    }
  }

  // Chamado quando um cliente desconecta
  handleDisconnect(client: Socket) {
    // Remove do mapa de usuários
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        this.logger.log(
          `Cliente desconectado: ${client.id} (userId: ${userId})`,
        );
        break;
      }
    }
  }

  // Método público — chamado por outros services para enviar notificações
  // Por que método público e não evento?
  // Porque o OrdersService precisa chamar isso após mudar um status
  // Injetar o Gateway no Service é o padrão do NestJS para isso
  notifyUser(userId: string, event: string, data: Record<string, unknown>) {
    // Emite para todos os sockets na room do usuário
    // Funciona mesmo se o usuário tiver múltiplas abas
    this.server.to(`user:${userId}`).emit(event, {
      ...data,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(
      `Notificação enviada para userId: ${userId}, evento: ${event}`,
    );
  }

  // Evento de ping — cliente pode verificar se está conectado
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    client.emit('pong', { timestamp: new Date().toISOString() });
  }
}
