export class Button {
    public static create(text: string, styleClass: string, onClick?: () => void): HTMLButtonElement {
        const btn = document.createElement('button');
        btn.className = `btn ${styleClass}`;
        btn.textContent = text;
        if (onClick) {
            btn.addEventListener('click', onClick);
        }
        return btn;
    }
}
