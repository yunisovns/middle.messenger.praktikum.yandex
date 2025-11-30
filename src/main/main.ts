import Handlebars from "handlebars";
import template from "./main.hbs?raw";

export function renderMainPage(): string {
  const compiled = Handlebars.compile(template);
  return compiled({});
}
