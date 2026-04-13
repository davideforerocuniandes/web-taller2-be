import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

// B5: custom decorator that ensures a string is a valid slug
// a slug can only have lowercase letters, numbers, and hyphens
export function IsSlug(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSlug',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && /^[a-z0-9-]+$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must contain only lowercase letters, numbers, and hyphens`;
        },
      },
    });
  };
}
