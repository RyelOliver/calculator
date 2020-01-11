const INVALID_CHARACTERS =
'Expressions are limited to non-negative integers and the `+-*/` operators.';
const INVALID_OPERATORS =
'Expression operators must be preceded and followed by integers.';

const Operators = {
    '+': (left, right) => evaluate(left) + evaluate(right),
    '-': (left, right) => evaluate(left) - evaluate(right),
    '*': (left, right) => evaluate(left) * evaluate(right),
    '/': (left, right) => evaluate(left) / evaluate(right),
};

const calculate = expression => {
    expression = expression.replace(/\s/, '');
    if (!expression) return 0;
    return evaluate(parse(expression));
};

const evaluate = objectExpression => {
    if (typeof objectExpression === 'string') return parseFloat(objectExpression);
    const { operator, left, right } = objectExpression;
    return Operators[operator](left, right);
};

const parse = stringExpression => {
    const Operators = [ '*', '/', '+', '-' ];
    while (Operators.length) {
        const operator = Operators.pop();
        if (stringExpression.includes(operator)) {
            return {
                operator,
                left: parse(stringExpression.substring(0, stringExpression.indexOf(operator))),
                right: parse(stringExpression.substring(stringExpression.indexOf(operator)+1)),
            };
        }
    }
    return stringExpression;
};

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
    evaluate,
    parse,
    validate,
};