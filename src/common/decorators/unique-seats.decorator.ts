import { registerDecorator, ValidationOptions } from 'class-validator';

export function UniqueSeats(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'uniqueSeats',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (!Array.isArray(value)) {
            return false;
          }

          const keys = value.map((item) => {
            if (!item || typeof item !== 'object') {
              return '';
            }

            const seat = item as { row?: unknown; seat?: unknown };
            return `${String(seat.row)}:${String(seat.seat)}`;
          });

          return new Set(keys).size === keys.length;
        },
        defaultMessage() {
          return 'seats must not contain the same place more than once';
        },
      },
    });
  };
}
