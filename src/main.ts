import { Router } from './router';
import { renderLoginPage } from './page/login';
import { renderRegisterPage } from './page/register';
import { renderChatPage } from './page/chat';
import { renderMainPage } from './main/main';
import { renderError404 } from './page/error404';
import { renderError500 } from './page/error500';

const router = new Router('app');

router
  .use('/login', renderLoginPage)
  .use('/register', renderRegisterPage)
  .use('/chat', renderChatPage)
  .use('/error404', renderError404)
  .use('/error500', renderError500)
  .use('/', renderMainPage);

router.start();

// Навигация по клику на ссылки
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.tagName === 'A' && target.getAttribute('href')) {
    const href = target.getAttribute('href');
    if (href && href.startsWith('/')) {
      e.preventDefault();
      router.go(href);
    }
  }
});
