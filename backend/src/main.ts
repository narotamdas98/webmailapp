import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  console.log("Listening on port " + port)
  await app.listen(port);
  console.log("PORT:", app.getHttpServer().address().port)
}

bootstrap();

