import Block from '../../core/Block';

const template = '<div class="message {{#if self}}message--self{{/if}}">{{text}}</div>';

export default class Message extends Block {
  render(): string {
    return template;
  }
}
