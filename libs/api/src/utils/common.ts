export function replaceIndex<T>(array: T[], index: number, value: T): T[] {
  array[index] = value;
  return array;
}

export function replaceMatch<T>(
  array: T[],
  match: (value: T, index: number) => boolean,
  value: T
): T[] {
  return array.map((item, i) => {
    if (match(item, i)) {
      return value;
    } else {
      return item;
    }
  });
}
