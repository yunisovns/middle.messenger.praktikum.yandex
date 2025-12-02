import Handlebars from "handlebars";
import template from "./login.hbs?raw";

export function renderLoginPage(): string {
  const compiled = Handlebars.compile(template);
  return compiled({});
}
