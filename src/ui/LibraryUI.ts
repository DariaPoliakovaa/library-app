import { Library } from '../services/Library';
import { Book } from '../models/Book';
import { User } from '../models/User';
import { Validation } from '../utils/validators';
import { Storage } from '../services/Storage';
import { Notifier } from './Notifier';

export class LibraryUI {
    private appContainer: HTMLElement | null;
    private currentPage: number = 1;
    private readonly itemsPerPage: number = 5;
    private searchQuery: string = '';

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

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'form-control mb-4';
        searchInput.placeholder = 'Пошук книг за назвою або автором...';
        searchInput.value = this.searchQuery;
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = (e.target as HTMLInputElement).value;
            this.currentPage = 1;
            this.renderLists();
        });
        container.appendChild(searchInput);

        const booksHeader = document.createElement('h3');
        booksHeader.className = 'mb-3';
        booksHeader.textContent = 'Каталог книг';
        container.appendChild(booksHeader);

        const allBooks = this.bookLibrary.getAll();
        const filteredBooks = allBooks.filter(
            (b) =>
                b.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                b.author.toLowerCase().includes(this.searchQuery.toLowerCase()),
        );

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const paginatedBooks = filteredBooks.slice(startIndex, startIndex + this.itemsPerPage);

        const listGroup = document.createElement('ul');
        listGroup.className = 'list-group mb-3 shadow-sm';

        const users = this.userLibrary.getAll();

        paginatedBooks.forEach((book) => {
            const li = document.createElement('li');
            li.className =
                'list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2';

            const bookInfo = document.createElement('span');
            bookInfo.innerHTML = `<strong>${book.title}</strong> - ${book.author} (${book.year})`;

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'd-flex gap-2 align-items-center';

            if (book.isBorrowed) {
                const borrower = users.find((u) => u.borrowedBooks.includes(book.id));
                const statusBadge = document.createElement('span');
                statusBadge.className = 'badge bg-secondary';
                statusBadge.textContent = borrower ? `Позичено: ${borrower.name}` : 'Позичено';

                const returnBtn = document.createElement('button');
                returnBtn.className = 'btn btn-sm btn-outline-success';
                returnBtn.textContent = 'Повернути';
                returnBtn.onclick = () => {
                    Notifier.notify('Обробка повернення...', 'info');
                    setTimeout(() => {
                        book.toggleBorrowStatus();
                        if (borrower) borrower.returnBook(book.id);
                        Storage.save('books', this.bookLibrary.getAll());
                        Storage.save('users', this.userLibrary.getAll());
                        Notifier.notify('Книгу успішно повернуто!', 'success');
                        this.renderLists();
                    }, 500);
                };

                actionsDiv.appendChild(statusBadge);
                actionsDiv.appendChild(returnBtn);
            } else {
                const userSelect = document.createElement('select');
                userSelect.className = 'form-select form-select-sm w-auto';
                userSelect.innerHTML =
                    `<option value="">Оберіть читача</option>` +
                    users.map((u) => `<option value="${u.id}">${u.name}</option>`).join('');

                const borrowBtn = document.createElement('button');
                borrowBtn.className = 'btn btn-sm btn-primary';
                borrowBtn.textContent = 'Позичити';
                borrowBtn.onclick = () => {
                    if (!userSelect.value) {
                        Notifier.notify('Будь ласка, оберіть користувача', 'danger');
                        return;
                    }
                    const user = this.userLibrary.findById(userSelect.value);
                    if (user) {
                        if (!user.canBorrow()) {
                            Notifier.showModal(
                                'Ліміт вичерпано!',
                                `Користувач ${user.name} вже позичив 3 книги. Це максимум.`,
                            );
                            return;
                        }
                        Notifier.notify('Реєструємо видачу книги...', 'info');
                        setTimeout(() => {
                            user.borrowBook(book.id);
                            book.toggleBorrowStatus();
                            Storage.save('books', this.bookLibrary.getAll());
                            Storage.save('users', this.userLibrary.getAll());
                            Notifier.notify('Книгу успішно видано!', 'success');
                            this.renderLists();
                        }, 800);
                    }
                };
                actionsDiv.appendChild(userSelect);
                actionsDiv.appendChild(borrowBtn);
            }

            li.appendChild(bookInfo);
            li.appendChild(actionsDiv);
            listGroup.appendChild(li);
        });

        container.appendChild(listGroup);

        const totalPages = Math.ceil(filteredBooks.length / this.itemsPerPage);
        if (totalPages > 1) {
            const paginationDiv = document.createElement('div');
            paginationDiv.className = 'd-flex justify-content-center gap-3 mb-4';

            const prevBtn = document.createElement('button');
            prevBtn.className = 'btn btn-outline-primary btn-sm';
            prevBtn.textContent = '← Попередня';
            prevBtn.disabled = this.currentPage === 1;
            prevBtn.onclick = () => {
                this.currentPage--;
                this.renderLists();
            };

            const pageInfo = document.createElement('span');
            pageInfo.className = 'align-self-center fw-bold';
            pageInfo.textContent = `Сторінка ${this.currentPage} з ${totalPages}`;

            const nextBtn = document.createElement('button');
            nextBtn.className = 'btn btn-outline-primary btn-sm';
            nextBtn.textContent = 'Наступна →';
            nextBtn.disabled = this.currentPage === totalPages;
            nextBtn.onclick = () => {
                this.currentPage++;
                this.renderLists();
            };

            paginationDiv.appendChild(prevBtn);
            paginationDiv.appendChild(pageInfo);
            paginationDiv.appendChild(nextBtn);
            container.appendChild(paginationDiv);
        }
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
