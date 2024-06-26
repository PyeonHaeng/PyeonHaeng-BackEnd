import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './products/products.module';
import { NoticesModule } from './notices/notices.module';
import { ConfigModule } from '@nestjs/config';
import { CreditsModule } from './credits/credits.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'mariadb',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    ProductModule,
    NoticesModule,
    CreditsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
