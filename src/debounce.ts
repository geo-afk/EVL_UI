export function debounce<T extends unknown[]>(fn: (...args: T) => void, delay: number) {
  let timer: number | undefined;
  return (...args: T) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
}