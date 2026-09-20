import { Library } from '../../services/Library';
import { User } from '../../models/User';
import { Book } from '../../models/Book';
import { Storage } from '../../services/Storage';
import { Button } from './Button';
import { Modal } from './Modal';

export class UserList {
    private container: HTMLElement | null = null;

    constructor(private userLibrary: Library<User>, private bookLibrary: Library<Book>, private onUserChanged?: () => void) {}

    public render(targetContainer?: HTMLElement): void {
        if (targetContainer) this.container = targetContainer;
        if (!this.container) return;
        
        this.container.innerHTML = '';

        const header = document.createElement('h3');
        header.className = 'mb-3 mt-4';
        header.textContent = 'Список користувачів';
        this.container.appendChild(header);

        const users = this.userLibrary.getAll();

        if (users.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.className = 'text-muted';
            emptyMsg.textContent = 'Немає зареєстрованих користувачів.';
            this.container.appendChild(emptyMsg);
            return;
        }

        const listGroup = document.createElement('ul');
        listGroup.className = 'list-group mb-4 shadow-sm';

        const books = this.bookLibrary.getAll();

        users.forEach(user => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2';
            
            const borrowedBookTitles = user.borrowedBooks
                .map(bookId => books.find(b => b.id === bookId)?.title)
                .filter(Boolean)
                .join(', ');

            const userInfoHTML = `
                <div>
                    <strong>${user.name}</strong> (${user.email})<br>
                    <small class="text-muted">Позичені книги: ${borrowedBookTitles || 'немає'}</small>
                </div>
            `;
            
            const infoSpan = document.createElement('div');
            infoSpan.innerHTML = userInfoHTML;

            const deleteBtn = Button.create('Видалити', 'btn-sm btn-outline-danger', () => {
                this.userLibrary.remove(user.id);
                Storage.save('users', this.userLibrary.getAll());
                Modal.toast('Користувача видалено!', 'success');
                this.render();
                if (this.onUserChanged) this.onUserChanged();
            });

            li.appendChild(infoSpan);
            li.appendChild(deleteBtn);
            listGroup.appendChild(li);
        });

        this.container.appendChild(listGroup);
    }
}
