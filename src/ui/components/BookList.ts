import { Library } from '../../services/Library';
import { Book } from '../../models/Book';
import { User } from '../../models/User';
import { Storage } from '../../services/Storage';
import { Modal } from './Modal';
import { Button } from './Button';

export class BookList {
    private container: HTMLElement | null = null;
    private currentPage: number = 1;
    private readonly itemsPerPage: number = 5;
    private searchQuery: string = '';

    constructor(private bookLibrary: Library<Book>, private userLibrary: Library<User>) {}

    public render(targetContainer?: HTMLElement): void {
        if (targetContainer) this.container = targetContainer;
        if (!this.container) return;
        
        this.container.innerHTML = '';

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'form-control mb-4';
        searchInput.placeholder = 'Пошук книг за назвою або автором...';
        searchInput.value = this.searchQuery;
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = (e.target as HTMLInputElement).value;
            this.currentPage = 1;
            this.render();
        });
        this.container.appendChild(searchInput);

        const header = document.createElement('h3');
        header.className = 'mb-3';
        header.textContent = 'Каталог книг';
        this.container.appendChild(header);

        const filteredBooks = this.bookLibrary.getAll().filter(b => 
            b.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
            b.author.toLowerCase().includes(this.searchQuery.toLowerCase())
        );

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const paginatedBooks = filteredBooks.slice(startIndex, startIndex + this.itemsPerPage);

        const listGroup = document.createElement('ul');
        listGroup.className = 'list-group mb-3 shadow-sm';

        const users = this.userLibrary.getAll();

        paginatedBooks.forEach(book => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2';
            li.innerHTML = `<span><strong>${book.title}</strong> - ${book.author} (${book.year})</span>`;
            
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'd-flex gap-2 align-items-center';

            if (book.isBorrowed) {
                const borrower = users.find(u => u.borrowedBooks.includes(book.id));
                actionsDiv.innerHTML = `<span class="badge bg-secondary">Позичено: ${borrower ? borrower.name : ''}</span>`;
                
                const returnBtn = Button.create('Повернути', 'btn-sm btn-outline-success', () => {
                    book.toggleBorrowStatus();
                    if (borrower) borrower.returnBook(book.id);
                    Storage.save('books', this.bookLibrary.getAll());
                    Storage.save('users', this.userLibrary.getAll());
                    Modal.toast('Книгу успішно повернуто!', 'success');
                    this.render();
                });
                actionsDiv.appendChild(returnBtn);
            } else {
                const userSelect = document.createElement('select');
                userSelect.className = 'form-select form-select-sm w-auto';
                userSelect.innerHTML = `<option value="">Оберіть читача</option>` + 
                    users.map(u => `<option value="${u.id}">${u.name}</option>`).join('');

                const borrowBtn = Button.create('Позичити', 'btn-sm btn-primary', () => {
                    if (!userSelect.value) return Modal.toast('Будь ласка, оберіть користувача', 'danger');
                    const user = this.userLibrary.findById(userSelect.value);
                    if (user) {
                        if (!user.canBorrow()) return Modal.show('Ліміт вичерпано!', `Користувач ${user.name} вже позичив 3 книги.`);
                        user.borrowBook(book.id);
                        book.toggleBorrowStatus();
                        Storage.save('books', this.bookLibrary.getAll());
                        Storage.save('users', this.userLibrary.getAll());
                        Modal.toast('Книгу успішно видано!', 'success');
                        this.render();
                    }
                });
                actionsDiv.append(userSelect, borrowBtn);
            }

            li.appendChild(actionsDiv);
            listGroup.appendChild(li);
        });

        this.container.appendChild(listGroup);

        const totalPages = Math.ceil(filteredBooks.length / this.itemsPerPage);
        if (totalPages > 1) {
            const paginationDiv = document.createElement('div');
            paginationDiv.className = 'd-flex justify-content-center gap-3 mb-4 align-items-center';

            const prevBtn = Button.create('← Попередня', 'btn-outline-primary btn-sm');
            prevBtn.disabled = this.currentPage === 1;
            prevBtn.onclick = () => { this.currentPage--; this.render(); };

            const nextBtn = Button.create('Наступна →', 'btn-outline-primary btn-sm');
            nextBtn.disabled = this.currentPage === totalPages;
            nextBtn.onclick = () => { this.currentPage++; this.render(); };

            paginationDiv.innerHTML = `<span class="fw-bold">Сторінка ${this.currentPage} з ${totalPages}</span>`;
            paginationDiv.prepend(prevBtn);
            paginationDiv.append(nextBtn);
            this.container.appendChild(paginationDiv);
        }
    }
}
