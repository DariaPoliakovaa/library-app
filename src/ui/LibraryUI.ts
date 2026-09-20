import { Library } from '../services/Library';
import { Book } from '../models/Book';
import { User } from '../models/User';

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
        
        leftCol.innerHTML = '<h3 class="mb-3">Управління даними</h3><p>Тут будуть форми...</p>';

        const rightCol = document.createElement('div');
        rightCol.className = 'col-md-7';
        rightCol.id = 'lists-container';
        
        rightCol.innerHTML = '<h3 class="mb-3">Списки</h3><p>Тут будуть книги та користувачі...</p>';

        row.appendChild(leftCol);
        row.appendChild(rightCol);
        container.appendChild(title);
        container.appendChild(row);

        this.appContainer.appendChild(container);
    }
}
