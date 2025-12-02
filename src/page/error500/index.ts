import Handlebars from "handlebars";
import template from "./error500.hbs?raw";

export function renderError500(): string {
  const compiled = Handlebars.compile(template);
  return compiled({});
}
