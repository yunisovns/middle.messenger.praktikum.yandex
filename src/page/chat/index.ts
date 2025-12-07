import Handlebars from "handlebars";
import template from "./chat.hbs?raw";

export function renderChatPage(): string {
  const compiled = Handlebars.compile(template);
  return compiled({});
}
