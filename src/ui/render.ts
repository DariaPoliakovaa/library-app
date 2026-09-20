import { Library } from '../services/Library';
import { Book } from '../models/Book';
import { User } from '../models/User';
import { BookForm } from './components/BookForm';
import { UserForm } from './components/UserForm';
import { BookList } from './components/BookList';
import { UserList } from './components/UserList';

export class AppRenderer {
    constructor(
        private bookLibrary: Library<Book>,
        private userLibrary: Library<User>,
    ) {}

    public init(appContainer: HTMLElement): void {
        appContainer.innerHTML = '';

        const row = document.createElement('div');
        row.className = 'row mt-5';

        const leftCol = document.createElement('div');
        leftCol.className = 'col-md-5';

        const rightCol = document.createElement('div');
        rightCol.className = 'col-md-7';

        row.append(leftCol, rightCol);
        appContainer.appendChild(row);

        const bookList = new BookList(this.bookLibrary, this.userLibrary);
        const userList = new UserList(this.userLibrary, this.bookLibrary, () => bookList.render());

        const booksContainer = document.createElement('div');
        const usersContainer = document.createElement('div');
        rightCol.append(booksContainer, usersContainer);

        const bookForm = new BookForm(this.bookLibrary, () => {
            bookList.render(booksContainer);
        });

        const userForm = new UserForm(this.userLibrary, () => {
            userList.render(usersContainer);
            bookList.render(booksContainer);
        });

        bookForm.render(leftCol);
        userForm.render(leftCol);

        bookList.render(booksContainer);
        userList.render(usersContainer);
    }
}
