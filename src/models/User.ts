import { IUser } from './interfaces/IUser';

export class User implements IUser {
    public borrowedBooks: string[] = [];

    constructor(
        public id: string,
        public name: string,
        public email: string,
    ) {}

    public getUserInfo(): string {
        return `${this.name} (${this.email})`;
    }

    public canBorrow(): boolean {
        return this.borrowedBooks.length < 3;
    }

    public borrowBook(bookId: string): void {
        if (this.canBorrow()) {
            this.borrowedBooks.push(bookId);
        }
    }

    public returnBook(bookId: string): void {
        this.borrowedBooks = this.borrowedBooks.filter((id) => id !== bookId);
    }
}
