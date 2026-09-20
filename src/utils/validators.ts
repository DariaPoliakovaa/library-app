export namespace Validation {
    export function isRequired(value: string): boolean {
        return value.trim().length > 0;
    }

    export function isIdValid(id: string): boolean {
        const idRegex = /^\d+$/;
        return idRegex.test(id);
    }

    export function isYearValid(year: string): boolean {
        const yearRegex = /^\d{4}$/;

        if (!yearRegex.test(year)) {
            return false;
        }

        const yearNum = parseInt(year, 10);
        const currentYear = new Date().getFullYear();

        return yearNum >= 1000 && yearNum <= currentYear;
    }
}
