export function queryStringify(
  data: Record<string, unknown>
): string {
  const params = Object.entries(data)
    .map(([key, value]) => {
      if (value === undefined || value === null) {
        return '';
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(
        String(value)
      )}`;
    })
    .filter(Boolean)
    .join('&');

  return params ? `?${params}` : '';
}
