import Handlebars from 'handlebars';
import template from './error404.hbs?raw';

export function renderError404(): string {
  const compiled = Handlebars.compile(template);
  return compiled({});
}
