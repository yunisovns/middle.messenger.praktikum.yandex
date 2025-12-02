import Handlebars from "handlebars";
import template from "./register.hbs?raw";

export function renderRegisterPage(): string {
  const compiled = Handlebars.compile(template);
  return compiled({});
}
