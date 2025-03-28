export function arrayToHash<T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T> {
  return array.reduce(
    (hash, item) => {
      // Use the value of the specified key as the hash key
      const hashKey = String(item[key]); // Ensure the key is a string
      hash[hashKey] = item;
      return hash;
    },
    {} as Record<string, T>
  );
}

export function groupBy<T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> {
  return array.reduce(
    (acc, item) => {
      const groupKey = String(item[key]);
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
}

export function getSetByKey<T, K extends keyof T>(
  array: T[],
  key: K
): Set<T[K]> {
  return new Set(array.map((item) => item[key]));
}
