export type Reset<T> = T & { reset: () => void };
export function withReset<T>(data: T, reset: (initial: T) => void): Reset<T> {
  const initial = data;

  return {
    ...data,
    reset: () => reset(initial),
  };
}
