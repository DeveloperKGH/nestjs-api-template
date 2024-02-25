import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidationMessage } from '../constant/validation.message';

@ValidatorConstraint({ async: true })
export class IsPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password); // for English letters, numbers and special characters
  }

  defaultMessage() {
    return ValidationMessage.password.isPassword;
  }
}

export function IsPassword(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPasswordConstraint,
    });
  };
}
