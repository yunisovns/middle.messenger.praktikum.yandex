import Handlebars from 'handlebars';
import template from './settings.hbs?raw';

export function renderSettingsPage(): string {
  const compiled = Handlebars.compile(template);
  return compiled({});
}
