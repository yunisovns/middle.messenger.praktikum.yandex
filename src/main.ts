import Block from './core/Block.ts';
import Chats from './pages/chats/Chats.ts';
import Login from './pages/login/Login.ts';
import Register from './pages/register/Register.ts';
import Settings from './pages/settings/settings.ts';
import './styles/styles.css';

function mountPageByPath(path: string): void {
  const app = document.getElementById('app');
  if (!app) throw new Error('#app not found');

  // Используем any, так как каждая страница имеет разные типы props
  // и мы не можем обобщить их до Record<string, unknown> без потери типизации
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pageInstance: Block<any>;

  if (path === '/register') pageInstance = new Register();
  else if (path === '/settings') pageInstance = new Settings();
  else if (path === '/chats' || path === '/') pageInstance = new Chats();
  else pageInstance = new Login();

  pageInstance.mount('#app');

  // Обработка кликов по ссылкам для навигации без перезагрузки
  document.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = (a as HTMLAnchorElement).getAttribute('href');
      if (href && href.startsWith('/')) {
        e.preventDefault();
        history.pushState({}, '', href);
        mountPageByPath(href);
      }
    });
  });
}

// Первоначальная загрузка страницы
mountPageByPath(window.location.pathname);

// Обработка навигации по истории (кнопки вперед/назад)
window.addEventListener('popstate', () => {
  mountPageByPath(window.location.pathname);
});