export class Modal {
    public static show(title: string, message: string): void {
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        const modal = document.createElement('div');
        modal.className = 'modal fade show d-block';
        modal.tabIndex = -1;

        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-warning"><h5 class="modal-title">${title}</h5></div>
                    <div class="modal-body"><p>${message}</p></div>
                    <div class="modal-footer"><button type="button" class="btn btn-secondary" id="close-modal">Закрити</button></div>
                </div>
            </div>`;

        document.body.appendChild(backdrop);
        document.body.appendChild(modal);

        modal.querySelector('#close-modal')?.addEventListener('click', () => {
            modal.remove();
            backdrop.remove();
        });
    }

    public static toast(message: string, type: 'success' | 'danger' | 'info' = 'info'): void {
        const toast = document.createElement('div');
        toast.className = `alert alert-${type} position-fixed bottom-0 end-0 m-3 shadow`;
        toast.style.zIndex = '9999';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}
