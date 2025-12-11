import Login from '../';
import Register from './page/Register/Register';
import Chats from './page/Chats/Chats';
import Settings from './page/Settings/Settings';

function mountPageByPath(path: string): void {
  const app = document.getElementById('app');
  if (!app) throw new Error('#app not found');
  // choose page
  let pageInstance;
  if (path === '/register') pageInstance = new Register();
  else if (path === '/settings') pageInstance = new Settings();
  else if (path === '/chats' || path === '/') pageInstance = new Chats();
  else pageInstance = new Login();

  pageInstance.mount('#app');

  // attach link handlers to navigate in-app using history pushState
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

mountPageByPath(window.location.pathname);

window.addEventListener('popstate', () => {
  mountPageByPath(window.location.pathname);
});
