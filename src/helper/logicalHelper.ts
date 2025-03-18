export function ifNot(this: any, conditional: any, options: any): any {
  if (!conditional) {
    return options.fn(this);
  }
  return options.inverse(this);
}

export function not(conditional: any): any {
  return !conditional;
}

export function ifEquals(
  this: unknown,
  arg1: any,
  arg2: any,
  options: Handlebars.HelperOptions,
): string {
  return arg1 === arg2 ? options.fn(this) : options.inverse(this);
}
