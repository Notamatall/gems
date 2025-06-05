export function getElementByIdOrThrow<T = HTMLElement>(id: string) {
  const element = document.getElementById(id);
  if (!element) throw Error(`${id} not found`);
  return element as T;
}
