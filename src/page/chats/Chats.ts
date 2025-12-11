import Block from '../../core/Block';
import { serializeForm } from '../../utils/helpers';
import { validateMessage } from '../../utils/validator';

const template = `
<div class="page chats-page">
  <aside class="chats-list">
    <h2>Chats</h2>
    <ul id="chat-list"></ul>
  </aside>
  <section class="chat-window">
    <div class="messages" id="messages"></div>
    <form id="message-form" class="message-form">
      <input name="message" placeholder="Type a message" class="input" />
      <button type="submit" class="btn">Send</button>
    </form>
  </section>
</div>
`;

export default class Chats extends Block {
  constructor() {
    super({});
  }

  render(): string {
    return template;
  }

  protected componentDidMount(): void {
    const root = this.element;
    if (!root) return;

    const chatList = root.querySelector('#chat-list') as HTMLUListElement;
    const messages = root.querySelector('#messages') as HTMLElement;
    const form = root.querySelector('#message-form') as HTMLFormElement;
    const input = form.querySelector(
      'input[name="message"]',
    ) as HTMLInputElement;

    // sample data
    const sampleChats = [
      { id: '1', title: 'General' },
      { id: '2', title: 'Frontend' },
      { id: '3', title: 'Random' },
    ];

    sampleChats.forEach((c) => {
      const li = document.createElement('li');
      li.textContent = c.title;
      li.dataset.id = c.id;
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => {
        this.openChat(c.id, c.title, messages);
      });
      chatList.appendChild(li);
    });

    input.addEventListener('blur', () => {
      const res = validateMessage(input.value);
      input.dataset.error = res.valid ? '' : res.reason;
      this.updateError(input);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = serializeForm(form);
      const res = validateMessage(data.message ?? '');
      if (!res.valid) {
        input.dataset.error = res.reason;
        this.updateError(input);
        return;
      }
      // append message
      const msgEl = document.createElement('div');
      msgEl.className = 'message message--self';
      msgEl.textContent = String(data.message);
      messages.appendChild(msgEl);
      form.reset();
      console.log('Message sent:', data);
    });

    // open first chat by default
    this.openChat(sampleChats[0].id, sampleChats[0].title, messages);
  }

  private openChat(
    _id: string,
    title: string,
    messagesContainer: HTMLElement,
  ): void {
    const container = messagesContainer;

    container.innerHTML = '';

    const p = document.createElement('div');
    p.textContent = `Chat: ${title}`;
    container.appendChild(p);

    const m1 = document.createElement('div');
    m1.className = 'message';
    m1.textContent = 'Hello from others';
    container.appendChild(m1);

    const m2 = document.createElement('div');
    m2.className = 'message message--self';
    m2.textContent = 'My message';
    container.appendChild(m2);
  }

  private updateError(input: HTMLInputElement): void {
    let el = input.nextElementSibling as HTMLElement | null;
    if (el && el.classList.contains('error-text')) {
      el.textContent = input.dataset.error ?? '';
    } else {
      el = document.createElement('div');
      el.className = 'error-text';
      el.textContent = input.dataset.error ?? '';
      input.after(el);
    }
    if (input.dataset.error) input.classList.add('input--error');
    else input.classList.remove('input--error');
  }
}
