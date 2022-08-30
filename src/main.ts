import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 5000;

  app.setGlobalPrefix('/api/v1');

  await app.listen(port);
  Logger.log(
    `Server started running on http://localhost:${port}/api/v1/`,
    'Bootstrap',
  );
}
bootstrap();
