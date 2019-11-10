const {
    INVALID_CHARACTERS,
    INVALID_OPERATORS,

    calculate,
    validate,
} = require('./expression');

describe('Calculate', () => {
    describe('Empty expressions', () => {
        it('Should return 0', () => {
            expect(calculate('')).toBe(0);
        });
    });

    describe('Operator precedence', () => {
        it('Should multiply before adding or subtracting', () => {
            expect(calculate('2+4*2')).toBe(10);
            expect(calculate('2*4+2')).toBe(10);
            expect(calculate('2-4*2')).toBe(-6);
            expect(calculate('2*4-2')).toBe(6);
        });

        it('Should divide before adding or subtracting', () => {
            expect(calculate('2+4/2')).toBe(4);
            expect(calculate('4/2+2')).toBe(4);
            expect(calculate('2-4/2')).toBe(0);
            expect(calculate('4/2-2')).toBe(0);
        });
    });

    describe('Examples', () => {
        it('Should return expected values', () => {
            expect(calculate('4+5*2')).toBe(14);

            expect(calculate('4+5/2')).toBe(6.5);

            expect(calculate('4+5/2-1')).toBe(5.5);
        });
    });
});

describe('Validate', () => {
    describe('Should return invalid if', () => {
        it('Includes characters other than integers and `+-*/` operators', () => {
            expect(validate('4+5*2%7')).toEqual({
                valid: false,
                message: INVALID_CHARACTERS,
            });

            expect(validate('e4+5/2')).toEqual({
                valid: false,
                message: INVALID_CHARACTERS,
            });

            expect(validate('4+5/2.5-1')).toEqual({
                valid: false,
                message: INVALID_CHARACTERS,
            });
        });

        it('Contains operators without a left and right operand', () => {
            expect(validate('*')).toEqual({
                valid: false,
                message: INVALID_OPERATORS,
            });

            expect(validate('-4')).toEqual({
                valid: false,
                message: INVALID_OPERATORS,
            });

            expect(validate('-4+5*2')).toEqual({
                valid: false,
                message: INVALID_OPERATORS,
            });

            expect(validate('4+5*/2')).toEqual({
                valid: false,
                message: INVALID_OPERATORS,
            });

            expect(validate('4+ -5/2')).toEqual({
                valid: false,
                message: INVALID_OPERATORS,
            });

            expect(validate(' -4+5/2')).toEqual({
                valid: false,
                message: INVALID_OPERATORS,
            });

            expect(validate('4+5/2-1+')).toEqual({
                valid: false,
                message: INVALID_OPERATORS,
            });
        });
    });

    describe('Should return valid if', () => {
        it('Is an empty expression', () => {
            expect(validate('')).toEqual({ valid: true });
        });
    });

    describe('Examples', () => {
        it('Should be considered valid', () => {
            expect(validate('4+5*2')).toEqual({
                valid: true,
            });

            expect(validate('4+5/2')).toEqual({
                valid: true,
            });

            expect(validate('4+5/2-1')).toEqual({
                valid: true,
            });
        });
    });
});