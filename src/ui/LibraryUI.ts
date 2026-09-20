import { Library } from '../services/Library';
import { Book } from '../models/Book';
import { User } from '../models/User';
import { Validation } from '../utils/validators';
import { Storage } from '../services/Storage';

export class LibraryUI {
    private appContainer: HTMLElement | null;

    constructor(
        private bookLibrary: Library<Book>,
        private userLibrary: Library<User>,
    ) {
        this.appContainer = document.getElementById('app');
    }

    public render(): void {
        if (!this.appContainer) return;
        this.appContainer.innerHTML = '';

        const container = document.createElement('div');
        container.className = 'container mt-5';

        const title = document.createElement('h1');
        title.className = 'text-center mb-5 text-primary';
        title.textContent = 'Система управління бібліотекою';

        const row = document.createElement('div');
        row.className = 'row';

        const leftCol = document.createElement('div');
        leftCol.className = 'col-md-5';
        leftCol.id = 'forms-container';

        const rightCol = document.createElement('div');
        rightCol.className = 'col-md-7';
        rightCol.id = 'lists-container';

        row.appendChild(leftCol);
        row.appendChild(rightCol);
        container.appendChild(title);
        container.appendChild(row);
        this.appContainer.appendChild(container);

        this.renderBookForm(leftCol);
        this.renderUserForm(leftCol);
        this.renderLists();
    }

    private renderBookForm(container: HTMLElement): void {
        const card = document.createElement('div');
        card.className = 'card mb-4 shadow-sm';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title mb-3';
        cardTitle.textContent = 'Додати нову книгу';

        const form = document.createElement('form');

        const createInput = (id: string, placeholder: string, type: string = 'text') => {
            const wrapper = document.createElement('div');
            wrapper.className = 'mb-3';

            const input = document.createElement('input');
            input.type = type;
            input.id = id;
            input.className = 'form-control';
            input.placeholder = placeholder;

            const errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';

            wrapper.appendChild(input);
            wrapper.appendChild(errorDiv);
            return { wrapper, input, errorDiv };
        };

        const titleInput = createInput('book-title', 'Назва книги');
        const authorInput = createInput('book-author', 'Автор');
        const yearInput = createInput('book-year', 'Рік видання');

        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.className = 'btn btn-primary w-100';
        submitBtn.textContent = 'Додати книгу';

        form.appendChild(titleInput.wrapper);
        form.appendChild(authorInput.wrapper);
        form.appendChild(yearInput.wrapper);
        form.appendChild(submitBtn);

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;

            if (!Validation.isRequired(titleInput.input.value)) {
                titleInput.input.classList.add('is-invalid');
                titleInput.errorDiv.textContent = "Назва обов'язкова";
                isValid = false;
            } else {
                titleInput.input.classList.remove('is-invalid');
            }

            if (!Validation.isRequired(authorInput.input.value)) {
                authorInput.input.classList.add('is-invalid');
                authorInput.errorDiv.textContent = "Автор обов'язковий";
                isValid = false;
            } else {
                authorInput.input.classList.remove('is-invalid');
            }

            if (!Validation.isYearValid(yearInput.input.value)) {
                yearInput.input.classList.add('is-invalid');
                yearInput.errorDiv.textContent = 'Введіть коректний рік (4 цифри)';
                isValid = false;
            } else {
                yearInput.input.classList.remove('is-invalid');
            }

            if (isValid) {
                const newBook = new Book(
                    Date.now().toString(),
                    titleInput.input.value,
                    authorInput.input.value,
                    parseInt(yearInput.input.value, 10),
                );

                this.bookLibrary.add(newBook);
                Storage.save('books', this.bookLibrary.getAll());

                form.reset();
                this.renderLists();
            }
        });

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(form);
        card.appendChild(cardBody);
        container.appendChild(card);
    }

    private renderLists(): void {
        const container = document.getElementById('lists-container');
        if (!container) return;

        container.innerHTML = '';

        const booksHeader = document.createElement('h3');
        booksHeader.className = 'mb-3';
        booksHeader.textContent = 'Список книг';
        container.appendChild(booksHeader);

        const books = this.bookLibrary.getAll();

        if (books.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.className = 'text-muted';
            emptyMsg.textContent = 'Бібліотека порожня. Додайте першу книгу!';
            container.appendChild(emptyMsg);
            return;
        }

        const listGroup = document.createElement('ul');
        listGroup.className = 'list-group mb-4 shadow-sm';

        books.forEach((book) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';

            const bookInfo = document.createElement('span');
            bookInfo.textContent = book.getBookInfo();

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-outline-danger';
            deleteBtn.textContent = 'Видалити';
            deleteBtn.onclick = () => {
                this.bookLibrary.remove(book.id);
                Storage.save('books', this.bookLibrary.getAll());
                this.renderLists();
            };

            li.appendChild(bookInfo);
            li.appendChild(deleteBtn);
            listGroup.appendChild(li);
        });

        container.appendChild(listGroup);

        const usersHeader = document.createElement('h3');
        usersHeader.className = 'mb-3 mt-4';
        usersHeader.textContent = 'Список користувачів';
        container.appendChild(usersHeader);

        const users = this.userLibrary.getAll();

        if (users.length === 0) {
            const emptyUsersMsg = document.createElement('p');
            emptyUsersMsg.className = 'text-muted';
            emptyUsersMsg.textContent = 'Немає зареєстрованих користувачів.';
            container.appendChild(emptyUsersMsg);
            return;
        }

        const userListGroup = document.createElement('ul');
        userListGroup.className = 'list-group mb-4 shadow-sm';

        users.forEach((user) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';

            const userInfo = document.createElement('span');
            userInfo.textContent = user.getUserInfo();

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-sm btn-outline-danger';
            deleteBtn.textContent = 'Видалити';
            deleteBtn.onclick = () => {
                this.userLibrary.remove(user.id);
                Storage.save('users', this.userLibrary.getAll());
                this.renderLists();
            };

            li.appendChild(userInfo);
            li.appendChild(deleteBtn);
            userListGroup.appendChild(li);
        });

        container.appendChild(userListGroup);
    }

    private renderUserForm(container: HTMLElement): void {
        const card = document.createElement('div');
        card.className = 'card mb-4 shadow-sm';
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title mb-3';
        cardTitle.textContent = 'Додати користувача';

        const form = document.createElement('form');

        // Створюємо поля
        const nameWrapper = document.createElement('div');
        nameWrapper.className = 'mb-3';
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'form-control';
        nameInput.placeholder = "Ім'я користувача";
        nameWrapper.appendChild(nameInput);

        const emailWrapper = document.createElement('div');
        emailWrapper.className = 'mb-3';
        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.className = 'form-control';
        emailInput.placeholder = 'Email';
        emailWrapper.appendChild(emailInput);

        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.className = 'btn btn-success w-100';
        submitBtn.textContent = 'Додати користувача';

        form.appendChild(nameWrapper);
        form.appendChild(emailWrapper);
        form.appendChild(submitBtn);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (Validation.isRequired(nameInput.value) && Validation.isRequired(emailInput.value)) {
                // ID користувача має бути тільки з цифр за завданням
                const numericId = Math.floor(Math.random() * 1000000).toString();
                const newUser = new User(numericId, nameInput.value, emailInput.value);

                this.userLibrary.add(newUser);
                Storage.save('users', this.userLibrary.getAll());

                form.reset();
                this.renderLists();
            } else {
                alert('Будь ласка, заповніть всі поля коректно.');
            }
        });

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(form);
        card.appendChild(cardBody);
        container.appendChild(card);
    }
}
