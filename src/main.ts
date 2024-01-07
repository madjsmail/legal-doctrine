import { AppModule } from './app.module';
import { setupSwagger } from './swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './guards/auth-guard';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  setupSwagger(app); // Register Swagger
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new AuthGuard(app.get(Reflector)));
  const configService = app.get(ConfigService);
  const port = process.env.PORT || configService.get('PORT') || 3001; // Use environment variable, fallback to config, then default

  app.enableCors();
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
