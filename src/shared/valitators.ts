import { ApiPropertyOptional, ApiPropertyOptions } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNumber, IsOptional } from 'class-validator';

export function OptionalProperty(
  options?: ApiPropertyOptions,
): PropertyDecorator {
  /* eslint-disable-next-line */
  return (target: Object, propertyKey: string | symbol) => {
    ApiPropertyOptional(options)(target, propertyKey);
    IsOptional()(target, propertyKey);
  };
}

/* eslint-disable-next-line */
export function IsBool(target: Object, propertyKey: string | symbol) {
  Transform(({ value }) => {
    return [true, 'enabled', 'true'].indexOf(value) > -1;
  })(target, propertyKey);
  IsBoolean()(target, propertyKey);
}

/* eslint-disable-next-line */
export function IsInteger(target: Object, propertyKey: string | symbol) {
  Type(() => Number)(target, propertyKey);
  IsInt()(target, propertyKey);
}

export function IsFloat(
  target: NonNullable<unknown>,
  propertyKey: string | symbol,
) {
  Type(() => Number)(target, propertyKey);
  IsNumber()(target, propertyKey);
}
