import { IBook } from './interfaces/IBook';

export class Book implements IBook {
    constructor(
        public id: string,
        public title: string,
        public author: string,
        public year: number,
        public isBorrowed: boolean = false,
    ) {}

    public getBookInfo(): string {
        return `"${this.title}" - ${this.author} (${this.year})`;
    }

    public toggleBorrowStatus(): void {
        this.isBorrowed = !this.isBorrowed;
    }
}
