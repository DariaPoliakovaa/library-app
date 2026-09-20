import { Library } from '../../services/Library';
import { User } from '../../models/User';
import { Storage } from '../../services/Storage';
import { Validation } from '../../utils/validators';
import { FormBuilder } from './FormBuilder';
import { Modal } from './Modal';

export class UserForm {
    constructor(
        private userLibrary: Library<User>,
        private onUserAdded: () => void,
    ) {}

    public render(container: HTMLElement): void {
        const card = document.createElement('div');
        card.className = 'card mb-4 shadow-sm';
        card.innerHTML =
            '<div class="card-body"><h5 class="card-title mb-3">Додати користувача</h5></div>';

        const form = document.createElement('form');
        const nameInput = FormBuilder.createInput('user-name', "Ім'я користувача");
        const emailInput = FormBuilder.createInput('user-email', 'Email', 'email');

        const submitBtn = document.createElement('button');
        submitBtn.className = 'btn btn-success w-100';
        submitBtn.textContent = 'Додати користувача';

        form.append(nameInput.wrapper, emailInput.wrapper, submitBtn);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (
                Validation.isRequired(nameInput.input.value) &&
                Validation.isRequired(emailInput.input.value)
            ) {
                const numericId = Math.floor(Math.random() * 1000000).toString();
                const newUser = new User(numericId, nameInput.input.value, emailInput.input.value);
                this.userLibrary.add(newUser);
                Storage.save('users', this.userLibrary.getAll());
                form.reset();
                Modal.toast('Користувача додано!', 'success');
                this.onUserAdded();
            } else {
                Modal.toast('Будь ласка, заповніть всі поля', 'danger');
            }
        });

        card.querySelector('.card-body')?.appendChild(form);
        container.appendChild(card);
    }
}
