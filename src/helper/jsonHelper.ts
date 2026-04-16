export function json(context: any): string {
  return JSON.stringify(context, null, 2);
}
