export function serializeForm(form: HTMLFormElement): Record<string, string> {
  const formData = new FormData(form);
  const result: Record<string, string> = {};
  formData.forEach((value, key) => {
    result[key] = String(value);
  });
  return result;
}
