import { Library } from '../services/Library';
import { Book } from '../models/Book';
import { User } from '../models/User';
import { Validation } from '../utils/validators';
import { Storage } from '../services/Storage';

export class LibraryUI {
    private appContainer: HTMLElement | null;

    constructor(
        private bookLibrary: Library<Book>,
        private userLibrary: Library<User>
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
                titleInput.errorDiv.textContent = 'Назва обов\'язкова';
                isValid = false;
            } else {
                titleInput.input.classList.remove('is-invalid');
            }

            if (!Validation.isRequired(authorInput.input.value)) {
                authorInput.input.classList.add('is-invalid');
                authorInput.errorDiv.textContent = 'Автор обов\'язковий';
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
                    parseInt(yearInput.input.value, 10)
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

        books.forEach(book => {
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
    }

}
