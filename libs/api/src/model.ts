export function delay(timeout: number) {
  return new Promise((re) => {
    setTimeout(re, timeout);
  });
}
