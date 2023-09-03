import { ClassSerializerInterceptor, INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { BadRequestException } from '../exception/bad-request.exception';
import { Reflector } from '@nestjs/core';
import { GlobalExceptionFilter } from '../filter/global-exception.filter';
import { HttpStatusInterceptor } from '../interceptor/http-status.interceptor';

export function setNestApp<T extends INestApplication>(app: T) {
  // ValidationPipe 를 전역적으로 사용하도록 설정
  // 요청에서 받은 데이터를 DTO로 자동으로 변환하고 유효성 검사를 수행.
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 요청에서 받은 데이터를 DTO 클래스의 인스턴스로 자동 변환
      whitelist: true, // 요청 객체에서 DTO 에 정의된 프로퍼티만 받아옴. DTO 에 없는 프로퍼티는 제거
      forbidNonWhitelisted: true, // whitelist 옵션이 true 일 때, DTO 에 없는 프로퍼티가 요청에 포함되면 요청 자체를 거부
      forbidUnknownValues: true, // 알 수 없는 타입의 값(정의되지 않은 enum 값 등)이 요청에 포함되면 요청 자체를 거부
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errors = validationErrors.reduce<{ [key: string]: any }>((obj, error) => {
          obj[error.property] = error.constraints;
          return obj;
        }, {});

        return new BadRequestException(BadRequestException.ErrorCodes.INVALID_PARAMETER, errors);
      },
    }),
  );

  // ClassSerializerInterceptor : 응답을 보내기 전에 데이터를 직렬화하는 데 사용.
  // HttpStatusInterceptor : POST 응답 http status 201 이 아닌 200 으로 반환하도록 처리
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)), new HttpStatusInterceptor());

  // 모든 예외를 처리하기 위한 전역 필터를 설정.
  app.useGlobalFilters(new GlobalExceptionFilter());

  // API 버전 관리 활성화. URL 기반 버전 관리 사용.
  app.enableVersioning({ type: VersioningType.URI });

  //Graceful ShutDown
  app.enableShutdownHooks();
}
