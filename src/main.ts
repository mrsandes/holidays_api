import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { HolidaysModule } from './holidays/holidays.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(HolidaysModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  
  const config = new DocumentBuilder()
    .setTitle('Feriados API')
    .setDescription('<h3> Adicione, remova e busque feriados dos municípios e estados brasileiros! Acesse a lista de códigos: <a href="https://www.ibge.gov.br/explica/codigos-dos-municipios.php" target="_blank">IBGE</a> </h3>')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
