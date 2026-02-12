import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'net';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async check() {
    await this.dataSource.query('SELECT 1');
    await this.checkRedis();

    return {
      status: 'ok',
      database: 'up',
      redis: 'up',
      timestamp: new Date().toISOString(),
    };
  }

  private checkRedis(): Promise<void> {
    const host = this.configService.getOrThrow<string>('REDIS_HOST');
    const port = this.configService.getOrThrow<number>('REDIS_PORT');

    return new Promise((resolve, reject) => {
      const socket = new Socket();
      socket.setTimeout(1500);

      socket.connect(port, host, () => {
        socket.write('*1\r\n$4\r\nPING\r\n');
      });

      socket.on('data', (data) => {
        if (data.toString().includes('PONG')) resolve();
        else reject(new Error('Invalid Redis response'));
        socket.destroy();
      });

      socket.on('error', reject);
      socket.on('timeout', () => reject(new Error('Redis timeout')));
    });
  }
}
