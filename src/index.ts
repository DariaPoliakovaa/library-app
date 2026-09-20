import 'bootstrap/dist/css/bootstrap.min.css';

const appContainer = document.getElementById('app');

if (appContainer) {
    const container = document.createElement('div');
    container.className = 'container mt-5 text-center';

    const title = document.createElement('h1');
    title.textContent = 'Система управління бібліотекою';
    title.className = 'text-primary mb-4';

    const btn = document.createElement('button');
    btn.className = 'btn btn-success btn-lg';
    btn.textContent = 'Bootstrap успішно підключено!';

    container.appendChild(title);
    container.appendChild(btn);
    appContainer.appendChild(container);
}
