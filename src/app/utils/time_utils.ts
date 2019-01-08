export function parseDate(time: number): string {
  const date = new Date(time);

  return date.toLocaleString();
}
