import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    // init Nest app
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    // init Swagger docs
    const config = new DocumentBuilder()
        .setTitle('Finance Manager REST API (Nest.js)')
        .setDescription(
            "The application under development is a financial manager that helps keep track of the owner's finances.",
        )
        .setVersion('1.0.0')
        .addTag(':codica')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'jwt-auth',
        )
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);

    await app.listen(process.env.API_PORT || 3000);
}

bootstrap();
