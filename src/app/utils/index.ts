export function arrayToHash<T, K extends keyof T>(array: T[], key: K): Record<string, T> {
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
