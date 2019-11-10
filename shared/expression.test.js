const { calculate } = require('./expression');

describe('Calculate', () => {
    describe('Examples', () => {
        it('Should return 14', () => {
            expect(calculate('4+5*2')).toBe(14);
        });

        it('Should return 6.5', () => {
            expect(calculate('4+5/2')).toBe(6.5);
        });

        it('Should return 5.5', () => {
            expect(calculate('4+5/2-1')).toBe(5.5);
        });
    });
});