import { expect } from 'chai';
import { Validation } from '../src/utils/validators';

describe('Validation Namespace', () => {
    it('повинен правильно відхиляти порожні рядки (isRequired)', () => {
        expect(Validation.isRequired('   ')).to.be.false;
        expect(Validation.isRequired('Текст')).to.be.true;
    });

    it('повинен пропускати тільки цифри для ID (isIdValid)', () => {
        expect(Validation.isIdValid('12345')).to.be.true;
        expect(Validation.isIdValid('123a5')).to.be.false;
        expect(Validation.isIdValid('')).to.be.false;
    });

    it('повинен коректно валідувати рік видання (isYearValid)', () => {
        expect(Validation.isYearValid('2023')).to.be.true;
        expect(Validation.isYearValid('999')).to.be.false;
        expect(Validation.isYearValid('3000')).to.be.false;
        expect(Validation.isYearValid('abcd')).to.be.false;
    });
});
