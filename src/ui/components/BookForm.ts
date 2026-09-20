import { Library } from '../../services/Library';
import { Book } from '../../models/Book';
import { Storage } from '../../services/Storage';
import { Validation } from '../../utils/validators';
import { FormBuilder } from './FormBuilder';
import { Modal } from './Modal';

export class BookForm {
    constructor(
        private bookLibrary: Library<Book>,
        private onBookAdded: () => void,
    ) {}

    public render(container: HTMLElement): void {
        const card = document.createElement('div');
        card.className = 'card mb-4 shadow-sm';
        card.innerHTML =
            '<div class="card-body"><h5 class="card-title mb-3">Додати нову книгу</h5></div>';

        const form = document.createElement('form');
        const titleInput = FormBuilder.createInput('book-title', 'Назва книги');
        const authorInput = FormBuilder.createInput('book-author', 'Автор');
        const yearInput = FormBuilder.createInput('book-year', 'Рік видання');

        const submitBtn = document.createElement('button');
        submitBtn.className = 'btn btn-primary w-100';
        submitBtn.textContent = 'Додати книгу';

        form.append(titleInput.wrapper, authorInput.wrapper, yearInput.wrapper, submitBtn);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (
                Validation.isRequired(titleInput.input.value) &&
                Validation.isYearValid(yearInput.input.value)
            ) {
                const newBook = new Book(
                    Date.now().toString(),
                    titleInput.input.value,
                    authorInput.input.value,
                    parseInt(yearInput.input.value, 10),
                );
                this.bookLibrary.add(newBook);
                Storage.save('books', this.bookLibrary.getAll());
                form.reset();
                Modal.toast('Книгу успішно додано!', 'success');
                this.onBookAdded();
            } else {
                Modal.toast('Перевірте правильність заповнення полів', 'danger');
            }
        });

        card.querySelector('.card-body')?.appendChild(form);
        container.appendChild(card);
    }
}
