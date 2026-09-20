import 'bootstrap/dist/css/bootstrap.min.css';
import { Library } from './services/Library';
import { Book } from './models/Book';
import { User } from './models/User';
import { Storage } from './services/Storage';
import { LibraryUI } from './ui/LibraryUI';

const savedBooks = Storage.get<Book[]>('books') || [];
const savedUsers = Storage.get<User[]>('users') || [];

const bookInstances = savedBooks.map(b => new Book(b.id, b.title, b.author, b.year, b.isBorrowed));
const userInstances = savedUsers.map(u => {
    const user = new User(u.id, u.name, u.email);
    user.borrowedBooks = u.borrowedBooks || [];
    return user;
});

const bookLibrary = new Library<Book>(bookInstances);
const userLibrary = new Library<User>(userInstances);

const ui = new LibraryUI(bookLibrary, userLibrary);
ui.render();
