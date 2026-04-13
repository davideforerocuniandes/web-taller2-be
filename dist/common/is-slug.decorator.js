"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsSlug = IsSlug;
const class_validator_1 = require("class-validator");
function IsSlug(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isSlug',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value, args) {
                    return typeof value === 'string' && /^[a-z0-9-]+$/.test(value);
                },
                defaultMessage(args) {
                    return `${args.property} must contain only lowercase letters, numbers, and hyphens`;
                },
            },
        });
    };
}
//# sourceMappingURL=is-slug.decorator.js.map