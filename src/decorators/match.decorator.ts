import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'Match', async: false })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    if (value === undefined && relatedValue === undefined) {
      return true;
    }

    if (
      (value === undefined && relatedValue !== undefined) ||
      (value !== undefined && relatedValue === undefined)
    ) {
      return false;
    }

    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} does not match ${args.constraints[0]}`;
  }
}

export function Match(property: string, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}
