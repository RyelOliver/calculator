const calculate = expression => expression.trim() ?
    eval(expression) : 0;

const INVALID_CHARACTERS =
    'Expressions are limited to non-negative integers and the `+-*/` operators.';
const INVALID_OPERATORS =
    'Expression operators must be preceded and followed by integers.';

const validate = expression => {
    expression = expression.replace(/\s/, '');

    if (/[^\d+\-*/]/.test(expression))
        return {
            valid: false,
            message: INVALID_CHARACTERS,
        };

    if (/^[+\-*/]/.test(expression) || /[+\-*/]$/.test(expression) || /[+\-*/]{2}/.test(expression))
        return {
            valid: false,
            message: INVALID_OPERATORS,
        };

    return { valid: true };
};

module.exports = {
    INVALID_CHARACTERS,
    INVALID_OPERATORS,

    calculate,
    validate,
};